import express from 'express'
import dotenv from 'dotenv'
import { createConnection, deleteConnection, getConnectionStatus, getConnectionStatusForUsers, getAcceptedConnections, updateConnectionStatus } from '../controllers/index.js'

const router = express.Router()
dotenv.config()

router.post('/create', async (req, res) => {
    const { student_id, mentor_id } = req.body
    const { success, message } = await createConnection(student_id, mentor_id, new Date())
    if(!success) {
        return res.status(400).json({ success, message })
    }

    return res.status(200).json({ success, message })
})

router.delete('/delete', async (req, res) => {
  const { student_id, mentor_id } = req.query;
  if (!student_id || !mentor_id) {
    return res.status(400).json({ success: false, message: 'Missing student_id or mentor_id' })
  }

  const { success, message } = await deleteConnection(student_id, mentor_id)
  if (!success) 
    return res.status(400).json({ success, message })

  return res.status(200).json({ success: true, message })
})

router.get('/status/:mentor_id', async (req, res) => {
  const { mentor_id } = req.params
  if (!mentor_id) {
    return res.status(400).json({ success: false, message: 'Missing mentor id!' })
  }

  try {
    const { success, message, connections } = await getConnectionStatus(mentor_id)
    if (!success) {
      return res.status(400).json({ success, message })
    }

    return res.status(200).json({ success, connections })
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
})

router.get('/status/:student_id/:mentor_id', async (req, res) => {
  const { student_id, mentor_id } = req.params
  if (!student_id || !mentor_id) {
    return res.status(400).json({ success: false, message: 'Missing student or mentor id' })
  }

  try {
    const { success, message, data } = await getConnectionStatusForUsers(student_id, mentor_id)
    if (!success) {
      return res.status(400).json({ success, message })
    }

    return res.status(200).json({ success, data })
  } 
  catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Server error" })
  }
})

router.get('/get/accepted', async (req, res) => {
  const { mentor_id } = req.query
  if (!mentor_id) {
    return res.status(400).json({ success: false, message: 'Missing mentor id!' })
  }

  const { success, message, connections } = await getAcceptedConnections(mentor_id)
  if (!success) {
    return res.status(400).json({ success, message })
  }

  return res.status(200).json({ success, connections })
})

router.patch('/status/update', async (req, res) => {
  const { student_id, mentor_id, status } = req.body
  if (!student_id || !mentor_id) {
    return res.status(400).json({ success: false, message: 'Missing student_id or mentor_id' })
  }

  const { success, message } = await updateConnectionStatus(student_id, mentor_id, status)
  if (!success) {
    return res.status(400).json({ success, message })
  }

  return res.status(200).json({ success, message })
})

router.delete('/disconnect', async (req, res) => {
  const { student_id, mentor_id } = req.body
  if (!student_id || !mentor_id) {
    return res.status(400).json({ success: false, message: 'Missing student_id or mentor_id' })
  }

  const { success, message } = await deleteConnection(student_id, mentor_id)
  return res.status(200).json({ success, message })
})

export default router
