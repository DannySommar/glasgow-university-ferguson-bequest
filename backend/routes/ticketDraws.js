import express from 'express'
import { getTicketDraws, enterDraw, deleteTicketDraw, createTicketDraw, pickWinner, updateTicketDraw} from '../controllers/ticketDrawsController.js'

export const ticketDrawRouter = express.Router()

ticketDrawRouter.get('/', getTicketDraws)
ticketDrawRouter.post('/enter', enterDraw)
ticketDrawRouter.post('/', createTicketDraw)
ticketDrawRouter.delete('/:id', deleteTicketDraw)
ticketDrawRouter.post('/pick-winner', pickWinner)
ticketDrawRouter.put('/:id', updateTicketDraw)