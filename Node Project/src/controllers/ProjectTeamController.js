const projectModel=require("../models/ProjectTeamModel")

const addProjectTeam=async(req,res)=>{
    try{
        const createProjectTeam=await (await (await projectModel.create(req.body)).populate("projectId")).populate("userId")
        res.status(201).json({
            message:"project team added...",
            data:createProjectTeam
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error",
            data:err
        })
    }
}

const deleteProjectTeam=async(req,res)=>{
    try{
        const deletedProjectTeam=await projectModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message:"projectTeam deleted...."
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error",
            data:err
        })

    }
}

const getAllProjectTeam=async(req,res)=>{
    try{
        const projectTeam=await projectModel.find().populate("projectId").populate("userId")
        res.status(200).json({
            message:"all projectTeam fetched.....",
            data:projectTeam
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error",
            data:err
        })
    }

}

const getProjectTeamById=async(req,res)=>{
    try{
        const projectTeamById=await projectModel.findById(req.params.id).populate("projectId").populate("userId")
        res.status(200).json({
             message:"project team fetched by id...",
             data:projectTeamById
        })
        
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error...",
            data:err
        })
    }
}

const updateProjectTeam=async(req,res)=>{
    try{
        const updatedProjectTeam=await projectModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json({
            message:"projectTeam update successfully..",
            data:updatedProjectTeam
        })

    }catch(err){
        res.status(500).json({
            message:"error while update projectTeam..",
            error:err
        })
    }
}



module.exports={addProjectTeam ,deleteProjectTeam ,getAllProjectTeam ,getProjectTeamById ,updateProjectTeam }