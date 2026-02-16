import express from 'express'
import { getTicketDraws, enterDraw } from '../controllers/ticketDrawsController.js'

export const ticketDrawRouter = express.Router()

ticketDrawRouter.get('/', getTicketDraws)
ticketDrawRouter.post('/enter', enterDraw)