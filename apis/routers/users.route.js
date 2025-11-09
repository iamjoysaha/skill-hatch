import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { 
  createUser,
  deleteUserById,
  getUserById,
  getUsersByAccountType, 
  loginUser,
  updateLastActive,
  updateUserById,
  getBadgesByUserId,
} from '../controllers/index.js'
import { User } from '../models/index.js'
import { upload, updateCloudinaryImage, deleteCloudinaryImage } from '../services/cloudinary.js'

const router = express.Router()
dotenv.config()

router.post('/create', async (req, res) => {
    const { first_name, last_name, college_name, roll_no, email, username, password, account_type, expertise } = req.body

    const { success, message, user } = await createUser({ first_name, last_name, college_name, roll_no, email, username, password, account_type, expertise })

    success ? res.status(201).json({ success, message, user }) : res.status(400).json({ success, message })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const { success, message, user } = await loginUser({ email, password })

  if(success) {
    const token = jwt.sign({ id: user.id, email: user.email, role: user.account_type }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })
    
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

    await User.update({ logged_out_at: new Date(), status: 'inactive', last_active_at: new Date() }, { where: { id: userId } })

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

router.get('/students', async (req, res) => {
  const { success, message, users } = await getUsersByAccountType('student')
  if (!success)
    return res.status(404).json({ success, message })
  
  return res.json({ success, mentors: users })
})

router.post('/update-last-active', async (req, res) => {
  const { user_id } = req.body
  const { success, message, user } = await updateLastActive(user_id)

  return success ? res.status(200).json({ success, message, user }) : res.status(400).json({ success, message })
})

router.get('/user-data', async(req, res) => {
  const { user_id } = req.query
  const { success, message, user } = await getUserById(user_id)

  return success ? res.status(200).json({ success, message, user }) : res.status(200).json({ success, message })
})

router.put('/update', async (req, res) => {
  const { user_id, email, username, first_name, last_name, password, currentPassword } = req.body

  try {
    const user = await User.findByPk(user_id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const updates = {}
    if (email) updates.email = email
    if (username) updates.username = username
    if (first_name) updates.first_name = first_name
    if (last_name) updates.last_name = last_name

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required' })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect!' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      updates.password = hashedPassword
    }

    const { success, message } = await updateUserById(user_id, updates)
    return res.json({ success, message })

  } 
  catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Error updating user' })
  }
})

router.put('/update-image', upload.single('image'), async (req, res) => {
  const { user_id } = req.body
  if (!req.file)
    return res.status(400).json({ success: false, message: 'No image file provided!' })

  try {
    const { user } = await getUserById(user_id)
    const old_file_name = user.file_name
    const { buffer, originalname } = req.file

    const result = await updateCloudinaryImage({
      old_file_name,
      original_filename: originalname.split('.')[0],
      buffer,
    })

    if (!result.success) 
      return res.status(500).json(result)

    const { image_url, file_name } = result.imageData

    await updateUserById(user_id, { profile_image: image_url, file_name })
    return res.status(200).json({ success: true, message: 'Image updated', imageUrl: image_url })
  }
  catch (error) {
    console.error('Error in /update-image:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.post('/delete', async (req, res) => {
    const { user_id } = req.body
    const { user } = await getUserById(user_id)
    if (!user)
      return res.status(400).json({ success: false, message: 'No user found to delete!' })

    await deleteCloudinaryImage(user.file_name)
    const { success, message } = await deleteUserById(user.id)

    res.clearCookie('token')
    return res.status(200).json({ success, message })
})

router.get('/badges', async (req, res) => {
  const { id } = req.query
  const { success, message, badges } = await getBadgesByUserId(id)

  return success ? res.status(200).json({ success, message, badges }) : 
    res.status(400).json({ success, message })
})

export default router