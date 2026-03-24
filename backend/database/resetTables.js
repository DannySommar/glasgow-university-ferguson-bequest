import { createTables } from './createTables.js'
import { seedTables } from './seedTables.js'
import { pool } from './index.js'


// DONT USE IT DURING DEPLOYMENT
export async function resetTables() {
    const client = await pool.connect()
    
    
  try {
        
        // WILL DELETE ALL DATA 
        await client.query('DROP TABLE IF EXISTS ticket_codes CASCADE')
        await client.query('DROP TABLE IF EXISTS ticket_draw_entries CASCADE')
        await client.query('DROP TABLE IF EXISTS ticket_draw_winners CASCADE')
        await client.query('DROP TABLE IF EXISTS reviews CASCADE')
        await client.query('DROP TABLE IF EXISTS bookings CASCADE')
        await client.query('DROP TABLE IF EXISTS attractions CASCADE')
        await client.query('DROP TABLE IF EXISTS ticket_draws CASCADE')
        await client.query('DROP TABLE IF EXISTS users CASCADE')
        await client.query('DROP TABLE IF EXISTS announcements CASCADE')



        await createTables()
        await seedTables()
        
        console.log('All tables reset and reseeded')

    } catch (err) {
        console.error('error dropping table:', err)
        throw err
    } finally {
        client.release()
    }
}