
import request from 'supertest';
import bcrypt from "bcryptjs";
import {app, initializeDatabase} from '../server.js';
import {pool} from '../database/index.js';




const password = 'pass123'

let agent;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeDatabase();

    await pool.query('TRUNCATE reviews, users, attractions RESTART IDENTITY CASCADE;');
    //await pool.query('DELETE FROM users');

    const hash = await bcrypt.hash(password,10);

    await pool.query('INSERT INTO users (id, email, username, password_hash, is_admin) VALUES ($1, $2,$3,$4,$5)', [2, 'test@example.com', 'tester', hash, false]);

    await pool.query('INSERT INTO attractions (id, title, location) VALUES ($1,$2,$3)', [5, "test attraction", "Scotland"]);

    agent = request.agent(app);

    await agent.post('/api/auth/login').send({username:'tester', password});
    
});

afterAll(async () => {
    await pool.end();
});

test('create a review', async()=>{
    const res = await agent.post('/api/reviews').send({attraction_id: 5, rating:4, comment:"Nice attraction"});
    
    expect(res.statusCode).toBe(201);

    expect(res.body.rating).toBe(4);
    expect(res.body.comment).toBe("Nice attraction");
    expect(res.body.username).toBe('tester');

});

test('returns 400 if missing fields', async()=>{
    const res = await agent.post('/api/reviews').send({});

    expect(res.statusCode).toBe(400);
})

test('get reviews for attraction', async() =>{

   
    const res = await agent.get('/api/reviews/attraction/5');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.reviews)).toBe(true);
    expect(res.body.reviews[0].username).toBe('tester');
    expect(res.body.reviews[0].rating).toBe(4);
    expect(res.body.reviews[0].comment).toBe('Nice attraction');

});