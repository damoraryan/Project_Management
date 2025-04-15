import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import "react-toastify/dist/ReactToastify.css";
import "../../assets/usertasdetail.css";

export const UserTaskDetail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate(); // ✅ initialize navigate

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState([]);

  const selectedProjectId = watch("projectId");
  const selectedModuleId = watch("moduleId");
  const selectedTaskId = watch("taskId");

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
    } else {
      setModules([]);
    }
  }, [selectedProjectId]);

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
    } else {
      setTasks([]);
    }
  }, [selectedModuleId]);

  useEffect(() => {
    if (selectedTaskId) {
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
    } else {
      setUsers([]);
    }
  }, [selectedTaskId]);

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/userTask", data);
      toast.success("✅ Task assigned successfully!");
      setTimeout(() => {
        navigate(`/admin/viewusertable/${data.taskId}`); // ✅ navigate to task view page
      }, 1500); // optional delay
    } catch (error) {
      toast.error("❌ Failed to assign task");
    }
  };

  const validationSchema = {
    projectValidator: {
      required: { value: true, message: "Project is required" },
    },
    moduleValidator: {
      required: { value: true, message: "Module is required" },
    },
    taskValidator: {
      required: { value: true, message: "Task is required" },
    },
    userValidator: {
      required: { value: true, message: "User is required" },
    },
  };

  return (
    <div className="assign-task-container">
      <div className="assign-task-box">
        <h1 className="assign-task-title">Assign Task to User</h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          {/* Project Dropdown */}
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

          {/* Module Dropdown */}
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

          {/* Task Dropdown */}
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

          {/* User Dropdown */}
          <div className="input-container">
            <label className="input-label">Select User</label>
            <select
              {...register("userId", validationSchema.userValidator)}
              className="input-field"
              disabled={!selectedTaskId}
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

          <button type="submit" className="update-btn">
            Assign Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserTaskDetail;
