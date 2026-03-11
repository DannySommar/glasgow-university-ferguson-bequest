import {pool} from '../database/index.js'

export async function getAttractions(req, res) {
    try {
        console.log('getting attractions attractions.json');
        
        // for now, just return all attractions from the JSON file
        const result = await pool.query('SELECT * FROM attractions')
        
        // query for filter will be implemented here of needed

        
        res.json({ attractions: result.rows });

        
    } catch (err) {
        console.error('error fetching attractions:', err);
        res.status(500).json({ error: 'failed to fetch all attractions' });
    }
}

export async function deleteAttraction(req, res) {
    try {
        // check if user is admin!!!
        if (!req.session.isAdmin) {
            return res.status(403).json({ error: 'you need to me an admin' });
        }

        const { id } = req.params;

        // Deletes the ticket codes for the attraction
        const removeCodes = await pool.query(
            'DELETE FROM ticket_codes WHERE attraction_id = $1 RETURNING id',
            [id]
        )

        const result = await pool.query(
            'DELETE FROM attractions WHERE id = $1 RETURNING id',
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'attraction not found' });
        }

        res.json({ message: 'attraction deleted' });
    } catch (err) {
        console.error('error deleting attraction:', err);
        res.status(500).json({ error: 'deletion of attraction failed' });
    }
}

export async function createAttraction(req, res) {
    let { title, description, location, ticketCodes } = req.body

    title = title?.trim()
    description = description?.trim()
    location = location?.trim()
    ticketCodes = ticketCodes?.split(",").map(code => code.trim())

    if (!title || !location) {
        return res.status(400).json({ error: 'Title and location required' })
    }

    const client = await pool.connect()

    try {
        let imgPath = '/uploads/attractions/default.png'
        
        if (req.file) {
            // multer filename will be diff
            imgPath = `/uploads/attractions/${req.file.filename}`
            console.log('File saved in :', req.file.filename) //will be in the docker container, not your working env
        }

        const result = await client.query(
            'INSERT INTO attractions (title, description, location, img) VALUES ($1, $2, $3, $4) RETURNING id, title, description, location, img',
            [title, description, location, imgPath]
        )

        const attraction_id = result.rows[0].id

        // Loops through ticket code array and add each one into database
        for (const code of ticketCodes) {
            const insertCodes = await client.query(
                'INSERT INTO ticket_codes (code, attraction_id, booking_id) VALUES ($1, $2, $3) RETURNING id, code, attraction_id, booking_id',
                [code, attraction_id, null]
            )
        }

        res.status(201).json({
            message: 'attraction created',
            attraction: result.rows[0]
        })
        
    } catch (err) {
        console.error('attraction creation error: ', err.message)
        res.status(500).json({error: 'Attraction creation failed. Please try again. '})
    } finally {
        client.release()
    }
}