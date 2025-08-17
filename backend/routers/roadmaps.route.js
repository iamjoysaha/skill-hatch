import express from 'express'
import dotenv from 'dotenv'
import { getQuestionAnswer } from '../services/index.js'
import { createRoadmap, deleteRoadmapById, getRoadmapsByUserId } from '../controllers/index.js'

const router = express.Router()
dotenv.config()

router.post('/generate', async (req, res) => {
  const { question } = req.body

  if (!question) {
    return res.status(400).json({ success: false, message: "Question is required" })
  }

  try {
    const completion = await getQuestionAnswer(question)
    return res.status(200).json({ success: true, roadmap: completion })
  } 
  catch (error) {
    console.error("\nGroq generation error: ", error?.response?.data || error.message)
    return res.status(500).json({ success: false, message: "Failed to generate roadmap" })
  }
});

router.post('/create', async (req, res) => {
  const { title, description, duration, tasks, status, level, badge, total_points, earned_points, user_id } = req.body
  const { success, message, roadmap } = await createRoadmap(title, description, duration, tasks, status, level, badge, total_points, earned_points, user_id)
  if(!success) {
    return res.status(500).json({ success: false, message })
  }

  return res.status(200).json({ success: true, message, roadmap })
});

router.get('/roadmaps', async (req, res) => {
  const { user_id } = req.query
  const { success, message, roadmaps } = await getRoadmapsByUserId(user_id)
  if(!success)
    return res.status(500).json({ success: false, message })

  return res.status(200).json({ success: true, message, roadmaps })
})

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  const { success, message } = await deleteRoadmapById(id)
  if (!success) 
    return res.status(500).json({ success: false, message })

  return res.status(200).json({ success: true, message: "Roadmap deleted successfully" })
})

export default router