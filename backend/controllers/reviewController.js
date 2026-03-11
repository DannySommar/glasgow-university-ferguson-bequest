import {pool} from '../database/index.js'

export async function getReviewsByAttractions(req, res) {
  try {
    const { attractionId } = req.params

    const result = await pool.query(
      `SELECT r.*, u.username
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.attraction_id = $1
       ORDER BY r.created_at DESC`,
      [attractionId]
    )
    
    res.json({ reviews: result.rows })

  } catch (err) {
    console.error('error fetching reviews:', err)
    res.status(500).json({ error: 'failed to fetch reviews' })
  }

}

export async function createReview(req, res) {
  try {
    const { attraction_id, rating, comment } = req.body

    console.log('creating a new attraction with rating and all:', req.body)

    const user_id = req.session.userId

    if (!user_id) {
      return res.status(401).json({ error: 'not logged in' })
    }

    if (!attraction_id || !rating || !comment) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, attraction_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, attraction_id)
       DO UPDATE SET 
         rating = EXCLUDED.rating,
         comment = EXCLUDED.comment,
         created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [user_id, attraction_id, rating, comment]
    )

    const reviewWithUser = await pool.query(
      `SELECT r.*, u.username
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
      [result.rows[0].id]
    )

    res.status(201).json(reviewWithUser.rows[0])

  } catch (err) {
    console.error('error creating review:', err)
    res.status(500).json({ error: 'failed to create review' })
  }
}