import express from 'express'
import { getBookings, deleteBooking, createBooking, changeBookingStatus } from '../controllers/bookingController.js'

export const bookingRouter = express.Router()

bookingRouter.get('/', getBookings)
bookingRouter.delete('/:id', deleteBooking)
bookingRouter.post('/', createBooking)
bookingRouter.post('/:id', changeBookingStatus)