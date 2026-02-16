import { pool } from '../database/index.js'

export async function getTicketDraws(req, res) {
  try {
    const result = await pool.query('SELECT * FROM ticket_draws')
    res.json({ ticketDraws: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'failed to fetch ticket draws' })
  }
}

export async function enterDraw(req, res) {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Login Required'});

    const { ticketDrawId } = req.body;
    if (!ticketDrawId ) {
        return res.status(400).json({ error: 'ticketDrawId is Required'})
    }

    const client = await pool.connect();
    try {
        await client.query(
            'INSERT INTO ticket_draw_entries (user_id, ticket_draw_id) VALUES ($1, $2)',
            [userId, ticketDrawId]
        );
        res.status(201).json({ message: 'Entered Draw', ticketDrawId });
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