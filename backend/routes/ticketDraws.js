import express from 'express'
import { getTicketDraws, enterDraw, deleteTicketDraw, createTicketDraw} from '../controllers/ticketDrawsController.js'

export const ticketDrawRouter = express.Router()

ticketDrawRouter.get('/', getTicketDraws)
ticketDrawRouter.post('/enter', enterDraw)
ticketDrawRouter.post('/', createTicketDraw)
ticketDrawRouter.delete('/:id', deleteTicketDraw)