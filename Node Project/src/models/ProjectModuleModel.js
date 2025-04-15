const mongoose=require("mongoose")
const Schema=mongoose.Schema

const projectModuleSchema=new Schema({
    projectId:{
        type:Schema.Types.ObjectId, 
        ref:"project"
    },
    moduleName:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    estimatedHours:{
        type:Number,
        required:true
    },
    status:{
        type:String
    },
    startDate:{
        type:Date,
        required:true
    },
    statusName: {
        type: String,
        enum: [
          "Pending",         // Default Status
          "In Progress",     // Work Started
          "On Hold",         // Temporary Pause
          "Review",          // Needs Approval
          "Approved",        // Verified by Admin
          "Rejected",        // Not Accepted
          "Completed",       // Successfully Finished
        ],
        default: "Pending"
    }
},{
    timestamps:true
})

module.exports=mongoose.model("projectModule",projectModuleSchema)