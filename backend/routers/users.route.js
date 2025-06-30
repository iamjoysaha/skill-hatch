import express from 'express'
import { createUser, loginUser, updateSocket } from '../controllers/index.js'
const router = express.Router()

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

  return success ? res.status(200).json({ success, message, user }): res.status(400).json({ success, message })
})

export default router