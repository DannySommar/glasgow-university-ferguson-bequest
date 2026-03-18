import validator from 'validator'
import bcrypt from 'bcryptjs'
import { pool } from "../database/index.js"

export async function registerUser(req, res) {
    let { email, username, password, adminCode } = req.body

    console.log('tried registering with ', { email, username, password, adminCode })

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username and password are required.' })
    }

    email = email.trim()
    username = username.trim()

    if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
        return res.status(400).json(
            { error: 'Username must be 1-20 characters, using letters, numbers, _ or -.' }
        )
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'invalid email format  '})
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Move it to process.env.ADMIN_SECRET_CODE later on
    const isAdmin = (adminCode === 'admin_code')
    const client = await pool.connect()

    try {
        const existing = await client.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2', 
            [email, username]
        )

        if (existing.rowCount > 0){
            return res.status(400).json({ error: 'email or username already in use.' })
        }

        const hashed = await bcrypt.hash(password, 10)

        // insert into db
        const result = await client.query(
            'INSERT INTO users (email, username, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, email, username, is_admin', 
            [email, username, hashed, isAdmin]
        )

        const user = result.rows[0]
        req.session.userId = user.id
        req.session.isAdmin = user.is_admin

        res.status(201).json({
            message: 'user registered',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                isAdmin: user.is_admin
            }
        })
        
    } catch (err) {
        console.error('registration error: ', err.message)
        res.status(500).json({ error: 'Registration failed. Please try again.' })
    } finally {
        client.release()
    }
}

export async function loginUser(req, res) {
    let { username, password } = req.body
    console.log('tried logging in with ', { username, password })

    if (!username || !password) {
        return res.status(400).json({ error: 'all fields are needed' } )
    }

    username = username.trim()
    const client = await pool.connect()

    try {
        const result = await client.query(
            'SELECT * FROM users WHERE username = $1', 
            [username]
        )
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials'})
        }

        const user = result.rows[0]
        const isValid = await bcrypt.compare(password, user.password_hash)

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials'})
        }

        req.session.userId = user.id
        req.session.isAdmin = user.is_admin

        res.json({ 
            message: 'logged in',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                isAdmin: user.is_admin
            }
        })

    } catch (err) {
        console.error('Login error:', err.message)
        res.status(500).json({ error: 'Login failed. Please try again.' })
    } finally {
        client.release()
    }
}

export async function logoutUser(req, res) {
    req.session.destroy(() => {
        res.json({message: 'Logged out successfully'})
    })
}

export async function ssoAutoLogin(req, res, next) {
    const guid = req.headers['dh75hdyt76'];
    const name = req.headers['dh75hdyt77'];
    const email = req.headers['dh75hdyt80'];
  
    if (guid) {
        console.log('='.repeat(50));
        console.log('SSO DETECTED');
        console.log(`GUID: ${guid}`);
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log('='.repeat(50));
        
        // put into database
    }
    
    


    next();
}