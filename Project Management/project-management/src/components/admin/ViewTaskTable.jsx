import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Added
import { CustomTable } from "../common/CustomTable";
import { CustomLoader } from "../common/CustomLoader";
import { useParams } from "react-router-dom";
import "../../assets/viewprojecttable.css";

export const ViewTaskTable = () => {
  const { moduleId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getAllTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/tasks/module/${moduleId}`);
      setTasks(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch tasks"); // ✅ Changed
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllTasks();
  }, [moduleId]);

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/task/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      toast.error("Failed to delete task"); // ✅ Changed
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "description", label: "Description" },
    { key: "totalMinutes", label: "Total Minutes", type: "Number", sortable: true },
  ];

  return (
    <div className="project-container">
      {isLoading && (
        <div className="loader-container">
          <CustomLoader />
        </div>
      )}
      <h2 className="project-title">📋 TASK LIST</h2>

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
        <p className="no-data-message">No tasks found for this module.</p>
      )}

      {filteredTasks.length > 0 && (
        <CustomTable
          data={filteredTasks}
          columns={columns}
          onDelete={handleDelete}
          statusType="task"
          status={true}
          editPath="/admin/updatetask"
          viewPath={(task) => `/admin/viewusertable/${task._id}`}
          entityType="task"
        />
      )}
    </div>
  );
};
