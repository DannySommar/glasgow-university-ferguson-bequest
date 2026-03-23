import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            console.log('Running checkAuth...');
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            const data = await res.json();
            console.log('checkAuth response:', data);
            
            if (data.isLoggedIn) {
                console.log('User is logged in, updating state');
                setUser({ 
                    id: data.id, 
                    username: data.username,
                    email: data.email,
                    isAdmin: data.isAdmin 
                });
            } else {
                console.log('No active session');
                setUser(null);
            }
        } catch (err) {
            console.error('checkAuth error:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => { setUser(userData); };

    const logout = async () => {
        await fetch('/api/auth/logout', { credentials: 'include' });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
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
    if (!context) { // i forgoir to put it inside AuthProvider so let this check be
        throw new Error('useAuth must be used within AuthProvider in app or somewhere!!!!!!');
    }
    return context;
};