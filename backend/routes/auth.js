import express from 'express'

import { registerUser, loginUser, logoutUser, ssoAutoLogin, completeSSOLogin} from "../controllers/authController.js";
import {getCurrentUser} from "../controllers/meController.js"
import { requireAuth } from '../middleware/requireAuth.js';

export const authRouter = express.Router()

authRouter.get('/logout', requireAuth, logoutUser)
authRouter.get('/me', requireAuth, getCurrentUser)

if (process.env.NODE_ENV === 'local'){
    console.log('Local mode: password based login/register');
    authRouter.post('/login', loginUser);
    authRouter.post('/register', registerUser);
}

authRouter.get('/sso', ssoAutoLogin)
authRouter.get('/complete-sso', completeSSOLogin)