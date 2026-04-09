import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authMode, setAuthMode] = useState(null);

    // check if run in local/development mode
    useEffect(() => {
        fetch('/api/auth/mode')
            .then(res => res.json())
            .then(data => setAuthMode(data.mode))
            .catch(err => console.error('Failed to fetch auth mode:', err));
    }, []);

    const checkAuth = async () => {
        try {
            console.log('Running checkAuth...');
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            const data = await res.json();
            console.log('checkAuth response:', data);
            
            if (data.isLoggedIn) {
                console.log('User is logged in, updating state');
                setUser({ ...data });
            } else {
                // redirect to SSO if not in local mode
                if (authMode !== 'local') {
                    console.log('Not logged in, redirecting to SSO');
                    window.location.href = `${import.meta.env.VITE_GATEWAY_URL}/api/auth/sso`;
                } else {
                    console.log('Local mode – user not logged in, staying on page');
                }
            }
        } catch (err) {
            console.error('checkAuth error:', err);
            if (authMode !== 'local') {
                window.location.href = `${import.meta.env.VITE_GATEWAY_URL}/api/auth/sso`;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authMode !== null) {
            checkAuth();
        }
    }, [authMode]);

    const login = (userData) => { setUser(userData); };

    const logout = async () => {
        await fetch('/api/auth/logout', { credentials: 'include' });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            authMode,
            login, 
            logout, 
            checkAuth 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};