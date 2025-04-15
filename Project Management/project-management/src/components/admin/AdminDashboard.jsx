import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/admindashboard.css";
import {
  FaEllipsisV, FaUsers, FaTasks, FaRegCalendarAlt,
  FaProjectDiagram, FaPlus, FaArrowRight, FaEdit, FaTrash
} from "react-icons/fa";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0, completedProjects: 0, ongoingProjects: 0,
    pendingProjects: 0, totalModules: 0, totalTeamMembers: 0, totalTasks: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();

    const closeMenu = () => setMenuOpen(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [projectsRes, modulesRes, teamRes, tasksRes, statusRes] = await Promise.all([
        axios.get("/projects"),
        axios.get("/module"),
        axios.get("/projectTeam"),
        axios.get("/task"),
        axios.get("/status")
      ]);

      const projectData = projectsRes.data.data || [];
      const statusData = statusRes.data.data || [];

      setProjects(projectData);
      const completed = statusData.filter(
        p => p.role === "ADMIN" && p.entityType === "project" && p.statusName === "Completed"
      ).length;
      
      const ongoing = statusData.filter(
        p => p.role === "ADMIN" && p.entityType === "project" && p.statusName === "In Progress"
      ).length;
      
      const pending = statusData.filter(
        p => p.role === "ADMIN" && p.entityType === "project" && (!p.statusName || p.statusName === "Pending")
      ).length;
      
      setStats({
        totalProjects: projectData.length,
        completedProjects: completed,
        ongoingProjects: ongoing,
        pendingProjects: pending,
        totalModules: modulesRes.data.data?.length || 0,
        totalTeamMembers: teamRes.data.data?.length || 0,
        totalTasks: tasksRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (task) => {
    if (!task?.length) return 0;
    const completed = task.filter(t => t.statusName === "Completed").length;
    return Math.round((completed / task.length) * 100);
  };

  const fetchProjectDetails = async (projectId) => {
    try {
      const [modules, team, tasks] = await Promise.all([
        axios.get(`/modules/${projectId}`),
        axios.get(`/project-team/${projectId}`),
        axios.get(`/tasks/project/${projectId}`),
      ]);

      const modulesCount = modules.data?.length || 0;
      const teamCount = team.data?.length || 0;
      const tasksData = tasks.data || [];
      const tasksCount = tasksData.length;
      const progress = calculateProgress(tasksData);

      setProjects(prev =>
        prev.map(p =>
          p._id === projectId
            ? { ...p, modulesCount, teamCount, tasksCount, progress }
            : p
        )
      );
    } catch (err) {
      console.error(`Error fetching project ${projectId} details`, err);
    }
  };

  const toggleMenu = async (e, projectId) => {
    e.stopPropagation();
    const isSame = menuOpen === projectId;
    setMenuOpen(isSame ? null : projectId);
    if (!isSame) await fetchProjectDetails(projectId);
  };

  const handleAddProject = () => navigate("/admin/project");
  const handleEdit = (id) => navigate(`/admin/project/edit/${id}`);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/projects/${id}`);
      fetchDashboardData(); // Refresh
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const projectStatusData = [
    { name: 'Completed', value: stats.completedProjects },
    { name: 'In Progress', value: stats.ongoingProjects },
    { name: 'Pending', value: stats.pendingProjects },
  ];

  const projectTimelineData = projects.slice(0, 5).map(p => {
    const title = p.title.length > 10 ? `${p.title.slice(0, 10)}...` : p.title;
    const start = new Date(p.startDate);
    const end = p.completionDate ? new Date(p.completionDate) : new Date();
    const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return { name: title, duration: durationInDays > 0 ? durationInDays : 1 };
  });

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">

        {/* Header */}
        <div className="dashboard-header">
          <div className="header-title">
            <h2>Admin Dashboard</h2>
            <p>Welcome back to your project management dashboard</p>
          </div>
          <button className="add-project-btn" onClick={handleAddProject}>
            <FaPlus /> <span>New Project</span>
          </button>
        </div>

        {/* Stats */}
        <div className="stats-container">
          {[{
            icon: <FaProjectDiagram />, value: stats.totalProjects, label: "Total Projects", className: "projects"
          }, {
            icon: <FaRegCalendarAlt />, value: stats.totalModules, label: "Total Modules", className: "modules"
          }, {
            icon: <FaUsers />, value: stats.totalTeamMembers, label: "Team Members", className: "team"
          }, {
            icon: <FaTasks />, value: stats.totalTasks, label: "Total Tasks", className: "tasks"
          }].map(({ icon, value, label, className }, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${className}`}>{icon}</div>
              <div className="stat-info">
                <h3>{value}</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="dashboard-charts">
          <div className="chart-card">
            <h3>Project Status</h3>
            <div className="chart-container">
              {projectStatusData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%" cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                      }
                    >
                      {projectStatusData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-chart"><p>No data</p></div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <h3>Project Timeline (Days)</h3>
            <div className="chart-container">
              {projectTimelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={projectTimelineData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="name"
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      minTickGap={10}
                      height={60}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="duration" fill="#6a00f4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-chart"><p>No timeline data</p></div>
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="projects-section">
          <div className="section-header">
            <h3>Projects</h3>
            <button className="view-all-btn" onClick={() => navigate('/admin/viewprojecttable')}>
              View All <FaArrowRight className="btn-icon" />
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="empty-projects">
              <p>No projects available</p>
              <button className="create-project-btn" onClick={handleAddProject}>
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="project-grid">
              {projects.map(project => {
                const { _id, title, technology, startDate, statusName, progress = 0, modulesCount = 0, teamCount = 0, tasksCount = 0 } = project;

                return (
                  <div key={_id} className="project-box">
                    <div className={`status-indicator ${statusName?.toLowerCase() || 'pending'}`}></div>
                    <h4>{title}</h4>
                    <p className="project-tech"><span>Tech Stack:</span> {technology || 'N/A'}</p>
                    <p className="project-date"><span>Started:</span> {startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}</p>
                    <p className="project-status"><span>Status:</span> {statusName || 'Pending'}</p>

                    <div className="project-metrics">
                      <p><span>Modules:</span> {modulesCount}</p>
                      <p><span>Team:</span> {teamCount}</p>
                      <p><span>Tasks:</span> {tasksCount}</p>
                    </div>

                    <div className="progress-container">
                      <div className="progress-label">
                        <span>Progress</span><span>{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    <div className="menu-container">
                      <FaEllipsisV className="menu-icon" onClick={(e) => toggleMenu(e, _id)} />
                      {menuOpen === _id && (
                        <div className="menu-dropdown">
                          <div onClick={() => handleEdit(_id)}><FaEdit /> Edit</div>
                          <div onClick={() => handleDelete(_id)}><FaTrash /> Delete</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
