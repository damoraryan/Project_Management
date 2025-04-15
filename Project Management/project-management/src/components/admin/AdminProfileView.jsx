import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/adminprofileview.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminProfileView = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // To handle navigation

  const fetchUserProfile = async () => {
    try {
      const roleId = localStorage.getItem("role");
      const id = localStorage.getItem("id");

      if (roleId !== "ADMIN") {
        toast.error("Admin data not found in localStorage ❌");
        return;
      }

      const res = await axios.get(`/user/${id}`);
      if (res.data.data) {
        setUser(res.data.data);
      } else {
        toast.error("User not found in DB ❌");
      }
    } catch (err) {
      toast.error("Error fetching user data ❌");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="admin-profile-wrapper">
      <div className="admin-profile-container">
        <h1 className="admin-profile-title">👤 Admin Profile</h1>
        {/* Back Button */}
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "20px" }}
          onClick={() => navigate("/admin/adminprofile")} // Navigate to the profile page
        >
          Back to Profile
        </Button>

        {user ? (
          <div className="admin-profile-details">
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Bio:</strong> {user.bio || "N/A"}</p>
            <p><strong>Phone Number:</strong> {user.phoneNumber || "N/A"}</p>
            <p><strong>Address:</strong> {user.address || "N/A"}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminProfileView;
