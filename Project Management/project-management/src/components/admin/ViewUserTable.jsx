import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Added
import { CustomTable } from "../common/CustomTable";
import { CustomLoader } from "../common/CustomLoader";
import { useParams } from "react-router-dom";
import "../../assets/viewprojecttable.css";

export const ViewUserTable = () => {
  const { taskId } = useParams();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getUsersForTask = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/users/task/${taskId}`);
      setUsers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      toast.error("Failed to fetch users for this task"); // ✅ Replaced console
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUsersForTask();
  }, [taskId]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: "firstName", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
  ];

  return (
    <div className="project-container">
      {isLoading && (
        <div className="loader-container">
          <CustomLoader />
        </div>
      )}

      <h2 className="project-title">👥 USERS ASSIGNED TO TASK</h2>

      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search users..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!isLoading && users.length === 0 && (
        <p className="no-data-message">No users assigned to this task.</p>
      )}

      {filteredUsers.length > 0 && (
        <CustomTable
          data={filteredUsers}
          columns={columns}
          editPath="/admin/updateusertask"
          viewPath="/admin/viewuserdetails"
          entityType="user"
          status={true}
        />
      )}
    </div>
  );
};
