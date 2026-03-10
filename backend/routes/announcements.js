import express from 'express'
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementsController.js'

export const announcementsRouter = express.Router()

announcementsRouter.get('/', getAnnouncements)
announcementsRouter.post('/', createAnnouncement)
announcementsRouter.delete('/:id', deleteAnnouncement)