import { pool } from './index.js'

export async function createTables() {
    const client = await pool.connect()

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS attractions (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                image VARCHAR(255),
                description TEXT,
                location VARCHAR(255)
            )
        `)

    } catch (err) {
        console.error('error creating attractions table:', err)
    } finally {
        client.release()
    }
}