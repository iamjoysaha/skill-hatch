import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { 
  createUser,
  getUsersByAccountType, 
  loginUser,
  updateLastActive,
} from '../controllers/index.js'
import Users from '../models/Users.js'

const router = express.Router()
dotenv.config()

router.post('/create', async (req, res) => {
    const { first_name, last_name, college_name, roll_no, email, username, password, confirm_password, account_type, expertise } = req.body

    const { success, message, user } = await createUser({ first_name, last_name, college_name, roll_no, email, username, password, account_type, expertise })

    success ? res.status(201).json({ success, message, user }) : res.status(400).json({ success, message })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const { success, message, user } = await loginUser({ email, password })

  if(success) {
    const token = jwt.sign({ id: user.id, email: user.email, role: user.account_type }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
    res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false, secure: false, sameSite: 'Lax' })
    
    return res.status(200).json({ success, message, user, token })
  } 
  else {
    return res.status(400).json({ success, message })
  }
})

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) 
      return res.status(401).json({ success: false, message: 'No token provided!' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decoded.id
    if (!userId) 
      return res.status(401).json({ success: false, message: "Unauthorized" })

    await Users.update({ status: 'inactive', last_active_at: new Date() }, { where: { id: userId } })

    res.clearCookie('token')
    res.status(200).json({ success: true, message: 'Logged out successfully!' })
  } 
  catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Logout failed!' })
  }
})

router.get('/mentors', async (req, res) => {
  const { success, message, users } = await getUsersByAccountType('mentor')
  if (!success)
    return res.status(404).json({ success, message })
  
  return res.json({ success, mentors: users })
})

router.post('/update-last-active', async (req, res) => {
  const { user_id } = req.body
  const { success, message, user } = await updateLastActive(user_id)

  return success ? res.status(200).json({ success, message, user }) : res.status(400).json({ success, message })
})

export default router