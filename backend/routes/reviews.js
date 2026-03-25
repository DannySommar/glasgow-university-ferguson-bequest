import express from 'express'
import { createReview, getReviewsByAttractions } from '../controllers/reviewController.js'
import { requireAdmin } from '../middleware/requireAdmin.js';


export const reviewsRouter = express.Router()

//attractionsRouter.get('/uytdresfdkjhtgm', getSomething Else)  // can add how many controllers u may wish
reviewsRouter.post('/', requireAdmin, createReview)
reviewsRouter.get('/attraction/:attractionId', getReviewsByAttractions);
