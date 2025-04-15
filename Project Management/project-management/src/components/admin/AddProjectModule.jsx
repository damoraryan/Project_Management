import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/addprojectmodule.css';

export const AddProjectModule = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    // 🎯 Fetching Projects for Dropdown
    useEffect(() => {
        axios.get("/projects")
            .then((res) => setProjects(res.data.data))
            .catch(() => {
                toast.error("Failed to fetch projects! ❌");
            });
    }, []);

    // 🚀 Form Submit Handler
    const submitHandler = async (data) => {
        try {
            const res = await axios.post("/module", data);
            if (res.status === 201 || res.data.success) {
                toast.success("🎉 Module added successfully!");
                setTimeout(() => navigate(`/admin/viewmoduletable/${data.projectId}`), 1500); // ✅ Use dynamic projectId here
            } else {
                toast.error("⚠️ Something went wrong!");
            }
        } catch (error) {
            toast.error("❌ Error adding module! Try again.");
        }
    };
    
    return (
        <div className="add-project-module-container">
            <div className="add-project-module-box">
                <h1 className="add-project-module-title">ADD PROJECT MODULE</h1>
                <form onSubmit={handleSubmit(submitHandler)}>

                    {/* Project Name Dropdown */}
                    <div className="input-container">
                        <label className="input-label">Project Name</label>
                        <select
                            {...register("projectId", { required: "Project is required" })}
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

                    {/* Module Name */}
                    <div className="input-container">
                        <label className="input-label">Module Name</label>
                        <input
                            type="text"
                            placeholder="Enter module name"
                            {...register("moduleName", { required: "Module name is required" })}
                            className="input-field"
                        />
                        {errors.moduleName && <p className="error-message">{errors.moduleName.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="input-container">
                        <label className="input-label">Description</label>
                        <textarea
                            placeholder="Enter module description"
                            {...register("description", { required: "Description is required" })}
                            className="textarea-field"
                        ></textarea>
                        {errors.description && <p className="error-message">{errors.description.message}</p>}
                    </div>

                    {/* Estimated Hours */}
                    <div className="input-container">
                        <label className="input-label">Estimated Hours</label>
                        <input
                            type="number"
                            placeholder="Enter estimated hours"
                            {...register("estimatedHours", {
                                required: "Estimated hours are required",
                                min: { value: 1, message: "Hours must be a positive number" }
                            })}
                            className="input-field"
                        />
                        {errors.estimatedHours && <p className="error-message">{errors.estimatedHours.message}</p>}
                    </div>

                    {/* Start Date */}
                    <div className="input-container">
                        <label className="input-label">Start Date</label>
                        <input
                            type="date"
                            {...register("startDate", { required: "Start date is required" })}
                            className="input-field"
                        />
                        {errors.startDate && <p className="error-message">{errors.startDate.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="update-btn">Submit</button>
                </form>

                {/* Toastify Notification Container */}
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};
