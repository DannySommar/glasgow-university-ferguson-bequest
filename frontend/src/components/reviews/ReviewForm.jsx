import { useState } from 'react';
import './Review.css'

const ReviewForm = ({ attractionId, onAddReview }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating ===0){
      alert('Please select a rating')
      return
    }

    console.log(rating)

    const newReview = {
      attraction_id: attractionId,
      comment,
      rating
    };
    onAddReview(newReview);
    setComment('');
    setRating(0);
  };

  return (
    <div className='form'>
      <h2>Write a Review!</h2>
    <form onSubmit={handleSubmit}>
    
      <textarea 
        placeholder="Write your review..." 
        value={comment} 
        onChange={(e) => setComment(e.target.value)} 
      />
      <h3>Give a Rating:</h3>
      {/* <input 
        type="number" 
        placeholder="Rating (1-5)" 
        min="1" 
        max="5" 
        value={rating} 
        onChange={(e) => setRating(parseInt(e.target.value))} 
      /> */}


    <div className="star-rating">
    {[...Array(5)].map((_, index) => {
      const starValue = index + 1;

    return (
      <span
        key={starValue}
        className={starValue <= (hover || rating) ? "star filled" : "star"}
        onClick={() => setRating(starValue)}
        onMouseEnter={() => setHover(starValue)}
        onMouseLeave={() => setHover(0)}
      >
        ★
      </span>
    );
  })}
</div>

      <br></br>
      <button type="submit">Submit Review</button>
    </form>
    </div>
  );
};

export default ReviewForm;