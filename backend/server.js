import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { attractionsRouter } from './routes/attractions.js';


const PORT = 8000;
const app = express();
const secret = process.env.SESSION_SECRET || 'skibidi' // proocess.env onvce we have that folder

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

// Test if frontend connected to backend
app.get('/api/hello', (req, res) => {
    res.json({message: 'Hello from the backend'})
})

// My friend had it so it's probably professional
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

app.use('/api/attractions', attractionsRouter)

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Failed to start server:', err)
})