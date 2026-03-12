import { pool } from '../database/index.js'

export async function getAnnouncements(req, res) {
  try {
    const result = await pool.query(
      `SELECT a.*, u.username AS admin_name
       FROM announcements a
       LEFT JOIN users u ON a.created_by = u.id
       ORDER BY created_at DESC`
    )

    res.json({ announcements: result.rows })
  } catch (err) {
    console.error('error fetching announcements:', err)
    res.status(500).json({ error: 'failed to fetch announcements' })
  }
}

export async function createAnnouncement(req, res) {
  try {
    const { title, body } = req.body
    const adminId = req.session.userId

    if (!adminId) {
      return res.status(401).json({ error: 'not logged in' })
    }

    const userCheck = await pool.query(
      `SELECT is_admin FROM users WHERE id = $1`,
      [adminId]
    )

    if (!userCheck.rows[0]?.is_admin) {
      return res.status(403).json({ error: 'admin only' })
    }

    const result = await pool.query(
      `INSERT INTO announcements (title, body, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title.trim(), body.trim(), adminId]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('error creating announcement:', err)
    res.status(500).json({ error: 'failed to create announcement' })
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const adminId = req.session.userId

    if (!adminId) {
      return res.status(401).json({ error: 'not logged in' })
    }

    const userCheck = await pool.query(
      `SELECT is_admin FROM users WHERE id = $1`,
      [adminId]
    )

    if (!userCheck.rows[0]?.is_admin) {
      return res.status(403).json({ error: 'admin only' })
    }

    const result = await pool.query(
      `DELETE FROM announcements WHERE id = $1 RETURNING *`,
      [req.params.id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'announcement not found' })
    }

    res.json({ message: 'announcement deleted' })
  } catch (err) {
    console.error('error deleting announcement:', err)
    res.status(500).json({ error: 'failed to delete announcement' })
  }
}
