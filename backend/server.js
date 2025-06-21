import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import { initializeDB } from './services/database.js'

const server = express()
dotenv.config()

// middlewares
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cookieParser())
server.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false, cookie: { maxAge: 1000 * 60 * 60 * 24 } }))
server.use(flash())
server.use((req, res, next) => { 
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    next()
})

// database
initializeDB()

// main route
server.get('/', (req, res) => {
    res.send('<body style="background-color: #000; color: #fff"><h2>Welcome to the server!</h2></body>')
})

// server
server.listen(process.env.PORT, (req, res) => {
    console.log(`Server started running at port: ${process.env.PORT}`)
})