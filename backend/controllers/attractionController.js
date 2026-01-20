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