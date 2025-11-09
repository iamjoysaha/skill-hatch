import express from 'express'
import userRoute from './users.route.js'
import verificationRoute from './verification.route.js'
import roadmapsRoute from './roadmaps.route.js'
import connectionRoute from './connection.route.js'
import communityRoute from './community.route.js'
const router = express.Router()

router.use('/user', userRoute)
router.use('/verify', verificationRoute)
router.use('/roadmap', roadmapsRoute)
router.use('/connection', connectionRoute)
router.use('/community', communityRoute)
router.get('/', (req, res) => res.send('Welcome to skill hatch server!'))

export default router