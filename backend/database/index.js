import { Pool } from 'pg'

// try to integrate .enf file somehow in here and docker compose later on
export const pool = new Pool({
  host: process.env.DB_HOST ||'db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) :5432,
  database: process.env.DB_NAME || 'sh40db',
  user: process.env.DB_USER ||'sh40user',
  password: process.env.DB_PASSWORD ||'sh40password'
})

// return time if db connected
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('Database connected:', result.rows[0])
    return true
  } catch (err) {
    console.error('Database not connected:', err)
    return false
  }
}

