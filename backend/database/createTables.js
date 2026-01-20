import { pool } from './index.js'

export async function createTables() {
    const client = await pool.connect()

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS attractions (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                img VARCHAR(255),
                description TEXT,
                location VARCHAR(255)
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
                status VARCHAR(20) DEFAULT 'upcoming' -- upcoming, attended, cansledd, whgatever so that more optians are open
            )
        `)

    } catch (err) {
        console.error('error creating attractions table:', err)
    } finally {
        client.release()
    }
}