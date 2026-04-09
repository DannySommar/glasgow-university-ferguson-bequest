import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./NavBar.css"
import uofgLogo from "../images/uofgLogo.jpg";

export function Navbar(){
    const { user, logout, authMode } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const handleSSODebug = () => {
        navigate('/debug-sso')
    }

    const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'https://studentproject-gateway.dcs.gla.ac.uk/psd';

    const handleSSOLogin = () => {
        window.location.href = `${GATEWAY_URL}/api/auth/sso`;
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <img src={uofgLogo} alt="University of Glasgow" />
            </Link>
            <div className="nav-links">
                <Link to='/'><button>Home</button></Link>
                <Link to='/About'><button>About</button></Link>
                <Link to='/Attractions'><button>Attractions</button></Link>
                <Link to='/TicketDraws'><button>Ticket Draws</button></Link>
                <Link to='/Announcements'><button>Announcements</button></Link>
                
                {user ? (
                    <>
                        <Link to='/MyBookings'><button>My Bookings</button></Link>
                        {user.isAdmin && (
                            <Link to='/Admin'><button>Admin</button></Link>
                        )}
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        {/* old login for local setup */}
                        {authMode === 'local' && (
                            <>
                                <Link to='/Login'><button>Log In</button></Link>
                                <Link to='/Signup'><button>Sign Up</button></Link>
                            </>
                        )}

                        {/* non-local mode (development/production) with sso integration */}
                        {authMode !== 'local' && authMode !== null && (
                            <button onClick={handleSSOLogin} className="sso-test-btn">
                                SSO Login
                            </button>
                        )}

                        {/* Debug button (optional – keep for testing) */}
                        {/* <button onClick={handleSSODebug} className="sso-test-btn">
                            SSO Debug
                        </button> */}
                    </>
                )}
            </div>
        </nav>
    )
}