import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Added
import { CustomTable } from "../common/CustomTable";
import { CustomLoader } from "../common/CustomLoader";
import "../../assets/viewprojecttable.css";

export const ViewProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch All Projects
  const getAllProjects = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/projects");
      setProjects(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch projects"); // ✅ Changed
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  // Delete Project
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
    } catch (err) {
      toast.error("Failed to delete project"); // ✅ Changed
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technology.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "description", label: "Description" },
    { key: "technology", label: "Technology", sortable: true },
    { key: "estimatedHours", label: "Estimated Hours" },
    { key: "startDate", label: "Start Date", type: "date", sortable: true },
    { key: "completionDate", label: "Completion Date", type: "date", sortable: true },
  ];

  return (
    <div className="project-container">
      {isLoading && (
        <div className="loader-container">
          <CustomLoader />
        </div>
      )}

      <h2 className="project-title">📋 MY PROJECTS</h2>

      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search projects..."
            className="search-bar"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <CustomTable
        data={filteredProjects}
        columns={columns}
        onDelete={handleDelete}
        editPath="/admin/updateproject"
        viewPath={(project) => `/admin/viewmoduletable/${project._id}`}
        entityType="project"
        status={true}
        showEdit={true}
      />
    </div>
  );
};
