import React, { useEffect, useState } from "react";
import axios from "axios";
import { CustomTableUser } from "../common/CustomTableUser";
import { CustomLoader } from "../common/CustomLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/viewprojecttable.css";

export const UserTaskTable = () => {
  const userId = localStorage.getItem("id");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getAllTasks = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`/user/task/${userId}`);
      setTasks(res.data.data || []);
    } catch {
      toast.error("Failed to fetch tasks");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllTasks();
  }, [userId]);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "description", label: "Description" },
  ];

  const userStatusOptions = ["Pending", "In Progress", "Completed"];

  return (
    <div className="project-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {isLoading && (
        <div className="loader-container">
          <CustomLoader />
        </div>
      )}

      <h2 className="project-title">📋 User Task List</h2>

      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!isLoading && tasks.length === 0 && (
        <p className="no-data-message">No tasks found for this user.</p>
      )}

      {filteredTasks.length > 0 && (
        <CustomTableUser
          data={filteredTasks}
          columns={columns}
          onDelete={false}
          showEdit={false}
          viewPath={() => "/user/userdashboard"}
          entityType="task"
          statusOptions={userStatusOptions}
          isUserTable={true}
        />
      )}
    </div>
  );
};
