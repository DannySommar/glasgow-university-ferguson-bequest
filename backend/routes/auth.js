import express from 'express'

import { registerUser, loginUser, logoutUser, ssoAutoLogin} from "../controllers/authController.js";
import {getCurrentUser} from "../controllers/meController.js"

export const authRouter = express.Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.get('/logout', logoutUser)
authRouter.get('/me', getCurrentUser)

authRouter.get('/sso', ssoAutoLogin, (req, res) => {
  res.json({ 
    message: 'SSO headers received',
    headers: {
      guid: req.headers['dh75hdyt76'],
      name: req.headers['dh75hdyt77'],
      email: req.headers['dh75hdyt80']
    }
  });
});