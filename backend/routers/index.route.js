import express from 'express'
import userRoute from './users.route.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.use('/user', userRoute)

// token verification
router.get('/api/verify-token', isAuthenticated, (req, res) => {
  res.status(200).json({ success: true, user: req.user })
})

// index route
router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' })

    res.send('Welcome to the server!')
})

export default router