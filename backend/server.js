import express from 'express';
import cors from 'cors';
import session from 'express-session';


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

app.get('/api', (req, res) => {
  res.json({ message: 'Hello World from backend!' });
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Failed to start server:', err)
})