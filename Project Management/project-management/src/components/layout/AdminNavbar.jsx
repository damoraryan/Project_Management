import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/usernavbar.css";

const AdminNavbar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHover, setIsHover] = useState(false); // 👈 For Profile Hover Box
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // 👤 Fetch User Data from Local Storage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🚪 Logout Handler
  const handleLogout = () => {
    // 🗑️ Remove Data from Local Storage
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");

    // 🎉 Toastify Notification
    toast.success("Logout Successful! 🎯", {
      position: "top-right",
      autoClose: 2000,
    });

    // ⏰ Redirect after 2 seconds
    setTimeout(() => {
      navigate("/login"); // 🔥 Back to Login Page
    }, 2000);
  };

  return (
    <>
      <nav className="user-navbar">
        <div className="logo-user" onClick={() => navigate("/")}>
          Project Management
        </div>

        <div className="nav-icons-user">
          {/* 🔔 Notification Dropdown */}
          <div className="icon-wrapper" ref={notifRef}>
            <FaBell
              className="icon-user"
              onClick={() => setIsNotifOpen((prev) => !prev)}
            />
            {isNotifOpen && (
              <div className="dropdown-menu show">
                <p onClick={() => alert("No new notifications 📢")}>
                  🔔 Check Notifications
                </p>
              </div>
            )}
          </div>

          {/* 👤 Profile Dropdown */}
          <div
            className="icon-wrapper"
            ref={profileRef}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <FaUserCircle
              className="icon-user profile-icon-user"
              onClick={() => setIsProfileOpen((prev) => !prev)}
            />
            
            {isProfileOpen && (
              <div className="dropdown-menu show">
                <p onClick={() => navigate("/admin/adminprofileview")}>👤 View Profile</p>
                <p onClick={handleLogout}>🚪 Logout</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🥳 Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminNavbar;
