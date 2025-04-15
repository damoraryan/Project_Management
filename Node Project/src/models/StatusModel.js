const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
  statusName: {
    type: String,
    enum: [
      "Pending",
      "In Progress",
      "On Hold",
      "Review",
      "Approved",
      "Rejected",
      "Completed"
    ],
    required: true,
    default: "Pending"
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"], // you can add more roles if needed
    required: true
  },
  entityType: {
    type: String,
    enum: ["project", "projectModule", "task"], // 👈 Match model names here
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "entityType" // 🔁 Dynamic reference to correct model
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model("Status", statusSchema);
