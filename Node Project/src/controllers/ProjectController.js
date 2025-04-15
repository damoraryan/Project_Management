const projectModel = require("../models/ProjectModel");

const cloudinaryUtil = require("../utils/CloudanryUtil");
const multer = require("multer");
const path = require("path");

// Set up multer to store files on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage }).single("hordingURL");


// 🛠️ Add Project
const addProject = async (req, res) => {
    try {
        const createProject = await projectModel.create(req.body);
        res.status(201).json({
            message: "Project created successfully",
            data: createProject
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error creating project",
            error: err.message
        });
    }
};

// 🛠️ Delete Project
const deleteProject = async (req, res) => {
    try {
        await projectModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Project deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error deleting project",
            error: err.message
        });
    }
};

// 🛠️ Get All Projects
const getAllProject = async (req, res) => {
    try {
        const projects = await projectModel.find();
        res.status(200).json({
            message: "Projects fetched successfully",
            data: projects
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching projects",
            error: err.message
        });
    }
};

// 🛠️ Get Project by ID
const getProjectById = async (req, res) => {
    try {
        const project = await projectModel.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({
            message: "Project fetched successfully",
            data: project
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching project",
            error: err.message
        });
    }
};

// 🛠️ Add Project with File Upload (Cloudinary)
const fs = require("fs"); // Required to delete file after upload

const addHordingWithFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("File upload error:", err);
            return res.status(500).json({ message: "File upload failed", error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file received. Please upload a valid file." });
        }

        try {
            console.log("Uploaded File Path:", req.file.path); // Check file path

            // Upload to Cloudinary from file path
            const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file.path);
            console.log("Cloudinary Response:", cloudinaryResponse);

            // Store Cloudinary URL in the database
            req.body.hordingURL = cloudinaryResponse.secure_url;
            const savedProject = await projectModel.create(req.body);

            // ✅ Delete local file after uploading to Cloudinary
            fs.unlinkSync(req.file.path);

            res.status(201).json({ message: "Project saved successfully", data: savedProject });

        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            res.status(500).json({ message: "Error processing file upload", error: error.message });
        }
    });
};
 
const updateProject=async(req,res)=>{
    try{
        const updatedProject=await projectModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json({
            message:"project update successfully..",
            data:updatedProject
        })

    }catch(err){
        res.status(500).json({
            message:"error while update project..",
            error:err
        })
    }
}


// Export the module functions
module.exports = {
    addProject,
    deleteProject,
    getAllProject,
    getProjectById,
    addHordingWithFile,
    updateProject
};
