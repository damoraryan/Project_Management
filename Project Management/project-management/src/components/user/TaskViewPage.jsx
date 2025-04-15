import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskViewPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const [taskData, setTaskData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [moduleData, setModuleData] = useState(null);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`/users/task/${userId}`);
      const data = response.data.data;

      // Find the specific task using taskId
      const task = data.find((item) => item._id === taskId);
      if (!task) {
        toast.error("Task not found for this user ❌");
        return;
      }

      setTaskData(task);
      setProjectData(task.projectId); // Assuming populated projectId object
      setModuleData(task.moduleId);   // Assuming populated moduleId object
    } catch (error) {
      toast.error("Failed to fetch task details ❌");
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Button variant="contained" onClick={() => navigate("/user/task")}>
        🔙 Back to Tasks
      </Button>

      <Typography variant="h4" gutterBottom style={{ marginTop: "1rem" }}>
        📋 Task Details
      </Typography>

      {taskData && (
        <Card style={{ marginBottom: "20px", backgroundColor: "#f0f8ff" }}>
          <CardContent>
            <Typography variant="h6">📝 Task: {taskData.taskName}</Typography>
            <Typography>Status: {taskData.status}</Typography>
            <Typography>Description: {taskData.description}</Typography>
            <Typography>Deadline: {taskData.deadline}</Typography>
          </CardContent>
        </Card>
      )}

      {projectData && (
        <Card style={{ marginBottom: "20px", backgroundColor: "#fff8e1" }}>
          <CardContent>
            <Typography variant="h6">📁 Project: {projectData.projectName}</Typography>
            <Typography>Description: {projectData.description}</Typography>
            <Typography>Start Date: {projectData.startDate}</Typography>
          </CardContent>
        </Card>
      )}

      {moduleData && (
        <Card style={{ backgroundColor: "#e8f5e9" }}>
          <CardContent>
            <Typography variant="h6">📦 Module: {moduleData.moduleName}</Typography>
            <Typography>Description: {moduleData.description}</Typography>
          </CardContent>
        </Card>
      )}

      <ToastContainer />
    </div>
  );
};

export default TaskViewPage;
