import express from 'express'
import { enterDraw } from '../controllers/drawController.js';

export const drawsRouter = express.Router();
drawsRouter.post('/enter', enterDraw);