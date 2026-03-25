import express from 'express'
import { uploadAttraction  } from '../middleware/upload.js'
import { getAttractions, deleteAttraction, createAttraction, updateAttraction, addTicketCodes} from '../controllers/attractionController.js'
import { requireAdmin } from '../middleware/requireAdmin.js'


export const attractionsRouter = express.Router()

attractionsRouter.get('/', getAttractions)

// admin only
attractionsRouter.delete('/:id', requireAdmin, deleteAttraction);
attractionsRouter.post('/', requireAdmin, uploadAttraction .single('img'), createAttraction);
attractionsRouter.put('/:id', requireAdmin, uploadAttraction .single('img'), updateAttraction);
attractionsRouter.post('/:id/add-ticket-codes', requireAdmin, addTicketCodes)