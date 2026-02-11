import { pool } from './index.js'


// DONT USE IT DURING DEPLOYMENT
export async function resetTables() {
    const client = await pool.connect()
    
    try {
        console.log('<- Dropping attractions table')
        
        // WILL DELETE ALL DATA 
        await client.query('DROP TABLE IF EXISTS reviews CASCADE')
        await client.query('DROP TABLE IF EXISTS bookings CASCADE')
        await client.query('DROP TABLE IF EXISTS attractions CASCADE')
        await client.query('DROP TABLE IF EXISTS users CASCADE')

        console.log('-> All table dropped')
        
        // create again
        await client.query(`
            CREATE TABLE attractions (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                img VARCHAR(255) NOT NULL,
                description TEXT,
                location VARCHAR(255)
            )
        `)
        
        console.log('table recreated in resetTables.js')
        
    } catch (err) {
        console.error('error dropping table:', err)
        throw err
    } finally {
        client.release()
    }
}