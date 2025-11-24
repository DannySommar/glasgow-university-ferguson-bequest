import { useParams } from "react-router-dom"
import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"

const attractionData = {
  "blair-drummond-safari-park": { title: "Blair Drummond Safari Park", img: Blairimg, description: "Some info about Blair Drummond..." },
  "edinburgh-zoo": { title: "Edinburgh Zoo", img: zoo, description: "Some info about Edinburgh Zoo..." },
  "glasgow-clan-ice-hockey": { title: "Glasgow Clan Ice Hockey", img: clan, description: "Some info about Glasgow Clan..." },
  "rsno-ghostbuster-concert": { title: "RSNO - Ghostbuster Concert", img: rsnoghost, description: "Some info about RSNO..." },
}

export function SpecificAttraction() {
  const { slug } = useParams(); // grabs the part after /attractions/
  const attraction = attractionData[slug];

  if (!attraction) return <p>Attraction not found</p>;

  return (
    <div className="singleAttractionPage">
        {attraction.img && <img src={attraction.img} alt={attraction.title} />}
        <div className="singleAttractionContent">
            <h2>{attraction.title}</h2>
            <p>{attraction.description}</p>
            <button className="book-btn">Book Now</button>
        </div>
    </div>
  )
}
