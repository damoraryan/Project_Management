const mongoose=require("mongoose")
const Schema=mongoose.Schema

const taskSchema=new Schema({
    moduleId:{
        type:Schema.Types.ObjectId, 
        ref:"projectModule",
        required:true
    },
    projectId:{
        type:Schema.Types.ObjectId, 
        ref:"project",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        enum: ["Low", "Medium", "High"],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    totalMinutes:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model("task",taskSchema)