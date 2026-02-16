import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { useAuth } from "../contexts/AuthContext"
import { createSlug } from "../utils/slug"
import { PopUp } from "../components/PopUp"
import './SpecificAttraction.css'
import ReviewForm from "../components/reviews/ReviewForm"
import "../components/reviews/Review.css"

// will need to move to /backend/public/images later, but now i know how 2.
import Blairimg from "../images/BlairDrumond.jpg"
import zoo from "../images/EdZoo.jpg"
import rsnoghost from "../images/Ghostbusters-Header.jpg"
import clan from "../images/Clan.jpg"

const imageMap = {
  "BlairDrumond.jpg": Blairimg,
  "EdZoo.jpg": zoo,
  "Clan.jpg": clan,
  "Ghostbusters-Header.jpg": rsnoghost
}

export function SpecificAttraction() {
  const { user }= useAuth()
  const { slug } = useParams()
  const [attraction, setAttraction] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showPopUp, setShowPopUp] = useState(false)
  const [loading, setLoading] = useState(true)

  // fetch all attractions and .find the matching one. don't really need to change the controller with extra param becaus ethis is web development and nothing matters just like life
  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        const response = await fetch('/api/attractions', {
          credentials: 'include'
        })
        const data = await response.json()
        
        const foundAttraction = data.attractions.find(att => createSlug(att.title) === slug)
        
        setAttraction(foundAttraction)

      } catch (err) {
        console.error('failed to fetch attraction:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAttraction()
  }, [slug])

  // fetch all reviews for this attraction
  useEffect(() => {
    if (!attraction?.id) return 

    fetch(`/api/reviews/attraction/${attraction.id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(err => console.error("Failed to fetch reviews:", err))
  }, [attraction])

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
    setReviews(prev => {
      const filtered = prev.filter(r => r.user_id !== user.id) // removes prev user review right away
      return [savedReview, ...filtered]
    })
  }

  if (loading) return <p>loading attraction... </p>
  if (!attraction) return <p>Attraction not found</p>

  return (
    <>
      <div className="attractionPage">
        {attraction.img && <img src={imageMap[attraction.img] || null} alt={attraction.title} />}
        <div className="singleAttractionContent">
          <h2>{attraction.title}</h2>
          <p>{attraction.description}</p>
          <button className="book-btn" onClick={handleBook}>Book Now</button>
        </div>
      </div>
      
      {showPopUp && <PopUp />}
      
      <div className="reviews">
        <ReviewForm
          attractionId={attraction.id}
          onAddReview={addReview}
        />
        
        <div className="form">
          <h2>Reviews</h2>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          
          {reviews.map(review => (
            <div key={review.id} className="singleReview">
              <strong>{review.username}</strong> {/* add Anonymous later when we add the flag for it in reviews table */}
              <p>{review.comment}</p>
              <span>{review.rating} ★</span>
              <br></br>
              <small>{new Date(review.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}