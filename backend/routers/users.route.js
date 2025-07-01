import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { createUser, loginUser, updateSocket } from '../controllers/index.js'

const router = express.Router()
dotenv.config()

router.post('/create', async (req, res) => {
    const { socket_id, first_name, last_name, college_name, roll_no, email, username, password, confirm_password, account_type, expertise } = req.body

    const { success, message, user } = await createUser({ socket_id, first_name, last_name, college_name, roll_no, email, username, password, account_type, expertise })

    success ? res.status(201).json({ success, message, user }) : res.status(400).json({ success, message })
})

router.put('/socket', async (req, res) => {
  const { user_id, socket_id } = req.body
  const { success, message } = await updateSocket({user_id, socket_id})

  return success ? res.status(200).json({ success, message }) : res.status(400).json({ success, message })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const { success, message, user } = await loginUser({ email, password })

  if(success) {
    const token = jwt.sign({ id: user.id, email: user.email, socket_id: user.socket_id, role: user.account_type }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
    res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false, secure: false, sameSite: 'Lax' })
    
    return res.status(200).json({ success, message, user, token })
  } 
  else {
    return res.status(400).json({ success, message })
  } 
})

router.get('/login', async (req, res) => {
    res.clearCookie('connect.sid')
    res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' })
    res.setHeader('Cache-Control', 'no-store')
})

router.all('/logout', async (req, res) => {  
  res.clearCookie('connect.sid')
  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' })
  res.redirect('/user/login')
})


export default router