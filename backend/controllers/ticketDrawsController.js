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

export async function createTicketDraw(req, res) {
    let { title, venue, eventdate, enterfrom, enteruntil, showurl, img } = req.body

    title = title.trim()
    venue = venue.trim()
    img = img || 'default.jpg'

    const client = await pool.connect()

    try {
        const result = await client.query(
            `INSERT INTO ticket_draws 
            (title, venue, eventdate, enterfrom, enteruntil, showurl, img) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, title, venue, eventdate, enterfrom, enteruntil, showurl, img`,
            [title, venue, eventdate, enterfrom, enteruntil, showurl, img]
        )

        const draw = result.rows[0]

        res.status(201).json({
            message: 'ticket draw created',
            ticket_draw: draw
        })
    } catch (err) {
        console.error('ticket draw creation error:', err.message)
        res.status(500).json({ error: 'Ticket Draw creation failed. Please try again.' })
    } finally {
        client.release()
    }
}

export async function deleteTicketDraw(req, res) {
    try {
        // check if user is admin!!!
        if (!req.session.isAdmin) {
            return res.status(403).json({ error: 'you need to be an admin' });
        }

        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM ticket_draws WHERE id = $1 RETURNING id',
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'ticket draw not found' });
        }

        res.json({ message: 'ticket draw deleted' });
    } catch (err) {
        console.error('error deleting ticket draw:', err);
        res.status(500).json({ error: 'deletion of ticket draw failed' });
    }
}

export async function pickWinner(req, res) {
    if (!req.session.isAdmin) return res.status(403).json({ error: 'Admin Only' });

    const { ticketDrawId } = req.body;
    if (!ticketDrawId) return res.status(400).json({ error:'Ticket Draw ID is required' });

    const client = await pool.connect();
    try {
        const entry = await client.query(
            'SELECT e.user_id FROM ticket_draw_entries e WHERE e.ticket_draw_id = $1 AND NOT EXISTS (SELECT 1 FROM ticket_draw_winners w WHERE w.user_id = e.user_id AND w.selected_at >= date_trunc(\'year\', CURRENT_DATE)) ORDER BY random() LIMIT 1',
            [ticketDrawId]
        );

        if (entry.rowCount === 0) return res.status(404).json({ error: 'No entries for this draw' });
        
        const userId = entry.rows[0].user_id;

        await client.query(
            'INSERT INTO ticket_draw_winners (ticket_draw_id, user_id) VALUES ($1, $2) ON CONFLICT (ticket_draw_id, user_id) DO NOTHING',
            [ticketDrawId, userId]
        );

        const user = await client.query('SELECT id, username, email FROM users WHERE id = $1', [userId])

        res.json({ winner: user.rows[0], ticketDrawId });
    } catch (err) {
        console.error('pick winner error:', err);
        res.status(500).json({ error: 'Could not pick a winner' });
    } finally {
        client.release();
    }
    
}

export async function updateTicketDraw(req, res) {

    if (!req.session.isAdmin) return res.status(403).json({error: 'Admin Only'});
    const { id } = req.params;
    const { title, venue, eventdate, enterfrom, enteruntil, showurl, img } = req.body;

    try {
        const result = await pool.query(
            `UPDATE ticket_draws 
            SET title = COALESCE($1, title),
                venue = COALESCE($2, venue),
                eventdate = COALESCE($3, eventdate),
                enterfrom = COALESCE($4, enterfrom),
                enteruntil = COALESCE($5, enteruntil),
                showurl = COALESCE($6, showurl),
                img = COALESCE($7, img)
            WHERE id = $8
            RETURNING *`,
            [title?.trim() || null, venue?.trim() || null, eventdate || null, enterfrom || null, enteruntil || null, showurl || null, img || null, id]
        );
    
        if (result.rowCount === 0) return res.status(404).json({error: 'Ticket Draw Not Found'});
        res.json({ message: 'Ticket Draw Updated', ticketDraw: result.rows[0] });
    } catch (err) {
        console.error('Error Updating Ticket Draw:', err);
        res.status(500).json({ error: 'Failed To Update Ticket Draw' })
    }
}
