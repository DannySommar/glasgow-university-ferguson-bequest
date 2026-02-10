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
    console.log(result.rows)
    res.json({ reviews: result.rows })

  } catch (err) {
    console.error('error fetching reviews:', err)
    res.status(500).json({ error: 'failed to fetch reviews' })
  }

}

export async function createReview(req, res) {
  try {
    const { attraction_id, rating, comment } = req.body

    console.log('creating a new attraction with rating ', rating)

    const user_id = req.session.userId

    if (!user_id) {
      return res.status(401).json({ error: 'not logged in' })
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, attraction_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, attraction_id, rating, comment]
    )

    res.status(201).json(result.rows[0])

  } catch (err) {
    console.error('error creating review:', err)
    res.status(500).json({ error: 'failed to create review' })
  }
}