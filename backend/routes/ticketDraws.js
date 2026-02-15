import express from 'express'
import { getTicketDraws } from '../controllers/ticketDrawsController.js'

export const ticketDrawRouter = express.Router()

ticketDrawRouter.get('/', getTicketDraws)