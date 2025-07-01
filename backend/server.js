import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { initializeDB } from './services/database.js'
import router from './routers/index.route.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)

// Middleware setup
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}))
app.use(flash())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    next()
})

// Socket.IO setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)
})

// Initialize DB
initializeDB()

// Routes
app.use('/', router)

// Start server
httpServer.listen(process.env.PORT, () => {
    console.log(`Server started running at port: ${process.env.PORT}`)
})