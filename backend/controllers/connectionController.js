import { Connection } from "../models/index.js";

async function createConnection(student_id, mentor_id, requested_at) {
  try {
    const data = await Connection.create({ requested_at, student_id, mentor_id });
    if (!data) {
      return { success: false, message: "Failed to create connection request" };
    }
    return { success: true, message: "Connection request created successfully", data };
  } 
  catch (error) {
    console.error(error)
    console.log("\n:::Exception occurred inside createRequest! :::\n")
    return { success: false, message: "Failed to request connection" }
  }
}

async function getConnectionStatus(student_id, mentor_id) {
  try {
    const data = await Connection.findOne({ where: { student_id, mentor_id } });
    if (!data)
        return { success: false, message: "No connection found" }
    
    return { success: true, message: "Connection status retrieved successfully", data }
  } 
  catch (error) {
    console.error(error);
    console.log("\n:::Exception occurred inside getConnectionStatus! :::\n");
    return { success: false, message: "Failed to retrieve connection status" };
  }
}

async function updateConnectionStatus(student_id, mentor_id, status, is_connected = false, accepted_at = null) {
  try {
    if(status === 'accepted') {
      is_connected = true
      accepted_at = new Date()
    }
    const data = await Connection.update({ status, accepted_at, is_connected }, { where: { student_id, mentor_id } })
    if (!data) {
      return { success: false, message: "Failed to update connection status" }
    }
    return { success: true, message: "Connection status updated successfully" }
  } 
  catch (error) {
    console.error(error);
    console.log("\n:::Exception occurred inside updateConnectionStatus! :::\n")
    return { success: false, message: "Failed to update connection status" }
  }
}

async function deleteConnection(student_id, mentor_id) {
  try {
    const data = await Connection.destroy({ where: { student_id, mentor_id } })
    if (!data) {
      return { success: false, message: "Failed to delete connection" }
    }
    return { success: true, message: "Connection deleted successfully" }
  } 
  catch (error) {
    console.error(error);
    console.log("\n:::Exception occurred inside deleteConnection! :::\n")
    return { success: false, message: "Failed to delete connection" }
  }
}

export {
    createConnection,
    getConnectionStatus,
    updateConnectionStatus,
    deleteConnection,
}