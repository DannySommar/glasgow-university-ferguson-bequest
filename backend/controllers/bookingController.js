import { pool } from '../database/index.js'

export async function getBookings(req, res){
    try {
        const user_id = req.session.userId

        // Join together all of the information related to a booking
        const result = await pool.query(
            `SELECT B.*, T.code, A.title, A.img, A.description, A.location
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
    }
}

export async function deleteBooking(req, res) {
    try {
        const { id } = req.params;
        
        // Sets the booking attribute for the code to null, so code is then available again
        const removeBookingFromCode = await pool.query(
            'UPDATE ticket_codes SET booking_id = NULL WHERE booking_id = $1',
            [id]
        )

        // Deletes the booking from the table
        const deleteBooking = await pool.query(
            'DELETE FROM bookings WHERE id = $1 RETURNING id',
            [id]
        )

        if (deleteBooking.rowCount === 0) {
            return res.status(404).json({ error: 'booking not found' });
        }

        res.json({ message: 'booking deleted' });
    } catch (err) {
        console.error('error deleting booking:', err);
        res.status(500).json({ error: 'deletion of booking failed' });
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
        // Finds bookings for the attraction that a user is trying to book
        const existingBooking = await client.query(
            'SELECT * FROM bookings WHERE attraction_id = $1 AND user_id = $2',
            [attraction_id, user_id]
        )

        const checkExistingBooking = existingBooking.rows[0]
        // If there is already an existing booking for the attraction the booking is cancelled
        if (checkExistingBooking) {
            return res.status(400).json({error: "There is already an existing booking for that attraction, booking has been cancelled."})
        }

        // Inserts a new booking into the table
        const result = await client.query(
            'INSERT INTO bookings (user_id, attraction_id, status) VALUES ($1, $2, $3) RETURNING *',
            [user_id, attraction_id, status]
        )

        const booking = result.rows[0]

        // Finds a single code that is for a specific attraction that does not have a booking
        const code = await client.query(
            'SELECT * FROM ticket_codes WHERE attraction_id = $1 and booking_id IS NULL LIMIT 1',
            [attraction_id]
        )

        const unassigned_code = code.rows[0]
        // If there are no available codes then the booking is removed
        if (!unassigned_code) {
            const remove = await client.query(
                'DELETE FROM bookings where id = $1',
                [booking.id]
            )
            return res.status(400).json({error: "There are no unassigned codes, booking has been cancelled."})
        }

        // Assigns the code to the new booking that was just created
        const updated_code = await client.query(
            'UPDATE ticket_codes SET booking_id = $1 WHERE id = $2 RETURNING *',
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

export async function changeBookingStatus(req, res) {
    try {
        const { id } = req.params
        const newStatus = "attended"
        
        // Updates the status of a booking to attended
        const result = await pool.query(
            'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
            [newStatus, id]
        )

        res.json({ message: "booking updated"})
    } catch (err) {
        console.error('error updating bookings: ', err)
        res.status(500).json({ error: 'failed to update the bookings' })
    }
}