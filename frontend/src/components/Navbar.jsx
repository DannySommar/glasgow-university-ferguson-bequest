import { Link } from "react-router-dom";
import "./NavBar.css"



export function Navbar(){

    return (
        <>
        <nav className="navbar">
        <Link to='/'><button>Home</button></Link>
        <Link to='/About'><button>About</button></Link>
        <Link to='/Attractions'><button>Attractions</button></Link>
        <Link to='/TicketDraws'><button>Ticket Draws</button></Link>
        <Link to='/MyBookings'><button>My Bookings</button></Link>
        <Link to='/Admin'><button>Admin</button></Link>
        <Link to='/Login'><button>Log In</button></Link>
        </nav>
        </>
    )

}