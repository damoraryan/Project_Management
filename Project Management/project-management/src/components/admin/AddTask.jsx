import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/addtask.css";

export const AddTask = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [projects, setProjects] = useState([]);
    const [modules, setModules] = useState([]);
    const selectedProjectId = watch("projectId");
    const navigate = useNavigate(); // ✅ Navigation hook

    // ✅ Fetch projects on page load
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get("/projects");
                setProjects(res.data.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast.error("❌ Failed to load projects!");
            }
        };
        fetchProjects();
    }, []);

    // ✅ Fetch modules when project changes
    useEffect(() => {
        if (selectedProjectId) {
            const fetchModules = async () => {
                try {
                    const res = await axios.get(`/modules/${selectedProjectId}`);
                    setModules(res.data.data || []);
                } catch (error) {
                    console.error("Error fetching modules:", error);
                    setModules([]);
                    toast.error("❌ Failed to load modules!");
                }
            };
            fetchModules();
        } else {
            setModules([]);
        }
    }, [selectedProjectId]);

    // ✅ Submit Form with Toastify and navigate
    const submitHandler = async (data) => {
        try {
            const res = await axios.post("/task", data);
            if (res.status === 201) {
                toast.success("✅ Task added successfully!");
                setTimeout(() => {
                    navigate(`/admin/task/${data.moduleId}`); // ✅ Navigate to view task page
                }, 1500); // Optional delay for user to see the toast
            } else {
                toast.warn("⚠️ Task added, but response is not 201.");
            }
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error("❌ Failed to add task. Try again!");
        }
    };

    // ✅ Validation Schema
    const validationSchema = {
        projectValidator: { required: { value: true, message: "Project is required" } },
        moduleValidator: { required: { value: true, message: "Module is required" } },
        titleValidator: { required: { value: true, message: "Title is required" } },
        priorityValidator: { required: { value: true, message: "Priority is required" } },
        descriptionValidator: { required: { value: true, message: "Description is required" } },
        totalMinutesValidator: {
            required: { value: true, message: "Total minutes are required" },
            min: { value: 1, message: "Minutes must be a positive number" }
        }
    };

    return (
        <div className="add-task-container">
            <div className="add-task-box">
                <h1 className="add-task-title">ADD TASK</h1>
                <form onSubmit={handleSubmit(submitHandler)}>

                    {/* ✅ Project Dropdown */}
                    <div className="input-container">
                        <label className="input-label">Project Name</label>
                        <select
                            {...register("projectId", validationSchema.projectValidator)}
                            className="input-field"
                        >
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                        {errors.projectId && <p className="error-message">{errors.projectId.message}</p>}
                    </div>

                    {/* ✅ Module Dropdown (Filtered) */}
                    <div className="input-container">
                        <label className="input-label">Module Name</label>
                        <select
                            {...register("moduleId", validationSchema.moduleValidator)}
                            className="input-field"
                            disabled={!selectedProjectId}
                        >
                            <option value="">Select Module</option>
                            {modules.length > 0 ? (
                                modules.map((module) => (
                                    <option key={module._id} value={module._id}>
                                        {module.moduleName}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No modules available</option>
                            )}
                        </select>
                        {errors.moduleId && <p className="error-message">{errors.moduleId.message}</p>}
                    </div>

                    {/* ✅ Task Title */}
                    <div className="input-container">
                        <label className="input-label">Title</label>
                        <input
                            type="text"
                            placeholder="Enter task title"
                            {...register("title", validationSchema.titleValidator)}
                            className="input-field"
                        />
                        {errors.title && <p className="error-message">{errors.title.message}</p>}
                    </div>

                    {/* ✅ Priority Dropdown */}
                    <div className="input-container">
                        <label className="input-label">Priority</label>
                        <select
                            {...register("priority", validationSchema.priorityValidator)}
                            className="input-field"
                        >
                            <option value="">Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        {errors.priority && <p className="error-message">{errors.priority.message}</p>}
                    </div>

                    {/* ✅ Description */}
                    <div className="input-container">
                        <label className="input-label">Description</label>
                        <textarea
                            placeholder="Enter task description"
                            {...register("description", validationSchema.descriptionValidator)}
                            className="textarea-field"
                        ></textarea>
                        {errors.description && <p className="error-message">{errors.description.message}</p>}
                    </div>

                    {/* ✅ Total Minutes */}
                    <div className="input-container">
                        <label className="input-label">Total Minutes</label>
                        <input
                            type="number"
                            placeholder="Enter total minutes"
                            {...register("totalMinutes", validationSchema.totalMinutesValidator)}
                            className="input-field"
                        />
                        {errors.totalMinutes && <p className="error-message">{errors.totalMinutes.message}</p>}
                    </div>

                    {/* ✅ Submit Button */}
                    <button type="submit" className="update-btn">Submit</button>
                </form>

                {/* 🎉 Toastify Container */}
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};
