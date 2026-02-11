import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app, initializeDatabase } from '../server.js';
import { pool } from '../database/index.js';

const password = 'pass123';

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeDatabase();
    await pool.query('DELETE FROM users');
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
        'INSERT INTO users (email, username, password_hash, is_admin) VALUES ($1, $2, $3, $4)',
        ['test@example.com', 'tester', hash, false]
    );
});

afterAll(async () => {
    await pool.end();
});

test('happy path sets session cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'tester', password }); 
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe('tester');
    expect(res.headers['set-cookie'][0]).toMatch(/connect.sid/);
});

test('wrong password is 401 with no cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'tester', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeUndefined();
});

test('missing fields is 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
});