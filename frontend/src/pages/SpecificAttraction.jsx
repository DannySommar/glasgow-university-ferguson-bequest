import { useParams } from "react-router-dom"
import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import { useState } from "react"
import { PopUp } from "../components/PopUp"
import './SpecificAttraction.css'
import ReviewForm from "../components/reviews/ReviewForm"
import "../components/reviews/Review.css"

const attractionData = {
  "blair-drummond-safari-park": { title: "Blair Drummond Safari Park", img: Blairimg, description: "Some info about Blair Drummond..." },
  "edinburgh-zoo": { title: "Edinburgh Zoo", img: zoo, description: "Some info about Edinburgh Zoo..." },
  "glasgow-clan-ice-hockey": { title: "Glasgow Clan Ice Hockey", img: clan, description: "Some info about Glasgow Clan..." },
  "rsno-ghostbuster-concert": { title: "RSNO - Ghostbuster Concert", img: rsnoghost, description: "Some info about RSNO..." },
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
        {attraction.img && <img src={attraction.img} alt={attraction.title} />}
        <div className="singleAttractionContent">
            <h2>{attraction.title}</h2>
            <p>{attraction.description}</p>
            <button className="book-btn" onClick={handleBook}>Book Now</button>
        </div>
        
    </div>
    {showPopUp && <PopUp />}
    <div className="reviews">
      {/* once reviews are attached to database could put previous reviews along side
      with review form next to it. 
      use id of the database tables for each attraction to show corresponding reviews? */}
        <ReviewForm/>
        

        <div className="form">
          <h2>Reviews</h2>
          <p>review</p>
          <p>review</p>
        </div>
        </div>
    </>
  )
}
