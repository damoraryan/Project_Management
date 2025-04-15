import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";

import PrivateRoutes from "./hooks/PrivateRoutes";
import UserSidebar from "./components/layout/UserSidebar";
import AdminSidebar from "./components/layout/AdminSidebar";
import { Login } from "./components/common/Login";
import { Signup } from "./components/common/Signup";
import { ForgotPassword } from "./components/common/ForgotPassword";
import NotFound from "./components/common/NotFound";

import Home from "./components/home/Home";

import UserProfile from "./components/user/UserProfile";

import AdminDashboard from "./components/admin/AdminDashboard";
import { AddProject } from "./components/admin/AddProject";
import UpdateProject from "./components/admin/UpdateProject";
import { AddProjectModule } from "./components/admin/AddProjectModule";
import { AddProjectTeam } from "./components/admin/AddProjectTeam";

import { AddTask } from "./components/admin/AddTask";
import { CustomTable } from "./components/common/CustomTable";
import { ViewProjectTable } from "./components/admin/ViewProjectTable";
import { ViewModuleTable } from "./components/admin/ViewModuleTable";
import { ViewTaskTable } from "./components/admin/ViewTaskTable";
import { ViewUserTable } from "./components/admin/ViewUserTable";
import UserTaskDetail from "./components/admin/UserTaskDetail";
import UserDashboard from "./components/user/UserDashBoard";

import AdminProfile from "./components/admin/AdminProfile";
import AdminProfileView from "./components/admin/AdminProfileView";
import DashboardChart from "./components/admin/DashboardChart";
import { UserTaskTable } from "./components/user/UserTaskTable";
import Unauthorized from "./components/common/Unauthorized";
import { UpdateModule } from "./components/admin/UpdateModule";
import { UpdateTask } from "./components/admin/UpdateTask";
import UpdateUserTask from "./components/admin/UpdateUserTask";
import { CustomTableUser } from "./components/common/CustomTableUser";
import UserProfileView from "./components/user/UserProfileView";
import TaskViewPage from "./components/user/TaskViewPage";


function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      document.body.className = "";
    } else {
      document.body.className =
        "layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded";
    }
  }, [location.pathname]);

  return (
    <div className={location.pathname === "/login" || location.pathname === "/signup" ? "" : "app-wrapper"}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized/>}></Route>

        {/* Protected Routes */}
        <Route element={<PrivateRoutes allowedRoles={["USER"]} />}>
          <Route path="/user" element={<UserSidebar />}>
            <Route index element={<UserDashboard />} />
            <Route path="userdashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="tasktable" element={<UserTaskTable />} />
            <Route path="chart" element={<DashboardChart />} />
            <Route path="customusertable" element={<CustomTableUser/>}></Route>
            <Route path="userprofile" element={<UserProfileView/>}></Route>
            <Route path="taskview" element={<TaskViewPage/>}></Route>
          </Route>
        </Route>

        <Route element={<PrivateRoutes allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminSidebar />}>
            <Route index element={<AdminDashboard />} />
            <Route path="admindashboard" element={<AdminDashboard />} />
            <Route path="project" element={<AddProject />} />
            <Route path="updateproject/:id" element={<UpdateProject />} />
            <Route path="updatemodule/:id" element={<UpdateModule/>}></Route>
            <Route path="updatetask/:id" element={<UpdateTask/>}></Route>
            <Route path="updateusertask/:id" element={<UpdateUserTask/>}></Route>
            <Route path="projectmodule" element={<AddProjectModule />} />
            <Route path="projectteam" element={<AddProjectTeam />} />
            <Route path="task" element={<AddTask />} />
            <Route path="viewprojecttable" element={<ViewProjectTable />} />
            <Route path="viewmoduletable/:projectId" element={<ViewModuleTable />} />
            <Route path="task/:moduleId" element={<ViewTaskTable />} />
            <Route path="viewusertable/:taskId" element={<ViewUserTable />} />
            <Route path="adminprofile" element={<AdminProfile />} />
            <Route path="adminprofileview" element={<AdminProfileView/>}></Route>
            <Route path="usertask" element={<UserTaskDetail />} />
            <Route path="customtable" element={<CustomTable />} />
          
          </Route>
        </Route>

      </Routes>
    </div>
  );
}

export default App;
