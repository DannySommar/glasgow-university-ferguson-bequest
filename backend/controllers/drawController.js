
import { pool } from '../database/index.js';

export async function enterDraw(req, res) {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Login Required'});

    const { attraction } = req.body;
    if (!attraction || !attraction.trim()) {
        return res.status(400).json({ error: 'Attraction is Required'})
    }

    const client = await pool.connect();
    try {
        await client.query(
            'INSERT INTO ticket_draw_entries (user_id, attraction) VALUES ($1, $2)',
            [userId, attraction.trim()]
        );
        res.status(201).json({ message: 'Entered Draw', attraction: attraction.trim() });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Already entered this draw'});
        }
        console.error('enter draw error:', err);
        res.status(500).json({ error: 'Could not enter draw. Try again.'});
    }finally {
        client.release();
    }


}