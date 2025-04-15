import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/dashboard.css";

const colors = ["#3f51b5", "#ff9800", "#4caf50", "#f44336", "#e91e63"];

const DashboardChart = () => {
  const [projectData, setProjectData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/projectTeam");

      if (!Array.isArray(response.data.data)) {
        toast.error("Invalid API response format ❌");
        return;
      }

      const projectCount = {};
      response.data.data.forEach((item) => {
        const projectTitle = item.projectId?.title?.trim();
        if (projectTitle) {
          projectCount[projectTitle] = (projectCount[projectTitle] || 0) + 1;
        }
      });

      const formattedData = Object.keys(projectCount).map((title) => ({
        name: title,
        value: projectCount[title],
      }));

      setProjectData(formattedData);
    } catch (error) {
      toast.error("Error fetching project data ❌");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-chart-container">
      <Card className="pie-chart-card">
        <CardContent>
          <Typography variant="h6" align="center" className="chart-title">
            📊 Project vs User Count
          </Typography>
          {projectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {projectData.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography align="center">No data available</Typography>
          )}
        </CardContent>
        <ToastContainer />
      </Card>
    </div>
  );
};

export default DashboardChart;
