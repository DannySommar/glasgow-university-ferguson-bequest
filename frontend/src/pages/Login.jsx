import "./Login.css"

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export function Login() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const formData = new FormData(e.target)
            const username = formData.get('username').trim()
            const password = formData.get('password').trim()

            console.log('login attempt:', { username })
            
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({ username, password })
            })

            const data = await res.json()
            console.log('data from login attempt: ', data)

            if (res.ok) {
                navigate('/')
            } else {
                setError(data.error || 'login failed')
            }
        } catch (err) {
            setError('Network error.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="LoginPage">
            <div className="LoginContent">
                <form onSubmit={handleSubmit}>
                    <h1>Log In</h1>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="Input">
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Username"
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
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'checking credentials' : 'Log in'}
                    </button>
                </form>
            </div>
        </div>
    )
}