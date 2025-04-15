const mongoose=require("mongoose")
const Schema=mongoose.Schema

const projectSchema=new Schema({
    title:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    technology:{
        type:String,
        required:true
    },
    estimatedHours:{
        type:Number,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    completionDate:{
        type:Date,
        default:null
    }
},{
    timestamps:true
})

module.exports=mongoose.model("project",projectSchema)