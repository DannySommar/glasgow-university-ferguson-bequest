import { pool } from '../database/index.js'

export async function getBookings(req, res){
    try {
        const user_id = req.session.userId
        const client = await pool.connect()

        const result = await client.query(
            `SELECT B.*, T.code, A.*
            FROM bookings B
            JOIN ticket_codes T on B.id = T.booking_id
            JOIN attractions A on B.attraction_id = A.id
            WHERE B.user_id = $1`,
            [user_id]
        )

        res.json({bookings: result.rows})
    } catch (err) {
        console.error('error fetching bookings: ', err)
        res.status(500).json({error: 'failed to fetch the bookings'})
    } finally {
        client.release()
    }
}

export async function createBooking(req, res) {
    const { attraction_id } = req.body

    const status = "upcoming"
    const user_id = req.session.userId

    if (!user_id) {
        return res.status(401).json({ error: 'not logged in' })
    }

    const client = await pool.connect()

    try {
        // Inserts a new booking into the table
        const result = await client.query(
            'INSERT INTO bookings (user_id, attraction_id, status) VALUES ($1, $2, $3) returning id, user_id, attraction_id, status',
            [user_id, attraction_id, status]
        )

        const booking = result.rows[0]

        // Finds a single code that is for a specific attraction that does not have a booking
        const code = await client.query(
            'SELECT * FROM ticket_codes WHERE attraction_id = $1 and booking_id IS NULL LIMIT 1',
            [attraction_id]
        )

        const unassigned_code = code.rows[0]
        if (!unassigned_code) {
            return res.status(400).json({error: "There are no unassigned codes"})
        }

        // Assigns the code to the new booking that was just created
        const updated_code = await client.query(
            'UPDATE ticket_codes SET booking_id = $1 WHERE id = $2 returning id, code, attraction_id, booking_id',
            [booking.id, unassigned_code.id]
        )

        const assigned_code = updated_code.rows[0]

        res.status(201).json({
            message: 'booking created',
            booking: {
                id: booking.id,
                user_id: booking.user_id,
                attraction_id: booking.attraction_id,
                status: booking.status
            },
            ticket_code: {
                id: assigned_code.id,
                code: assigned_code.code,
                attraction_id: assigned_code.attraction_id,
                booking_id: assigned_code.booking_id
            }
        })
    } catch (err) {
        console.error('booking creation error: ', err.message)
        res.status(500).json({error: 'Booking creation failed. Please try again.'})
    } finally {
        client.release()
    }
}