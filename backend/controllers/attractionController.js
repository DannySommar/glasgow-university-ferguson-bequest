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