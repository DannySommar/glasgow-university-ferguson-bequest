import { useParams } from "react-router-dom"
import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import { useState } from "react"
import { PopUp } from "../components/PopUp"
import './SpecificAttraction.css'

const attractionData = {
  "blair-drummond-safari-park": { 
    title: "Blair Drummond Safari Park", 
    img: Blairimg, 
    showUrl:"https://blairdrummond.com/",
    description: "Drive through lion and rhino reserves, walk with lemurs, and explore the dinosaur forest and adventure playground. Open mid-March to December—book online for a wild day out!"
  },
  "edinburgh-zoo": { 
    title: "Edinburgh Zoo", 
    img: zoo, 
    showUrl:"https://www.edinburghzoo.org.uk/",
    description: "Home to over 2,500 animals, including giant pandas and penguins. Don’t miss the Giant Lanterns event (Nov 2025–Feb 2026) and new chimpanzee troop!" 
  },
  "glasgow-clan-ice-hockey": { 
    title: "Glasgow Clan Ice Hockey", 
    img: clan, 
    showUrl:"https://clanihc.com/",
    description: "Scotland’s premier ice hockey team in action! Fast-paced, family-friendly entertainment. Check the 2025/26 season schedule and book your seats." 
  },
  "rsno-ghostbuster-concert": { 
    title: "RSNO - Ghostbuster Concert", 
    img: rsnoghost, 
    showUrl:"https://www.rsno.org.uk/liveevent/ghostbusters-in-concert/",
    description: "Experience the original Ghostbusters film with the RSNO performing Elmer Bernstein’s iconic score live. Halloween concerts on 30 & 31 Oct 2025—book now!" 
  },
}

export function SpecificAttraction() {
  const { slug } = useParams(); 
  const attraction = attractionData[slug];

  if (!attraction) return <p>Attraction not found</p>;

  const [showPopUp, setShowPopUp] = useState(false);

  const handleBook = () => {
    setShowPopUp(true);
  }

  return (
    <>
    <div className="attractionPage">
        <div className="singleAttractionContent">
            {attraction.img && <img src={attraction.img} alt={attraction.title} />}
            <h2>{attraction.title}</h2>
            <p>
               <a class
                    href={attraction.showUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                   <strong>Visit Website</strong>
                </a>
            </p>
            <p>{attraction.description}</p>
            <button className="book-btn" onClick={handleBook}>Book Now</button>
        </div>
    </div>
    {showPopUp && <PopUp />}
    </>
  )
}
