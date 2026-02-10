import express from 'express'
import { createReview, getReviewsByAttractions } from '../controllers/reviewController.js'


export const reviewsRouter = express.Router()

//attractionsRouter.get('/uytdresfdkjhtgm', getSomething Else)  // can add how many controllers u may wish
reviewsRouter.post('/', createReview)
reviewsRouter.get('/attraction/:attractionId', getReviewsByAttractions);
