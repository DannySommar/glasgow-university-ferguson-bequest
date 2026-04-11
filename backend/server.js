import express from 'express';
import cors from 'cors';
import session from 'express-session';

import { requireAuth } from './middleware/requireAuth.js';
import { attractionsRouter } from './routes/attractions.js';
import { ticketDrawRouter } from './routes/ticketDraws.js'
import { authRouter } from './routes/auth.js'
import { reviewsRouter } from './routes/reviews.js';
import { announcementsRouter } from './routes/announcements.js'

import { createTables } from './database/createTables.js';
import { seedTables } from './database/seedTables.js';
import { pool } from './database/index.js';
import { bookingRouter } from './routes/bookings.js';

import { ssoAutoLogin, completeSSOLogin } from './controllers/authController.js';

import { resetTables } from './database/resetTables.js';

const PORT = process.env.BACKEND_PORT || 8000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'skibidi';
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || (NODE_ENV === 'local' || NODE_ENV === 'test' ? 'http://localhost:5000' : 'http://maloelap.dcs.gla.ac.uk:5000');
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';

// COOKIE_DOMAIN from env if not in local mode
const shouldSetDomain = NODE_ENV !== 'local' && NODE_ENV !== 'test';
let COOKIE_DOMAIN = null;

if (shouldSetDomain) {
    COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'maloelap.dcs.gla.ac.uk';
}

console.log('Mode:', NODE_ENV);
console.log('Cookie secure: ', COOKIE_SECURE);
console.log('Cookie domain: ', COOKIE_DOMAIN);

const app = express();

const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

const sessionConfig = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: 'lax',
        path: '/'
    }
};

// only set domain if we have one (no in local)
if (COOKIE_DOMAIN) {
    sessionConfig.cookie.domain = COOKIE_DOMAIN;
}

app.use(session(sessionConfig));

const uploadsPath = '/app/uploads'
console.log('Uploading images from:', uploadsPath)
app.use('/uploads', express.static(uploadsPath))

// DEBUG: normal test if backend connected
app.get('/api/hello', (req, res) => {
    res.json({message: 'Hello from the backend'})
})


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// DEBUG: log SSO headers
app.get('/api/debug-headers', (req, res) => {
  console.log('='.repeat(50))
  console.log(' SSO DEBUG ')
  console.log('Headers:')
  console.log(JSON.stringify(req.headers, null, 2))
  console.log('='.repeat(50))

  res.json({ 
    message: 'Headers logged to console',
    timestamp: new Date().toISOString()
  })

})

// DEBUG: basic database connection test
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

// DEBUG: attraction count endpoint
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

app.get('/api/auth/mode', (req, res) => {
    res.json({ 
        mode: process.env.NODE_ENV || 'development',
        ssoEnabled: process.env.NODE_ENV !== 'local'
    });
});


// every important request protected by auth check
const shouldRequireAuth = NODE_ENV === 'development' || NODE_ENV === 'production';
app.use('/api/auth', authRouter) // requireAuth is inside of the router for certain endpoints

if (shouldRequireAuth) {
    app.use('/api/attractions', requireAuth, attractionsRouter);
    app.use('/api/ticket-draws', requireAuth, ticketDrawRouter);
    app.use('/api/reviews', requireAuth, reviewsRouter);
    app.use('/api/announcements', requireAuth, announcementsRouter);
    app.use('/api/bookings', requireAuth, bookingRouter);
} else {
    app.use('/api/attractions', attractionsRouter);
    app.use('/api/ticket-draws', ticketDrawRouter);
    app.use('/api/reviews', reviewsRouter);
    app.use('/api/announcements', announcementsRouter);
    app.use('/api/bookings', bookingRouter);
}

async function initializeDatabase() {
  try {
    console.log('init db');

    // comment out once used once
    await resetTables();
    
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

// start server AFTER db is ready
if (NODE_ENV !== 'test') {
  initializeDatabase().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`server running on ${FRONTEND_URL}`);
      console.log(`${FRONTEND_URL}/api/health`);
      console.log(`${FRONTEND_URL}/api/db-test`);
      console.log(`${FRONTEND_URL}/api/db-attractions`);
    }).on('error', (err) => {
      console.error(':( ', err);
    });
  });

}

export { app, initializeDatabase };
export default app;
