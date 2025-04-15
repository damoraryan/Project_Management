import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CustomTable } from "../common/CustomTable";
import { CustomLoader } from "../common/CustomLoader";
import { toast } from "react-toastify"; // ✅ Added
import "../../assets/viewprojecttable.css";

export const ViewModuleTable = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Modules for Selected Project
  const getModules = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/modules/${projectId}`);
      setModules(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch modules"); // ✅ Changed from console
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getModules();
  }, [projectId]);

  // Delete Module
  const handleDelete = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await axios.delete(`/module/${moduleId}`);
      setModules((prev) => prev.filter((module) => module._id !== moduleId));
    } catch (err) {
      toast.error("Failed to delete module"); // ✅ Changed from console
    }
  };

  const filteredModules = modules.filter((module) =>
    module.moduleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "moduleName", label: "Module Name", sortable: true },
    { key: "description", label: "Description" },
    { key: "estimatedHours", label: "Estimated Hours" },
    { key: "startDate", label: "Start Date", type: "date", sortable: true },
  ];

  return (
    <div className="project-container">
      {isLoading && (
        <div className="loader-container">
          <CustomLoader />
        </div>
      )}
      <h2 className="project-title">📌 PROJECT MODULES</h2>

      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search modules..."
            className="search-bar"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <CustomTable
        data={filteredModules}
        columns={columns}
        onDelete={handleDelete}
        editPath="/admin/updatemodule"
        viewPath="/admin/task"
        entityType="projectModule"
        status={true}
      />
    </div>
  );
};
