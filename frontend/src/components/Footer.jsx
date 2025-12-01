import { Link } from "react-router-dom";
import './Footer.css'

export function Footer(){
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <h4>Ferguson Bequest</h4>
                    <p>University of Glasgow Staff Perks & Events</p>
                </div>

                <nav className="footer-links">
                    <Link to='/'>Home</Link>
                    <Link to='/About'>About</Link>
                    <Link to='/Attractions'>Attractions</Link>
                    <Link to='/TicketDraws'>Ticket Draws</Link>
                    <Link to='/Terms'>Terms &amp; Conditions</Link>
                </nav>

                <div className="footer-meta">
                    <a href="mailto:fergusonbequest@glasgow.ac.uk">Contact Us</a>
                    <p> {year} University of Glasgow</p>
                </div>
            </div>
        </footer>
    )
}