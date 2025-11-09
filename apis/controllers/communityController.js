import { Community } from "../models/index.js"

async function addContent(user_id, title, description, type, code, link, image_name, image_url) {
  if(!title || !description || !type || !user_id) {
    return { success: false, message: "Missing required fields" }
  }

  try {
    const content = await Community.create({ 
        title,
        description,
        type,
        code: code || null,
        link: link || null, 
        image_name: image_name || null,
        image_url: image_url || null,
        user_id,
    })

    if(!content) 
      return { success: false, message: "Failed to add content" }
    return { success: true, message: "Content added successfully" }
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside addContent!! :::\n")
    return { success: false, message: "Failed to add content" }
  }
}

async function getContents() {
  try {
    const contents = await Community.findAll()
    return { success: true, contents }
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside getContents!! :::\n")
    return { success: false, message: "Failed to get contents" }
  }
}

async function getContentsByType(type) {
  try {
    const contents = await Community.findAll({ where: { type } })
    return { success: true, contents }
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside getContentsByType!! :::\n")
    return { success: false, message: "Failed to get contents" }
  }
}

async function getContentsByUserId(user_id) {
  try {
    const contents = await Community.findAll({ where: { user_id } })
    return { success: true, contents }
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside getContentsByUserId!! :::\n")
    return { success: false, message: "Failed to get contents" }
  }
}
async function deleteContent(id) {
  try {
    const content = await Community.destroy({ where: { id } })
    if(!content) 
      return { success: false, message: "Failed to delete content" }
    return { success: true, message: "Content deleted successfully" }
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside deleteContent!! :::\n")
    return { success: false, message: "Failed to delete content" }
  }
}

async function updateContent(id, updates) {
  try {
    if (!updates || Object.keys(updates).length === 0) {
      return { success: false, message: "No fields provided to update" }
    }

    const [updatedRows] = await Community.update(updates, { where: { id } })
    if (updatedRows === 0) {
      return { success: false, message: "Content not found or nothing to update" }
    }

    const updatedContent = await Community.findByPk(id)
    return { success: true, message: "Content updated successfully", content: updatedContent }
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside updateContent!! :::\n")
    return { success: false, message: "Failed to update content" }
  }
}

export {
  addContent,
  getContents,
  getContentsByType,
  getContentsByUserId,
  deleteContent,
  updateContent,
}