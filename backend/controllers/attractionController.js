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
    let { title, description, location, img } = req.body

    title = title.trim()
    description = description.trim()
    location = location.trim()

    img = img || 'default.jpg'

    const client = await pool.connect()

    try {
        const result = await client.query(
            'INSERT INTO attractions (title, description, location, img) VALUES ($1, $2, $3, $4) returning id, title, description, location',
            [title, description, location, img]
        )

        const attraction = result.rows[0]

        res.status(201).json({
            message: 'attraction created',
            attraction: {
                id: attraction.id,
                title: attraction.title,
                description: attraction.description,
                location: attraction.location
            }
        })
    } catch (err) {
        console.error('attraction creation error: ', err.message)
        res.status(500).json({error: 'Attraction creation failed. Please try again. '})
    } finally {
        client.release()
    }
}