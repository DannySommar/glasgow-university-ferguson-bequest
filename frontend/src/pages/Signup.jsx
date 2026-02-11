import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import "./Signup.css"


export function Signup() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const formData = new FormData(e.target)
            const email = formData.get('email').trim()
            const username = formData.get('username').trim()
            const password = formData.get('password').trim()
            const adminCode = formData.get('adminCode').trim() || undefined // not neccasary, but decreases payload

            console.log({ email, username, password, adminCode })
            
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({ email, username, password, adminCode })
            })

            const data = await res.json()
            console.log('data from register attempt: ', data)

            if (res.ok) {
                // better practice for user to log in seperately maybe
                // login({ 
                //     id: data.user.id, 
                //     username: data.user.username,
                //     email: data.user.email,
                //     isAdmin: data.user.isAdmin 
                // })
                navigate('/') // home
            } else {
                setError(data.error || 'singup failed')
            }
        } catch (err) {
            setError('Network error.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="SignupPage">
            <div className="SignupContent">
                <form onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="Input">
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Username"
                            required
                            minLength="1"
                            maxLength="20"
                        />
                    </div>
                    
                    <div className="Input">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email Address"
                            required
                        />
                    </div>                    
                    
                    <div className="Input">
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password"
                            required
                            minLength="1"
                        />
                    </div>

                    <div className="Input">
                        <input 
                            type="password" 
                            name="adminCode"
                            placeholder="Admin Code (Optional)"
                            autoComplete="off"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'adding your data to database' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    )
}