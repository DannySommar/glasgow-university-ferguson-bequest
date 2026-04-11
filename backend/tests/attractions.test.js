import request from 'supertest';
import { app } from '../server.js';
import { pool } from '../database/index.js';
import bcrypt from 'bcrypt';

let adminCookie;
let nonAdminCookie;

beforeAll(async () => {
  // Clean test DB
  await pool.query(`
    TRUNCATE attractions, users
    RESTART IDENTITY CASCADE;
  `);

  // Create admin user
  const adminHash = await bcrypt.hash('adminpass', 10);
  await pool.query(
    `INSERT INTO users (email, username, password_hash, is_admin)
     VALUES ($1, $2, $3, $4)`,
    ['admin@example.com', 'admin', adminHash, true]
  );

  // Create non-admin user
  const userHash = await bcrypt.hash('userpass', 10);
  await pool.query(
    `INSERT INTO users (email, username, password_hash, is_admin)
     VALUES ($1, $2, $3, $4)`,
    ['user@example.com', 'user', userHash, false]
  );

  // Login admin to get session cookie
  const adminLoginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'adminpass' });
  adminCookie = adminLoginRes.headers['set-cookie'];

  // Login non-admin to get session cookie
  const userLoginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'user', password: 'userpass' });
  nonAdminCookie = userLoginRes.headers['set-cookie'];
});

afterAll(async () => {
  await pool.end();
});

describe('Attractions API', () => {

  test('GET /api/attractions returns an array', async () => {
    const res = await request(app).get('/api/attractions');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.attractions)).toBe(true);
  });

  test('POST /api/attractions creates a new attraction (admin only)', async () => {
    const newAttraction = {
      title: '  London Eye  ',
      description: '  Big wheel  ',
      location: ' London ',
      ticketCodes: ` CODE${Date.now()}, CODE${Date.now()+1} ` 
    };

    const res = await request(app)
      .post('/api/attractions')
      .set('Cookie', adminCookie)
      .send(newAttraction);

    expect(res.statusCode).toBe(201);
    expect(res.body.attraction.title).toBe('London Eye');
    expect(res.body.attraction.location).toBe('London');
    expect(res.body.attraction.img).toBeDefined();
  });

  test('POST /api/attractions fails for non-admin (router-level)', async () => {
    const res = await request(app)
      .post('/api/attractions')
      .set('Cookie', nonAdminCookie)
      .send({ title: 'Test', location: 'Test' });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });

  test('POST /api/attractions validates missing fields', async () => {
    const res = await request(app)
      .post('/api/attractions')
      .set('Cookie', adminCookie)
      .send({ title: '' });

    expect(res.statusCode).toBe(400);
  });

  test('DELETE /api/attractions/:id deletes an attraction (admin only)', async () => {
    // Create one to delete
    const createRes = await request(app)
      .post('/api/attractions')
      .set('Cookie', adminCookie)
      .send({ title: 'Delete Me', location: 'Nowhere',  ticketCodes: 'CODE1' });

    const id = createRes.body.attraction.id;

    const res = await request(app)
      .delete(`/api/attractions/${id}`)
      .set('Cookie', adminCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('attraction deleted');
  });

  test('DELETE /api/attractions/:id returns 404 for non-existent ID', async () => {
    const res = await request(app)
      .delete('/api/attractions/99999')
      .set('Cookie', adminCookie);

    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/attractions/:id fails for non-admin (controller-level)', async () => {
    const res = await request(app)
      .delete('/api/attractions/1')
      .set('Cookie', nonAdminCookie);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });

});