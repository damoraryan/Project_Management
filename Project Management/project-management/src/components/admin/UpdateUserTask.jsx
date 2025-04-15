import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Added
import "react-toastify/dist/ReactToastify.css"; // ✅ Added
import "../../assets/usertasdetail.css";

export const UpdateUserTask = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const { id } = useParams(); // Assigned Task ID
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState([]);

  const selectedProjectId = watch("projectId");
  const selectedModuleId = watch("moduleId");

  // ✅ Fetch Initial Data (Assigned Task Details)
  useEffect(() => {
    const fetchAssignedTask = async () => {
      try {
        const res = await axios.get(`/userTask/${id}`);
        const data = res.data.data;
        setValue("projectId", data.projectId._id);
        setValue("moduleId", data.moduleId._id);
        setValue("taskId", data.taskId._id);
        setValue("userId", data.userId._id);
      } catch (error) {
        toast.error("Error fetching assigned task");
      }
    };
    fetchAssignedTask();
  }, [id, setValue]);

  // ✅ Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/projects");
        setProjects(res.data.data || []);
      } catch (error) {
        toast.error("Error fetching projects");
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Fetch Modules on Project Select
  useEffect(() => {
    if (selectedProjectId) {
      const fetchModules = async () => {
        try {
          const res = await axios.get(`/modules/${selectedProjectId}`);
          setModules(res.data.data || []);
        } catch (error) {
          toast.error("Error fetching modules");
          setModules([]);
        }
      };
      fetchModules();
    }
  }, [selectedProjectId]);

  // ✅ Fetch Tasks on Module Select
  useEffect(() => {
    if (selectedModuleId) {
      const fetchTasks = async () => {
        try {
          const res = await axios.get(`/tasks/module/${selectedModuleId}`);
          setTasks(res.data.data || []);
        } catch (error) {
          toast.error("Error fetching tasks");
          setTasks([]);
        }
      };
      fetchTasks();
    }
  }, [selectedModuleId]);

  // ✅ Fetch All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/users`);
        setUsers(res.data.data || []);
      } catch (error) {
        toast.error("Error fetching users");
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Submit Handler
  const submitHandler = async (data) => {
    try {
      const res = await axios.put(`/userTask/${id}`, data);
      toast.success("Assigned task updated successfully!");
      // redirect to task list
    } catch (error) {
      toast.error("Something went wrong while updating.");
    }
  };

  const validationSchema = {
    projectValidator: { required: "Project is required" },
    moduleValidator: { required: "Module is required" },
    taskValidator: { required: "Task is required" },
    userValidator: { required: "User is required" },
  };

  return (
    <div className="assign-task-container">
      <div className="assign-task-box">
        <h1 className="assign-task-title">Update Assigned Task</h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          {/* Project */}
          <div className="input-container">
            <label className="input-label">Select Project</label>
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
            <span className="error-message">{errors.projectId?.message}</span>
          </div>

          {/* Module */}
          <div className="input-container">
            <label className="input-label">Select Module</label>
            <select
              {...register("moduleId", validationSchema.moduleValidator)}
              className="input-field"
              disabled={!selectedProjectId}
            >
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.moduleName}
                </option>
              ))}
            </select>
            <span className="error-message">{errors.moduleId?.message}</span>
          </div>

          {/* Task */}
          <div className="input-container">
            <label className="input-label">Select Task</label>
            <select
              {...register("taskId", validationSchema.taskValidator)}
              className="input-field"
              disabled={!selectedModuleId}
            >
              <option value="">Select Task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
            <span className="error-message">{errors.taskId?.message}</span>
          </div>

          {/* User */}
          <div className="input-container">
            <label className="input-label">Select User</label>
            <select
              {...register("userId", validationSchema.userValidator)}
              className="input-field"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
            <span className="error-message">{errors.userId?.message}</span>
          </div>

          {/* Submit */}
          <button type="submit" className="update-btn">
            Update Assigned Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserTask;
