import express from 'express'
import dotenv from 'dotenv'
import {addContent, getContents, getContentsByType, getContentsByUserId, deleteContent, updateContent } from '../controllers/index.js'

const router = express.Router()
dotenv.config()

router.post('/add', async (req, res) => {
    const { user_id, title, description, type, code, link, image_name, image_url } = req.body
    const { success, message } = await addContent(user_id, title, description, type, code, link, image_name, image_url)
    success ? res.status(201).json({ success, message }) : res.status(400).json({ success, message })
})

router.get('/get/all', async (req, res) => {
    const { success, message, contents } = await getContents()
    success ? res.status(200).json({ success, message, contents }) : res.status(400).json({ success, message })
})

export default router