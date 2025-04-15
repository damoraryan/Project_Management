const statusModel = require("../models/StatusModel");

// ✅ Add Status
const addStatus = async (req, res) => {
  try {
    const createStatus = await statusModel.create(req.body);
    res.status(201).json({
      message: "Status added successfully.",
      data: createStatus,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to add status.",
      error: err,
    });
  }
};

// ✅ Delete Status by ID
const deleteStatus = async (req, res) => {
  try {
    await statusModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Status deleted successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete status.",
      error: err,
    });
  }
};

// ✅ Get All Statuses
const getStatus = async (req, res) => {
  try {
    const statuses = await statusModel.find();
    res.status(200).json({
      message: "Statuses fetched successfully.",
      data: statuses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch statuses.",
      error: err,
    });
  }
};

// ✅ Get Status by ID
const getStatusById = async (req, res) => {
  try {
    const status = await statusModel.findById(req.params.id);
    res.status(200).json({
      message: "Status fetched by ID.",
      data: status,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch status by ID.",
      error: err,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    // 1. Update the current status
    const status = await statusModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // 2. Check for user completion → update admin status to "Review"
    if (status?.role === "USER" && req.body.statusName === "Completed") {
      // Check if admin has a status entry for this same task
      const existingAdminStatus = await statusModel.findOne({
        entityId: status.req.params.id,
        entityType: status.entityType,
        role: "ADMIN",
      });

      if (existingAdminStatus) {
        // Update existing admin status to "Review"
        existingAdminStatus.statusName = "Review";
        await existingAdminStatus.save();
      } else {
        // Create new admin status with "Review"
        await statusModel.create({
          entityId: status.entityId,
          entityType: status.entityType,
          role: "ADMIN",
          statusName: "Review",
        });
      }
    }

    res.status(200).json({
      message: "Status updated successfully.",
      data: status,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update status.",
      error: err,
    });
  }
};


// ✅ Get Status by Entity ID (Custom Helper)
const getStatusByEntity = async (req, res) => {
  const { entityId } = req.params;
  try {
    const status = await statusModel.findOne({ entityId });
    res.status(200).json({
      message: "Status fetched by entity ID.",
      data: status,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch status by entity ID.",
      error: err,
    });
  }
};

module.exports = {
  getStatus,
  getStatusById,
  addStatus,
  deleteStatus,
  updateStatus,
  getStatusByEntity, // 🚀 Custom one for frontend
};
