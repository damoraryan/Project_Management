const mongoose=require("mongoose")
const Schema=mongoose.Schema

const userTaskSchema=new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projectModule",
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task",
        required: true
    }
}, { timestamps: true });

module.exports=mongoose.model("userTask",userTaskSchema)