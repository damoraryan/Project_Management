import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/addtask.css"; // Reusing AddTask styles

export const UpdateTask = () => {
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
    const [projects, setProjects] = useState([]);
    const [modules, setModules] = useState([]);
    const selectedProjectId = watch("projectId");

    // ✅ Fetch all projects
    useEffect(() => {
        axios.get("/projects")
            .then((res) => setProjects(res.data.data))
            .catch(() => {
                toast.error("❌ Failed to load projects!");
            });
    }, []);

    // ✅ Fetch task data to prefill the form
    useEffect(() => {
        axios.get(`/task/${id}`)
            .then((res) => {
                const task = res.data.data;
                setValue("projectId", task.projectId?._id || "");
                setValue("moduleId", task.moduleId?._id || "");
                setValue("title", task.title || "");
                setValue("priority", task.priority || "");
                setValue("description", task.description || "");
                setValue("totalMinutes", task.totalMinutes || 0);
            })
            .catch(() => {
                toast.error("❌ Failed to load task!");
            });
    }, [id, setValue]);

    // ✅ Fetch modules based on selected project
    useEffect(() => {
        if (selectedProjectId) {
            axios.get(`/modules/${selectedProjectId}`)
                .then((res) => setModules(res.data.data))
                .catch(() => {
                    setModules([]);
                    toast.error("❌ Failed to load modules!");
                });
        } else {
            setModules([]);
        }
    }, [selectedProjectId]);

    // ✅ Submit updated data
    const submitHandler = async (data) => {
        toast.info("📤 Submitting update...");
        try {
            const res = await axios.put(`/task/${id}`, data);
            if (res.data.success) {
                toast.success("✅ Task updated successfully!");
            } else {
                toast.error("⚠️ Something went wrong! Check response.");
            }
        } catch {
            toast.error("❌ Failed to update task!");
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
                <h1 className="add-task-title">UPDATE TASK</h1>
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

                    {/* ✅ Module Dropdown */}
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
                    <button type="submit" className="update-btn">Update</button>
                </form>

                {/* 🎉 Toastify */}
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};
