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