import request from 'supertest';
import { app } from '../server.js';
import { pool } from '../database/index.js';
import bcrypt from 'bcrypt';

let adminCookie;
let userCookie;
let testDrawId;

beforeAll(async () => {
  await pool.query(`
    TRUNCATE users, ticket_draws, ticket_draw_entries, ticket_draw_winners
    RESTART IDENTITY CASCADE;
  `);

  // Create admin
  const adminHash = await bcrypt.hash('adminpass', 10);
  await pool.query(
    `INSERT INTO users (email, username, password_hash, is_admin)
     VALUES ($1, $2, $3, $4)`,
    ['admin@example.com', 'admin', adminHash, true]
  );

  // Create normal user
  const userHash = await bcrypt.hash('userpass', 10);
  await pool.query(
    `INSERT INTO users (email, username, password_hash, is_admin)
     VALUES ($1, $2, $3, $4)`,
    ['user@example.com', 'user1', userHash, false]
  );

  // Login admin
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'adminpass' });
  adminCookie = adminRes.headers['set-cookie'];

  // Login normal user
  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'user1', password: 'userpass' });
  userCookie = userRes.headers['set-cookie'];
});

afterAll(async () => {
  await pool.end();
});

describe('Ticket Draws API', () => {

  test('GET /api/ticket-draws returns an array', async () => {
    const res = await request(app).get('/api/ticket-draws');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.ticketDraws)).toBe(true);
  });

  test('POST /api/ticket-draws creates a new draw', async () => {
    const draw = {
      title: '  Free Tickets  ',
      venue: '  Glasgow  ',
      eventdate: '2026-05-01',
      enterfrom: '2026-04-01',
      enteruntil: '2026-04-20',
      showurl: 'http://example.com',
      img: 'poster.jpg'
    };

    const res = await request(app)
      .post('/api/ticket-draws')
      .send(draw);

    expect(res.statusCode).toBe(201);
    expect(res.body.ticket_draw.title).toBe('Free Tickets');
    expect(res.body.ticket_draw.venue).toBe('Glasgow');

    testDrawId = res.body.ticket_draw.id;
  });

  test('POST /api/ticket-draws/enter allows a logged-in user to enter', async () => {
    const res = await request(app)
      .post('/api/ticket-draws/enter')
      .set('Cookie', userCookie)
      .send({ ticketDrawId: testDrawId });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Entered Draw');
  });

  test('POST /api/ticket-draws/enter prevents duplicate entry', async () => {
    const res = await request(app)
      .post('/api/ticket-draws/enter')
      .set('Cookie', userCookie)
      .send({ ticketDrawId: testDrawId });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('Already entered this draw');
  });

  test('POST /api/ticket-draws/enter requires login', async () => {
    const res = await request(app)
      .post('/api/ticket-draws/enter')
      .send({ ticketDrawId: testDrawId });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Login Required');
  });

  test('POST /api/ticket-draws/pick-winner selects a winner (admin only)', async () => {
    const res = await request(app)
      .post('/api/ticket-draws/pick-winner')
      .set('Cookie', adminCookie)
      .send({ ticketDrawId: testDrawId });

    expect(res.statusCode).toBe(200);
    expect(res.body.winner.username).toBe('user1');
    expect(res.body.ticketDrawId).toBe(testDrawId);
  });

  test('POST /api/ticket-draws/pick-winner fails for non-admin', async () => {
    const res = await request(app)
      .post('/api/ticket-draws/pick-winner')
      .set('Cookie', userCookie)
      .send({ ticketDrawId: testDrawId });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Admin Only');
  });

  test('DELETE /api/ticket-draws/:id deletes a draw (admin only)', async () => {
    const res = await request(app)
      .delete(`/api/ticket-draws/${testDrawId}`)
      .set('Cookie', adminCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('ticket draw deleted');
  });

  test('DELETE /api/ticket-draws/:id returns 404 for missing draw', async () => {
    const res = await request(app)
      .delete('/api/ticket-draws/9999')
      .set('Cookie', adminCookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('ticket draw not found');
  });

  test('DELETE /api/ticket-draws/:id fails for non-admin', async () => {
    const res = await request(app)
      .delete(`/api/ticket-draws/${testDrawId}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('you need to be an admin');
  });

});