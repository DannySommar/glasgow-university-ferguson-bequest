export async function getAttractions(req, res) {
    try {
        console.log('getting attractions from database')
        // let query = 'SELECT * FROM posts'
        let params = []
        let whereConditions = []
        let paramCount = 0

        // const { attraction , seach_par_maybe } = req.query

        if (attraction)
        {
            paramCount++
            whereConditions.push(`$${paramCount} = ANY(attractions)`)
            params.push(attraction)
        }
        // if (something else)
        //{
        //   paramCount++
        //   const searchPattern = `%${search}%`
        //   whereConditions.push(`(title ILIKE $${paramCount} OR content ILIKE $${paramCount})`)
        //   params.push(searchPattern)
        // }

        if (whereConditions.length > 0)
        {
            query += ' WHERE ' + whereConditions.join(' AND ')
        }

        const result = await pool.query(query, params)
        res.json(result.rows)
    } catch (err) {
        console.error('error fetching attractions:', err)
        res.status(500).json({error: 'failed to fetch attractions'})
    }
}