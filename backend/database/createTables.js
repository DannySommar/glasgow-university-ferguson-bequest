
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
                guid VARCHAR(50) UNIQUE,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(50),
                password_hash TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                login_token VARCHAR(64),
                token_expires TIMESTAMP
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
                status VARCHAR(20) DEFAULT 'upcoming' 
                -- upcoming, attended, cancelled, etc
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS ticket_draws (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                venue TEXT NOT NULL,
                eventDate DATE NOT NULL,
                enterFrom DATE NOT NULL,
                enterUntil DATE NOT NULL,
                img VARCHAR(255),
                showUrl TEXT
            )
        `)

       await client.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, attraction_id)
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS ticket_draw_entries (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                ticket_draw_id INTEGER REFERENCES ticket_draws(id) ON DELETE CASCADE,                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, ticket_draw_id)
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS ticket_draw_winners (
                id SERIAL PRIMARY KEY,
                ticket_draw_id INTEGER REFERENCES ticket_draws(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(ticket_draw_id, user_id)
            )
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                created_by INTEGER REFERENCES users(id)
            )
        `)
        await client.query(`
            CREATE TABLE IF NOT EXISTS ticket_codes (
                id SERIAL PRIMARY KEY,
                code VARCHAR(20) UNIQUE,
                attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
                booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE
            )
        `)

    } catch (err) {
        console.error('error creating attractions table:', err)
        throw err
    } finally {
        client.release()
    }
}; 