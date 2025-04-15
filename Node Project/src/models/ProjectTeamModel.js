const mongoose=require("mongoose")
const Schema=mongoose.Schema

const projectTeamSchema=new Schema({
    projectId:{
        type:Schema.Types.ObjectId,
        ref:"project",
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    }

},{
    timestamps:true
})

module.exports=mongoose.model("projectTeam",projectTeamSchema)