import { Pool } from 'pg'


// try to integrate .enf file somehow in here and docker compose later on
export const pool = new Pool({
  host: 'db',
  port: 5432,
  database: 'sh40db',
  user: 'sh40user',
  password: 'sh40password'
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

testConnection()