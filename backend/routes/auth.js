import express from 'express'

import { registerUser, loginUser, logoutUser, ssoAutoLogin, completeSSOLogin} from "../controllers/authController.js";
import {getCurrentUser} from "../controllers/meController.js"

export const authRouter = express.Router()

// authRouter.post('/register', registerUser) // no longer in use
// authRouter.post('/login', loginUser) // no longer in use

authRouter.get('/logout', logoutUser)
authRouter.get('/me', getCurrentUser)

// // used in server.js already by themseves
// authRouter.get('/sso', ssoAutoLogin)
// authRouter.get('/complete-sso', completeSSOLogin)