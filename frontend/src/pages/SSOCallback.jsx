import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SSOCallback() {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if session exists after redirect
        const checkAuth = async () => {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            const data = await res.json();
            
            if (data.isLoggedIn) {
                navigate('/');
            } else {
                navigate('/login?error=sso_failed');
            }
        };
        
        checkAuth();
    }, [navigate]);
    
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Logging you in...</h2>
            <p>Please wait while we complete your SSO login.</p>
        </div>
    );
}