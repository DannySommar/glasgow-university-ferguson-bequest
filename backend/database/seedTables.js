import { pool } from './index.js'
import { attractions } from './data.js'

export async function seedTables() {
    const client = await pool.connect()

    try {
        
        const result = await client.query('SELECT COUNT(*) FROM attractions')
        const count = parseInt(result.rows[0].count)

        if (count === 0) {
            
            for (const attraction of attractions) {
                await client.query(
                    `INSERT INTO attractions (title, img, description) 
                     VALUES ($1, $2, $3)`,
                    [attraction.title, attraction.img, attraction.description]
                )
            }
            
            console.log(`made ${attractions.length} attractions`)
        }
        
        // to know if potential updates arent working, this may be the cause
        else     
        {
            console.log(`attraction table already exists`)
        }
    } catch (err) {
        console.error('error seeding attractions :', err)
        throw err
    } finally {
        client.release()
    }
}