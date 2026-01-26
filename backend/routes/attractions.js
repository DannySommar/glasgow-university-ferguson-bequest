import express from 'express'
import { getAttractions, deleteAttraction } from '../controllers/attractionController.js'


export const attractionsRouter = express.Router()

//attractionsRouter.get('/uytdresfdkjhtgm', getSomething Else)  // can add how many controllers u may wish
attractionsRouter.get('/', getAttractions)
attractionsRouter.delete('/:id', deleteAttraction);
