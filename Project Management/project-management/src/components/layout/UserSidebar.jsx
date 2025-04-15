import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/usersidebar.css";
import UserNavbar from "./UserNavbar";

const UserSidebar = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const navigate = useNavigate();

  // 🔥 Logout Logic with Toastify
  const handleLogout = () => {
    // 🗑️ Clear Local Storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // 🎉 Show Toastify Notification
    toast.success("Logout Successful! 🚪", {
      position: "top-right",
      autoClose: 2000,
    });

    // ⏰ Redirect to Login after 2 seconds
    setTimeout(() => {
      navigate("/login"); // 🔥 Redirect to Login
    }, 2000);
  };

  // 🚀 Updated Sidebar Buttons
  const menuItems = [
    { name: "Dashboard", path: "/user/userdashboard" },
    { name: "Profile", path: "/user/profile" },
    // { name: "Reports & Analytics", path: "/user/chart" },
    { name: "TaskTable", path: "/user/tasktable" },

    { name: "Logout", path: "/logout" }, // 🚪 Logout Included
  ];

  return (
    <>
      {/* 🟣 Navbar */}
      <UserNavbar />

      {/* 🟡 Sidebar */}
      <aside className="user-sidebar">
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`sidebar-item ${
                activeSection === item.name ? "active" : ""
              }`}
              onClick={() => {
                if (item.name === "Logout") {
                  handleLogout(); // 🚪 Call Logout
                } else {
                  setActiveSection(item.name);
                  navigate(item.path);
                }
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </aside>

      {/* ✅ Main Content Area */}
      <main className="app-main">
        <Outlet />
      </main>

      {/* 🎉 Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default UserSidebar;
