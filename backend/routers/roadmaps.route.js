import express from 'express'
import dotenv from 'dotenv'
import { getQuestionAnswer } from '../services/index.js'

const router = express.Router()
dotenv.config()


router.post('/create', async (req, res) => {
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


export default router