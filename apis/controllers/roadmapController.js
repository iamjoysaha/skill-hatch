import { Roadmap } from '../models/index.js'

async function createRoadmap(title, description, duration, tasks, status, level, badge, total_points, earned_points, user_id) {
  if (!title || !description || duration == null || !Array.isArray(tasks) || tasks.length === 0 ||
    !status || !user_id || !level || !badge || total_points == null || earned_points == null) {
    return { success: false, message: "Roadmap data is required" }
  }

  try {
    const roadmap = await Roadmap.create({title, description, duration, tasks, status, level, badge, total_points, earned_points, user_id })
    return { success: true, message: "Roadmap created successfully", roadmap }

  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside createRoadmap! :::\n")
    return { success: false, message: "Failed to create roadmap" }
  }
}

async function getRoadmapsByUserId(user_id) {
  if (!user_id) {
    return { success: false, message: "User ID is required" }
  }

  try {
    const roadmaps = await Roadmap.findAll({ where: { user_id } })
    return { success: true, roadmaps }
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside getRoadmapsByUserId! :::\n")
    return { success: false, message: "Failed to retrieve roadmaps" }
  }
}

async function getRoadmapById(id) {
  if (!id) {
    return { success: false, message: "Roadmap ID is required" }
  }

  try {
    const roadmap = await Roadmap.findByPk(id)
    if (!roadmap)
      return { success: false, message: "Roadmap not found" }

    return { success: true, roadmap }
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside getRoadmapById! :::\n")
    return { success: false, message: "Failed to retrieve roadmap" }
  }
}

async function deleteRoadmapById(id) {
  if (!id) {
    return { success: false, message: "Roadmap ID is required" }
  }

  try {
    const deleted = await Roadmap.destroy({ where: { id } })
    if (deleted)
      return { success: true, message: "Roadmap deleted successfully" }

    return { success: false, message: "Roadmap not found" }
  }
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside deleteRoadmapById! :::\n")
    return { success: false, message: "Failed to delete roadmap" }
  }
}

async function updateRoadmapById(id, updates) {
  if (!id || !updates || Object.keys(updates).length === 0) {
    return { success: false, message: "Roadmap ID and updates are required" }
  }

  try {
    const [updated] = await Roadmap.update(updates, { where: { id } })
    if (updated)
      return { success: true, message: "Roadmap updated successfully" }

    return { success: false, message: "Roadmap not found" }
  }
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside updateRoadmapById! :::\n")
    return { success: false, message: "Failed to update roadmap" }
  }
}

export { 
  createRoadmap,
  getRoadmapsByUserId,
  getRoadmapById,
  deleteRoadmapById,
  updateRoadmapById,
}