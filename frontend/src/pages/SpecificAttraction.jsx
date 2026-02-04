import { useParams } from "react-router-dom"
import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"
import { useEffect, useState } from "react"
import { PopUp } from "../components/PopUp"
import './SpecificAttraction.css'
import ReviewForm from "../components/reviews/ReviewForm"
import "../components/reviews/Review.css"


const attractionData = {
  "blair-drummond-safari-park": { id: 1, title: "Blair Drummond Safari Park", img: Blairimg, description: "Some info about Blair Drummond..." },
  "edinburgh-zoo": { id: 2, title: "Edinburgh Zoo", img: zoo, description: "Some info about Edinburgh Zoo..." },
  "glasgow-clan-ice-hockey": {id:3, title: "Glasgow Clan Ice Hockey", img: clan, description: "Some info about Glasgow Clan..." },
  "rsno-ghostbuster-concert": { id:4, title: "RSNO - Ghostbuster Concert", img: rsnoghost, description: "Some info about RSNO..." },
}


export function SpecificAttraction() {
  const { slug } = useParams(); 
  const attraction = attractionData[slug];

  const [reviews, setReviews] = useState([])
  const [showPopUp, setShowPopUp] = useState(false);

   if (!attraction) return <p>Attraction not found</p>;


  useEffect(() => {
  if (!attraction.id) return

  fetch(`/api/reviews/attraction/${attraction.id}`, {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => setReviews(data.reviews || []))
    .catch(err => console.error("Failed to fetch reviews:", err))
  }, [attraction.id])

  const handleBook = () => {
    setShowPopUp(true);
  }


const addReview = async (review) => {
  console.log('review: ', review)
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(review)
  })

  const savedReview = await response.json()
  setReviews(prev => [savedReview, ...prev])
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
        <ReviewForm
        attractionId={attraction.id}
        onAddReview={addReview}/>
        

        
          <div className="form">
        <h2>Reviews</h2>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map(review => (
          <div key={review.id} className="singleReview">
            <strong>{review.username || 'Anonymous'}</strong> {/* username from backend */}
            <p>{review.comment}</p>
            <span>{review.rating} ★</span>
            <small>{new Date(review.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
        </div>
      
    </>
  )
}
