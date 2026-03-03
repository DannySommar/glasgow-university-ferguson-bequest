import express from 'express'
import { getBookings, createBooking } from '../controllers/bookingController.js'

export const bookingRouter = express.Router()

bookingRouter.get('/', getBookings)
bookingRouter.post('/', createBooking)