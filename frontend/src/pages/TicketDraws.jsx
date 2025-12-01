import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import "./TicketDraws.css"
import { AttractionCard } from "../components/AttractionCard"
import "./Attractions.css"
import { useState } from "react"

export function TicketDraws(){

    const [selected, setSelected] = useState(null);

    const attractions = [
        {title: "Blair Drummond Safari Park", img:Blairimg},
        {title: "Edinburgh Zoo", img:zoo},
        {title: "Glasgow Clan Ice Hockey", img:clan},
        {title: "RSNO - Ghostbuster Concert",  img:rsnoghost},
    ]
    
    const handleEnterDraw = (attraction) => {
        alert('Enter draw for ${attraction.title}');
    };

    return (
        <div className="ticket-draws-page">
            <div className="ticket-draws-hero">
                <h1>Ticket Draws</h1>
                <p>This is the Ticket Draws page, where you can enter draws to get ticket(s) for events.</p>
                <p>Staff may enter as many draws as they like but can only win one per year. Past winners will be removed</p>
            </div>

            <h2>Attractions</h2>
            <div className="ticket-draws-grid">
                {attractions.map((attraction) => (
                    <div
                        key={attraction.title}
                        className={'ticket-draws-card ${selected === attraction.title ? "active" : ""}'}
                        onClick={() => setSelected(attraction.title)}
                    >
                        <h3>{attraction.title}</h3>
                        {attraction.img && <img src={attraction.img} alt={attraction.title} />}
                        <button
                            type="button"
                            className="enter-draw-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEnterDraw(attraction);
                            }}
                        >
                            Enter Draw
                        </button>

            </div>
                ))}
            </div>
        </div>
    );
  
}