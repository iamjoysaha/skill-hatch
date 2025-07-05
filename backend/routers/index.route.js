import express from 'express'
import userRoute from './users.route.js'
import verificationRoute from './verification.route.js'

const router = express.Router()

router.use('/user', userRoute)
router.use('/verify', verificationRoute)
router.get('/', (req, res) => res.send('Welcome to the server!'))

export default router