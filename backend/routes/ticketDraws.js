import express from 'express'
import { uploadTicketDraw } from '../middleware/upload.js'
import { getTicketDraws, enterDraw, deleteTicketDraw, createTicketDraw, pickWinner, updateTicketDraw} from '../controllers/ticketDrawsController.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

export const ticketDrawRouter = express.Router()

ticketDrawRouter.get('/', getTicketDraws)
ticketDrawRouter.post('/enter', enterDraw)

// admin only
ticketDrawRouter.post('/', requireAdmin, uploadTicketDraw.single('img'), createTicketDraw)
ticketDrawRouter.delete('/:id', requireAdmin, deleteTicketDraw)
ticketDrawRouter.post('/pick-winner', requireAdmin, pickWinner)
ticketDrawRouter.put('/:id', requireAdmin, uploadTicketDraw.single('img'), updateTicketDraw)