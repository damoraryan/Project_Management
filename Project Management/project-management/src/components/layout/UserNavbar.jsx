import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/usernavbar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserNavbar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // 🔔 Toggle Notification Dropdown
  const toggleNotificationDropdown = () => {
    setIsNotifOpen((prev) => !prev);
    setIsProfileOpen(false); // Close profile if open
  };

  // 👤 Toggle Profile Dropdown
  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotifOpen(false); // Close notifications if open
  };

  // 📡 Close dropdowns on outside click
  const handleClickOutside = (event) => {
    if (
      notifRef.current &&
      !notifRef.current.contains(event.target) &&
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setIsNotifOpen(false);
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🚪 Logout Handler with Toastify
  const handleLogout = () => {
    toast.success("✅ Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    // ⚡ Clear Local Storage (Optional)
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    // ⏩ Redirect to Login Page after 2 sec
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <>
      <nav className="user-navbar">
        <div className="logo-user">Project Management</div>

        <div className="nav-icons-user">
          {/* 🔔 Notification Icon */}
          <div className="icon-wrapper" ref={notifRef}>
            <FaBell className="icon-user" onClick={toggleNotificationDropdown} />
            {isNotifOpen && (
              <div className="dropdown-menu show">
                <p>No New Notifications</p>
              </div>
            )}
          </div>

          {/* 👤 Profile Icon */}
          <div className="icon-wrapper" ref={profileRef}>
            <FaUserCircle
              className="icon-user profile-icon-user"
              onClick={toggleProfileDropdown}
            />
            {isProfileOpen && (
              <div className="dropdown-menu show">
                <p onClick={() => navigate("/user/userprofile")}>👤 View Profile</p>
                <p onClick={handleLogout}>🚪 Logout</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Toastify Container */}
      <ToastContainer />
    </>
  );
};

export default UserNavbar;
