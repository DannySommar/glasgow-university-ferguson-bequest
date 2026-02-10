import express from 'express';
import cors from 'cors';
import session from 'express-session';

import { attractionsRouter } from './routes/attractions.js';
import { authRouter } from './routes/auth.js'

import { createTables } from './database/createTables.js';
import { seedTables } from './database/seedTables.js';
import { pool } from './database/index.js';

//import { resetAttractionsTable } from './database/resetTables.js';

const PORT = 8000;
const app = express();
const secret = process.env.SESSION_SECRET || 'skibidi';

app.use(cors());
app.use(express.json());

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}))

// normal test if backend connected
app.get('/api/hello', (req, res) => {
    res.json({message: 'Hello from the backend'})
})


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// basic database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as curr_time');
    res.json({ 
      status: 'Database connected',
      timestamp: result.rows[0].curr_time
    });
  }
  
  catch (err) {
    res.status(500).json({ 
      status: 'Database not connected',
      error: err.message
    });
  }
})

// attraction count endpoint
app.get('/api/db-attractions', async (req, res) => {
  try
  {
    const result = await pool.query('SELECT COUNT(*) as count FROM attractions');
    res.json(  {
      status: 'OK',
      message: `Database has ${result.rows[0].count} attractions`
    });
  }
  catch (err)
  {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
})

app.use('/api/attractions', attractionsRouter)
app.use('/api/auth', authRouter)

async function initializeDatabase() {
  try {
    console.log('init db');
    const testResult = await pool.query('SELECT NOW()');
    console.log('db connected:', testResult.rows[0].now);
    
    await createTables();
    await seedTables();
    
    const countResult = await pool.query('SELECT COUNT(*) FROM attractions');
    console.log(`attractions: ${countResult.rows[0].count}`);
    
    console.log('init db done');
  } catch (err) {
    console.error('init db not done:', err);
    process.exit(1);  // Stop server w error code
  }
}

// start server AFTER db is ready (skip when testing)
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
      console.log(`http://localhost:${PORT}/api/health`);
      console.log(`http://localhost:${PORT}/api/db-test`);
      console.log(`http://localhost:${PORT}/api/db-attractions`);
    }).on('error', (err) => {
      console.error(':( ', err);
    });
  });
}

export {app, initializeDatabase};
export default app;