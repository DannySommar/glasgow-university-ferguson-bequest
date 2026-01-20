import { pool } from "../database/index.js";

export async function getCurrentUser(req, res) {
    
    const client = await pool.connect();
    try {

        if (!req.session.userId) {
            return res.json({ isLoggedIn: false })
        }
        
        const result = await client.query('SELECT id, email, username, is_admin FROM users WHERE id = $1', [req.session.userId])
        
        if (result.rows.length === 0) {
            return res.json({ isLoggedIn: false })
        }

        const user = result.rows[0]

        res.json({ 
            isLoggedIn: true, 
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.is_admin
        })

    } catch (err) {
        console.error('getCurrentUser error:', err)
        res.status(500).json({ error: 'Internal server error' })
    } finally {
        client.release()
    }
} 