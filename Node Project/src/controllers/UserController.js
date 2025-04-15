const userModel = require("../models/UserModel")
 
const bcrypt=require("bcrypt")
const mailUtil=require("../utils/MailUtil")
const jwt=require("jsonwebtoken")
const secret="secret"
const mongoose = require("mongoose");

const loginUser=async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password

        const foundUserFromEmail=await userModel.findOne({email:email}).populate("roleId")
        console.log(foundUserFromEmail)
        if(foundUserFromEmail!=null){
            const isMatch=bcrypt.compareSync(password,foundUserFromEmail.password)
            if(isMatch==true){
                res.status(200).json({
                    message:"login successfull....",
                    data:foundUserFromEmail
                })
            }else{
                res.status(404).json({
                    message:"invalid password...."
                })
            }
        }else{
            res.status(404).json({
                message:"email is not found..."
            })
        }

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"error",
            data:err
        })

    }
}

const signup=async(req,res)=>{
    try{
        const salt=bcrypt.genSaltSync(10)
        const hashPassword=bcrypt.hashSync(req.body.password,salt)
        req.body.password=hashPassword

        const createdUser=await userModel.create(req.body);

        const mailresponse=await mailUtil.sendingMail(createdUser.email,"welcome to projectmanagement","this is welcome mail")
        res.status(201).json({
            message:"user created...",
            data:createdUser
        })

    }
    catch(err){
        console.log(err)
            res.status(500).json({
                message:"error",
                data:err
            })
    }
}

const addUser = async (req, res) => {
    try {
        const savedUser = await userModel.create(req.body)

        res.json({
            message: "user add...",
            data: savedUser
        })
    }catch(err){
        res.status(500).json({
            message:"error",
            data:err
        })
    }
}

const deleteUser = async (req, res) => {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);

    res.json({
        message: "User deleted successfully",
        data: deletedUser
    });
};


const getUserById = async (req, res) => {
    const foundUser = await userModel.findById(req.params.id).populate("roleId");
    res.json({
        message: "user fatched..",
        data: foundUser
    })
}

const getAllUser = async (req, res) => {
    const user = await userModel.find().populate("roleId");

    res.json({
        message: "user fetched ...",
        data: user
    })
}

const updateUser=async(req,res)=>{
    try{
        const updatedUser=await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json({
            message:"user update successfully..",
            data:updatedUser
        })

    }catch(err){
        res.status(500).json({
            message:"error while update user..",
            error:err
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const foundUser = await userModel.findOne({ email: email });

        if (foundUser) {
            const token = jwt.sign({ id: foundUser._id }, secret, { expiresIn: "1h" }); // Valid for 1 hour
            console.log("Generated Token:", token);

            const url = `http://localhost:5173/resetpassword?token=${token}`;

            const mailContent = `
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>Click the button below to reset your password:</p>
                    <a href="${url}" 
                        style="display: inline-block; padding: 12px 20px; background-color: #007bff; 
                               color: white; text-decoration: none; font-size: 16px; 
                               border-radius: 5px; font-weight: bold;">
                        Reset Password
                    </a>
                    <p>If you did not request this, please ignore this email.</p>
                </body>
            </html>
            `;

            await mailUtil.sendingMail(foundUser.email, "Reset Password", mailContent);
            res.json({ message: "Reset password link sent to email" });
        } else {
            res.status(404).json({ message: "User not found, please register first" });
        }
    } catch (err) {
        console.error("Error in forgot password:", err);
        res.status(500).json({ message: "Error while processing forgot password", error: err.message });
    }
};

const resetpassword=async(req,res)=>{
    const token =req.body.token
    const newPassword=req.body.password

    const userFromToken=jwt.verify(token,secret)

    const salt=bcrypt.genSaltSync(10)
    const hashedPassword=bcrypt.hashSync(newPassword,salt)

    const updatedUser=await userModel.findByIdAndUpdate(userFromToken._id,{
        password:hashedPassword
    })
    res.json({
        message:"password updated successfully.."
    })
}




module.exports = {
    getAllUser,
    addUser, 
    deleteUser, 
    getUserById,
    signup,
    loginUser,
    updateUser,
    forgotPassword,
    resetpassword
 
}
