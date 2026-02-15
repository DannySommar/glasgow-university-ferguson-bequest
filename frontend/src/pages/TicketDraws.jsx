import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import "./TicketDraws.css"
import { useState, useEffect } from "react"
export function TicketDraws() {

    const [selected, setSelected] = useState(null);
    const [ticketDraws, setTicketDraws] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    
    // temporary solution. need to move imgs to public folder when functionality for admin to upload own attractions with imgs
    const imageMap = {
        "BlairDrumond.jpg": Blairimg,
        "EdZoo.jpg": zoo,
        "Clan.jpg": clan,
        "Ghostbusters-Header.jpg": rsnoghost
    }

    useEffect(() => {
        fetchTicketDraws()
        checkAdminStatus()
    }, [])

    const fetchTicketDraws = async () => {
        try {
            const response = await fetch('/api/ticket-draws', { credentials: 'include' })
            const data = await response.json()

            const transformed = data.ticketDraws.map(draw => ({
              id: draw.id, 
              title: draw.title, 
              venue: draw.venue, 
              eventDate: draw.eventdate, 
              enterFrom: draw.enterfrom, 
              enterUntil: draw.enteruntil, 
              img: imageMap[draw.img], 
              showUrl: draw.showurl
            }))

            console.log(transformed)

            setTicketDraws(transformed)
        } catch (error) {
            console.error('Error fetching ticket draws:', error)
            setTicketDraws([])
        }
    }

    const checkAdminStatus = async () => {
        try {
            const response = await fetch('/api/auth/me', { credentials: 'include' });
            const data = await response.json();
            setIsAdmin(data.isAdmin || false);
        } catch (err) {
            console.error('error checking admin status:', err);
        }
    }

    const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const handleEnterDraw = (title) => {
        alert(`Enter draw for ${title}`);
    }

    return (
        <>
        <h2 className="text-3xl font-bold text-center my-8 text-black-800">Ticket Draws</h2>
        
            <div className="ticket-draws-hero">
                <p>This is the Ticket Draws page, where you can enter draws to get ticket(s) for events.</p>
                <p>Staff may enter as many draws as they like but can only win one per year. Past winners will be removed</p>
            </div> 
        <div className="ticket-draws-page">
            <div className="ticket-draws-grid">
                {ticketDraws.map((draw) => (
            <div
              key={draw.title}
              className={`ticket-draws-card ${
                selected === draw.title ? "active" : ""
              }`}
              onClick={() => setSelected(draw.title)}
            >
                <img
                    src={draw.img}
                    alt={draw.title}
                />
              <h3><strong>{draw.title}</strong></h3>

              <p><strong>Venue:</strong> {draw.venue}</p>
              <p><strong>Enter from:</strong> {formatDate(draw.enterFrom)}</p>
              <p><strong>Enter until:</strong> {formatDate(draw.enterUntil)}</p>

                <p>
                  <a
                    href={draw.showUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View event details
                  </a>
                </p>

              <button
                type="button"
                className="enter-draw-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterDraw(draw.title);
                }}
              >
                Enter Draw
              </button>
            </div>
                ))}
            </div>
        </div>
    </>
    )
}