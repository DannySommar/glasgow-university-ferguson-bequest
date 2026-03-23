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
  
    if (guid && email) {
        console.log('='.repeat(50));
        console.log('🔐 SSO DETECTED');
        console.log(`GUID: ${guid}`);
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log('='.repeat(50));
        
        const client = await pool.connect();
        
        try {
            let user;
            
            // Check if user exists
            const existing = await client.query(
                `SELECT id, email, username, is_admin 
                 FROM users 
                 WHERE guid = $1 OR email = $2`,
                [guid, email]
            );
            
            if (existing.rows.length > 0) {
                user = existing.rows[0];
                console.log('✅ Existing user found');
            } else {
                console.log('👤 New user, creating account...');
                
                const adminEmails = [
                    'Sarah.Finlayson@glasgow.ac.uk',
                    '2913985S@student.gla.ac.uk'
                ];
                const isAdmin = adminEmails.includes(email);
                
                const randomPassword = Math.random().toString(36).slice(-16);
                const hashedPassword = await bcrypt.hash(randomPassword, 10);
                
                const result = await client.query(
                    `INSERT INTO users (guid, email, username, password_hash, is_admin) 
                     VALUES ($1, $2, $3, $4, $5) 
                     RETURNING id, email, username, is_admin`,
                    [guid, email, name || email.split('@')[0], hashedPassword, isAdmin]
                );
                
                user = result.rows[0];
                console.log(`✅ New user created`);
            }
            
            // After user is found/created
            req.session.userId = user.id;
            req.session.isAdmin = user.is_admin;

            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Manually set the cookie for your frontend domain
            res.cookie('connect.sid', req.sessionID, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                domain: 'maloelap.dcs.gla.ac.uk',  // ← Force frontend domain
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.redirect('http://maloelap.dcs.gla.ac.uk:5000/');
            
        } catch (err) {
            console.error('❌ SSO auto login error:', err.message);
            return res.redirect('http://maloelap.dcs.gla.ac.uk:5000/login?error=sso_failed');
        } finally {
            client.release();
        }
    }
    
    next();
}