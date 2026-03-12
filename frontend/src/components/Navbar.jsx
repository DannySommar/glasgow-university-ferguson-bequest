import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


import { useAuth } from "../contexts/AuthContext";
import "./NavBar.css"
import uofgLogo from "../images/uofgLogo.jpg";



export function Navbar(){
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <img src={uofgLogo} alt="Univeristy of Glasgow" />
            </Link>
            <div className="nav-links">
                <Link to='/'><button>Home</button></Link>
                <Link to='/About'><button>About</button></Link>
                <Link to='/Attractions'><button>Attractions</button></Link>
                <Link to='/TicketDraws'><button>Ticket Draws</button></Link>
                <Link to='/Announcements'><button> Announcements </button></Link>
                
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
                        <Link to='/Login'><button>Log In</button></Link>
                        <Link to='/Signup'><button>Sign Up</button></Link>
                    </>
                )}
            </div>
        </nav>
    )
}