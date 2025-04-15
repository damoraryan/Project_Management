const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    age: {
        type: Number
    },
    status: {
        type: Boolean,
        default: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "roles"
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "project"
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    bio: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String, // Changed to String for better format handling
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("users", userSchema)