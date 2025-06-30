import express from 'express'
import userRoute from './users.route.js'

const router = express.Router()

// my routes
router.use('/api/user', userRoute)

// index route
router.get('/', (req, res) => {
    res.send('Welcome to the server!')
})

export default router