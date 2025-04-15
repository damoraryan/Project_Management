import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../assets/addprojectteam.css";

export const AddProjectTeam = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch projects and users
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/projects');
                setProjects(res.data.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast.error("Error fetching projects! ❌");
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await axios.get('/users');
                setUsers(res.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error("Error fetching users! ❌");
            }
        };

        fetchProjects();
        fetchUsers();
    }, []);

    // Form Submission
    const submitHandler = async (data) => {
        try {
            console.log('Form Data:', data);
            const res = await axios.post('/projectTeam', data);
            console.log(res.data);
            
            if (res.status === 201) {
                toast.success("Project team added successfully!");
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error("Error adding project team! ❌");
        }
    };

    return (
        <div className="add-project-team-container">
            <div className="add-project-team-box">
                <h1 className="add-project-team-title">Add Project Team</h1>
                <form onSubmit={handleSubmit(submitHandler)}>
                    {/* Project Selection */}
                    <div className="input-container">
                        <label className="input-label">Project Name</label>
                        <select {...register("projectId", { required: "Project is required" })} className="input-field">
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                        {errors.projectId && <p className="error-message">{errors.projectId.message}</p>}
                    </div>

                    {/* User Selection */}
                    <div className="input-container">
                        <label className="input-label">Username</label>
                        <select {...register("userId", { required: "User is required" })} className="input-field">
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.firstName} {user.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.userId && <p className="error-message">{errors.userId.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">Submit</button>
                </form>

                {/* Toastify Container */}
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};
