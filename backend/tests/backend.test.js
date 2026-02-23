import request from 'supertest';
import { app, initializeDatabase } from '../server.js';
import { pool } from '../database/index.js';

beforeAll(async () => {
    await initializeDatabase();
    await pool.query('DELETE FROM ticket_draw_entries');
    await pool.query('DELETE FROM ticket_draws');
    await pool.query('DELETE FROM attractions');
});

afterAll(async () => {
    await pool.end();
});

//--- ATTRACTION TESTS ---
describe('Attractions API', () => {

    test('POST /api/attractions should create a new attraction and trim inputs', async () => {
        const newArt = {
            title: "  London Eye  ",
            description: "A big wheel.",
            location: " London ",
            img: "eye.jpg"
        };
        const res = await request(app).post('/api/attractions').send(newArt);
        
        expect(res.statusCode).toBe(201);
        expect(res.body.attraction.title).toBe("London Eye");
        expect(res.body.attraction.location).toBe("London");
    });

    test('GET /api/attractions should return an array of attractions', async () => {
        const res = await request(app).get('/api/attractions');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.attractions)).toBe(true);
        expect(res.body.attractions.length).toBeGreaterThan(0);
    });

    test('DELETE /api/attractions/:id should fail if not admin', async () => {
        const res = await request(app).delete('/api/attractions/1');
        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe('you need to me an admin');
    });
});

//--- TICKET DRAWS TESTS ---
describe('Ticket Draws API', () => {
    let testDrawId;

    test('POST /api/ticket-draws should save a new draw', async () => {
        const draw = { 
            title: "  Summer Fest  ", 
            venue: " Park ", 
            eventdate: "2026-07-01",
            enterfrom: "2026-01-01",
            enteruntil: "2026-06-01",
            img: "test.jpg"
        };
        const res = await request(app).post('/api/ticket-draws').send(draw);
        
        expect(res.statusCode).toBe(201);
        expect(res.body.ticket_draw.title).toBe("Summer Fest");
        testDrawId = res.body.ticket_draw.id;
    });

    test('GET /api/ticket-draws should fetch the draw', async () => {
        const res = await request(app).get('/api/ticket-draws');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.ticketDraws)).toBe(true);
        expect(res.body.ticketDraws.length).toBeGreaterThan(0);
    });

    test('deleteTicketDraw should return 403 if not admin', async () => {
        const res = await request(app).delete(`/api/ticket-draws/${testDrawId}`);
        expect(res.statusCode).toBe(403);
        expect(res.body.error).toMatch('you need to be an admin'); 
    });

    test('enterDraw should return 401 if user not logged in', async () => {
        const res = await request(app)
            .post('/api/ticket-draws/enter')
            .send({ ticketDrawId: testDrawId });
        
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Login Required');
    });
});