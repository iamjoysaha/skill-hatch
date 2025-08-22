import express from 'express'
import dotenv from 'dotenv'
import { createConnection, deleteConnection, getConnectionStatus } from '../controllers/index.js'

const router = express.Router()
dotenv.config()

router.post('/create', async (req, res) => {
    const { student_id, mentor_id } = req.body
    const { success, message } = await createConnection(student_id, mentor_id, new Date())
    if(!success) {
        return res.status(400).json({ success: false, message })
    }

    return res.status(200).json({ success: true, message })
})

router.delete('/delete', async (req, res) => {
  const { student_id, mentor_id } = req.query;
  if (!student_id || !mentor_id) {
    return res.status(400).json({ success: false, message: 'Missing student_id or mentor_id' });
  }

  const { success, message } = await deleteConnection(student_id, mentor_id);

  if (!success) return res.status(400).json({ success: false, message });

  return res.status(200).json({ success: true, message });
});

router.get('/status/:student_id/:mentor_id', async (req, res) => {
  const { student_id, mentor_id } = req.params;

  if (!student_id || !mentor_id) {
    return res.status(400).json({ success: false, message: 'Missing student_id or mentor_id' });
  }

  try {
    const { success, message, data } = await getConnectionStatus(student_id, mentor_id);
    if (!success) {
      return res.status(200).json({ success: true, message });
    }

    return res.status(200).json({ success: true, data });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
})

export default router
