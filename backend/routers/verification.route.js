import express from 'express'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { isAuthenticated } from '../middlewares/auth.js'
import { sendMail, sendOtpSms } from '../services/index.js'
import { getUserByEmail } from '../controllers/userController.js'

const router = express.Router()
dotenv.config()
const otpStore = {}

router.get('/verify-token', isAuthenticated, (req, res) => {
  return res.status(200).json({ success: true, user: req.user })
})

router.post('/send-otp', async (req, res) => {
  const { email, phone } = req.body

  const { success: userFound, user } = await getUserByEmail({ email })
  if (!userFound || !user) {
    return res.status(404).json({ success: false, message: 'No user found with this email!' })
  }

  const otp = crypto.randomInt(100000, 999999).toString()
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }

  const mailResult = await sendMail({ email, otp })
  const smsResult = await sendOtpSms({ phone, otp })

  if (!mailResult.success && !smsResult.success) {
    return res.status(500).json({ success: false, message: 'Failed to send OTP via email and SMS!' })
  }

  return res.status(200).json({ success: true, message: 'OTP sent via email and SMS!' })
})

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body

  const record = otpStore[email]
  if (!record) 
    return res.status(400).json({ success: false, message: 'OTP not found!' })

  if (Date.now() > record.expiresAt) 
    return res.status(400).json({ success: false, message: 'OTP expired!' })

  if (record.otp !== otp) 
    return res.status(400).json({ success: false, message: 'Invalid OTP!' })

  const { success, message, user } = await getUserByEmail({ email })
  if (!user) {
    return res.status(404).json({ success, message })
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.account_type }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
  
  res.cookie('token', token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: false,
    sameSite: 'Lax',
  })

  delete otpStore[email]
  return res.status(200).json({ success: true, message: 'OTP verified successfully!', user, token })
})


export default router