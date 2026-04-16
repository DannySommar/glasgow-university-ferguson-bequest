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
        
    if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test') {
        console.log('local mode: SSO disabled, redirecting to login page');
        const FRONTEND_URL = 'http://localhost:5000';
        return res.redirect(`${FRONTEND_URL}/login`);
    }
    
    const FRONTEND_URL= process.env.FRONTEND_URL || 'http://maloelap.dcs.gla.ac.uk:5000';
    const ALLOW_STUDENTS = process.env.ALLOW_STUDENTS === 'true';

    const guid = req.headers[process.env.SSO_HEADER_GUID];
    const name = req.headers[process.env.SSO_HEADER_NAME];
    const email = req.headers[process.env.SSO_HEADER_EMAIL];
  
    if (guid && email) {
        console.log('='.repeat(50));
        console.log('SSO DETECTED');
        console.log(`GUID: ${guid}`);
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log('='.repeat(50));

        const isStudentEmail = email.includes('@student.gla.ac.uk');
        
        if (isStudentEmail && !ALLOW_STUDENTS) {
            console.log(`Student access denied: ${email}`);
            return res.redirect(`${FRONTEND_URL}/api/access-denied?reason=student`);
        }
        
        const client = await pool.connect();
        
        try {

            const adminEmails = process.env.ADMIN_EMAILS
            const isAdmin = adminEmails.includes(email);

            let user;
            
            const existing = await client.query(
                `SELECT id, email, username, is_admin 
                 FROM users 
                 WHERE guid = $1 OR email = $2`,
                [guid, email]
            );
            
            if (existing.rows.length > 0) {
                // user exists
                user = existing.rows[0];
                console.log('user exists');

                if (user.is_admin !== isAdmin) {
                    await client.query(
                        'UPDATE users SET is_admin = $1 WHERE id = $2',
                        [isAdmin, user.id]
                    );
                    console.log(`Updated admin status for ${user.email}: ${isAdmin}`);
                    user.is_admin = isAdmin;
                }

            } else {
                // new user
                console.log('new user, creating account');
                
                
                // Generate random password (won't be used for login)
                const randomPassword = Math.random().toString(36).slice(-16);
                const hashedPassword = await bcrypt.hash(randomPassword, 10);
                
                // Create username if doesnt exist for some reason
                const username = name || email.split('@')[0];
                
                const result = await client.query(
                    `INSERT INTO users (guid, email, username, password_hash, is_admin) 
                     VALUES ($1, $2, $3, $4, $5) 
                     RETURNING id, email, username, is_admin`,
                    [guid, email, username, hashedPassword, isAdmin]
                );
                
                user = result.rows[0];
                console.log(`New user created: ${user.email} (admin: ${user.is_admin})`);
            }
            
            // Generate a one-time token
            const crypto = await import('crypto');
            const token = crypto.randomBytes(32).toString('hex');
            
            // Store token in database with expiration (5 minutes)
            await client.query(
                `UPDATE users 
                 SET login_token = $1, 
                     token_expires = NOW() + INTERVAL '5 minutes'
                 WHERE id = $2`,
                [token, user.id]
            );
            console.log(`Generated login token for user ${user.id}`);
            
            // Redirect to frontend endpoint that will set the cookie
            const redirectUrl = `${FRONTEND_URL}/api/auth/complete-sso?token=${token}`;
            console.log(`Redirecting to: ${redirectUrl}`);
            
            return res.redirect(redirectUrl);
            
        } catch (err) {
            console.error('SSO auto login error: ', err.message);
            return res.redirect(`${FRONTEND_URL}/login?error=sso_failed`);  // these basically signal error codes that will never be implemented
        } finally {
            client.release();
        }
    }
    
    next();
}

export async function completeSSOLogin(req, res) {
    const FRONTEND_URL= process.env.FRONTEND_URL || 'http://maloelap.dcs.gla.ac.uk:5000';
    const { token } = req.query;
    
    if (!token) {
        console.log('No token provided');
        return res.redirect(`${FRONTEND_URL}/login?error=missing_token`);
    }
    
    const client = await pool.connect();
    
    try {
        const result = await client.query(
            `SELECT id, email, username, is_admin 
             FROM users 
             WHERE login_token = $1 
               AND token_expires > NOW()`,
            [token]
        );
        
        if (result.rows.length === 0) {
            console.log('Invalid or expired token');
            return res.redirect(`${FRONTEND_URL}/login?error=invalid_token`);
        }
        
        const user = result.rows[0];
        console.log(`Valid token for user: ${user.email}`);
        
        // Clear the token so it can't be reused
        await client.query(
            'UPDATE users SET login_token = NULL, token_expires = NULL WHERE id = $1',
            [user.id]
        );
        
        // Set the session cookie on maloelap domain
        req.session.userId = user.id;
        req.session.isAdmin = user.is_admin;
        
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    reject(err);
                } else {
                    console.log('Session saved for user:', user.id);
                    resolve();
                }
            });
        });
        
        // Redirect response to frontend
        console.log('SSO login complete, redirecting to home');
        return res.redirect(FRONTEND_URL);
        
    } catch (err) {
        console.error('Complete SSO error:', err.message);
        return res.redirect(`${FRONTEND_URL}/login?error=sso_failed`);
    } finally {
        client.release();
    }
}