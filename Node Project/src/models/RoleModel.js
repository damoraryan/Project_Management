const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const roleSchema=new Schema({
    //get
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model("roles",roleSchema)