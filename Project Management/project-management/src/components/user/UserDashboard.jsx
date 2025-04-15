import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaTasks,
  FaRegCalendarAlt,
  FaClock,
  FaProjectDiagram,
  FaEye,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import "../../assets/userdashboard.css";

const COLORS = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#22D3EE", // Cyan
];

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("id");

      if (!userId) {
        toast.error("User ID not found in local storage");
        return;
      }

      const res = await axios.get(`/user/task/${userId}`);
      const taskData = res.data.data || [];

      const completed = taskData.filter((t) => t.status === "Completed").length;
      const inProgress = taskData.filter((t) => t.status === "In Progress").length;
      const pending = taskData.filter((t) => t.status === "Pending" || !t.status).length;

      const tasksWithTime = taskData.map((t) => ({
        ...t,
        minutesSpent: t.totalMinutes || 0,
      }));

      setTasks(tasksWithTime);
      setStats({
        totalTasks: taskData.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        pendingTasks: pending,
      });
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to fetch tasks. Please try again later.");
      setTasks([]);
      setStats({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="user-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-header">
        <h2>My Dashboard</h2>
        <p>Welcome to your task management dashboard</p>
      </div>

      {/* Stats Section */}
      <div className="user-stats-container">
        <div className="user-stat-card">
          <div className="user-stat-icon total"><FaTasks /></div>
          <div className="user-stat-info">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="user-stat-icon completed"><FaRegCalendarAlt /></div>
          <div className="user-stat-info">
            <h3>{stats.completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="user-stat-icon progress"><FaClock /></div>
          <div className="user-stat-info">
            <h3>{stats.inProgressTasks}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="user-stat-card">
          <div className="user-stat-icon pending"><FaProjectDiagram /></div>
          <div className="user-stat-info">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="user-chart-container">
        <h3>⏱️ Time Spent Per Task (in minutes)</h3>
        {tasks.length > 0 ? (
          <div className="user-chart">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tasks.map((task) => ({
                    name: task.title,
                    value: task.minutesSpent,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {tasks.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="user-empty-chart">
            <p>No task time data to display</p>
          </div>
        )}
      </div>

      {/* Task Preview */}
      <div className="user-projects-section">
        <div className="user-section-header">
          <h3>My Tasks</h3>
          <button className="user-view-all" onClick={() => navigate(`/user/tasktable`)}>
            View All <FaEye />
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="user-empty-projects">
            <p>You don't have any tasks assigned yet</p>
          </div>
        ) : (
          <div className="user-project-grid">
            {tasks.slice(0, 4).map((task) => (
              <div key={task._id} className="user-project-card">
                <div
                  className={`user-project-status ${task.status?.toLowerCase().replace(/\s+/g, "") || "pending"}`}
                >
                  {task.status || "Pending"}
                </div>
                <h4>{task.title}</h4>
                <p className="user-project-priority"><strong>Priority:</strong> {task.priority}</p>
                <p className="user-project-time"><strong>Total Time:</strong> {task.totalMinutes} minutes</p>
                <p className="user-project-description"><strong>Description:</strong> {task.description}</p>
                <button
                  className="user-view-details"
                  onClick={() => navigate(`/user/tasktable`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
