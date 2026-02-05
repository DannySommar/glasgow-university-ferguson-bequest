import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import "./TicketDraws.css"
import { AttractionCard } from "../components/AttractionCard"
import "./Attractions.css"
import { useState } from "react"

export function TicketDraws() {
    const [selected, setSelected] = useState(null);

    const attractions = [
         {
            title: "Priscilla, Queen of the Desert",
            venue: "King's Theatre, Glasgow",
            eventDate: "2026-03-05",
            enterFrom: "2026-01-15",
            enterUntil: "2026-02-11",
            img: Blairimg,
            showUrl: "https://www.atgtickets.com/shows/priscilla-queen-of-the-desert-the-musical/kings-theatre-glasgow/",
        },
        {
            title: "A Play, A Pie & A Pint",
            venue: "Òran Mór, Glasgow",
            eventDate: "2026-02-23",
            enterFrom: "2026-01-27",
            enterUntil: "2026-02-15",
            img: zoo,
            showUrl: "https://playpiepint.com/",
        },
        {
            title: "RSNO – Ghostbusters Concert",
            venue: "Glasgow Royal Concert Hall",
            eventDate: "2026-11-02",
            enterFrom: "2026-09-15",
            enterUntil: "2026-10-01",
            img: rsnoghost,
            showUrl: "https://www.rsno.org.uk/liveevent/tchaikovskys-fourth-symphony/",
        },
        {
            title: "Scottish Ballet - Starstruck",
            venue: "Theatre Royal, Glasgow",
            eventDate: "2026-04-17",
            enterFrom: "2026-02-26",
            enterUntil: "2026-03-25",
            img: clan,
            showUrl: "https://www.atgtickets.com/shows/scottish-ballet-starstruck/theatre-royal-glasgow/",
        },
    ]
    
    const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const handleEnterDraw = (title) => {
        alert('Enter draw for ${title}');
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
                {attractions.map((draw) => (
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