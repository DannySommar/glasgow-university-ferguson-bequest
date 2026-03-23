import express from 'express'
import { upload } from '../middleware/upload.js'
import { getAttractions, deleteAttraction, createAttraction, updateAttraction, addTicketCodes} from '../controllers/attractionController.js'


export const attractionsRouter = express.Router()

//attractionsRouter.get('/uytdresfdkjhtgm', getSomething Else)  // can add how many controllers u may wish
attractionsRouter.get('/', getAttractions)
attractionsRouter.delete('/:id', deleteAttraction);
attractionsRouter.post('/', 
    (req, res, next) => { // just an admin check middleware, might create it seperately later
        if (!req.session.isAdmin) {
            return res.status(403).json({ error: 'Admin required' })
        }
        next()
    },
    upload.single('img'),
    createAttraction
)
attractionsRouter.put('/:id',
    (req, res, next) => {
        if (!req.session.isAdmin) {
            return res.status(403).json({ error: 'Admin required' })
        }
        next()
    },
    upload.single('img'),
    updateAttraction
)
attractionsRouter.post('/:id/add-ticket-codes', addTicketCodes)