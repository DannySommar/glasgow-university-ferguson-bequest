import { createTables } from './createTables.js'
import { seedTables } from './seedTables.js'
import { pool } from './index.js'


// DONT USE IT DURING DEPLOYMENT
export async function resetAttractionsTable() {
    const client = await pool.connect()
    
    
  try {
    await client.query('DROP TABLE IF EXISTS ticket_draws CASCADE');
    await client.query('DROP TABLE IF EXISTS attractions CASCADE');

    await createTables();
    await seedTables();

    console.log('All tables reset and reseeded');
        
    } catch (err) {
        console.error('error dropping table:', err)
        throw err
    } finally {
        client.release()
    }
}