
const roleModel=require("../models/RoleModel")

const getAllRoles=async(req,res)=>{
    const roles=await roleModel.find();

    res.json({
        message:"role fetched ...",
        data:roles
    })
}

const addRole=async(req,res)=>{
    const savedRole=await roleModel.create(req.body)

    res.json({
        message:"role created...",
        data:savedRole
    })
}

const deleteRole=async(req,res)=>{

    //console.log(req.param.id)
    const deletedRole=await roleModel.findByIdAndDelete(req.params.id)

    res.json({
        message:"role deleted successfully..",
        data:deletedRole
    })
}

const getRoleById=async(req,res)=>{
    const foundRole=await roleModel.findById(req.params.id)
    res.json({
        message:"role fatched..",
        data:foundRole
    })
}

const updateRole=async(req,res)=>{
    try{
        const updatedRole=await roleModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json({
            message:"role update successfully..",
            data:updatedRole
        })

    }catch(err){
        res.status(500).json({
            message:"error while update role..",
            error:err
        })
    }
}
module.exports={
    getAllRoles,addRole,deleteRole,getRoleById,updateRole
}