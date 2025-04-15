import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/updateproject.css"; // Same CSS as Add Project
import { CustomLoader } from "../common/CustomLoader";

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectDetails();
  }, []);

  const getProjectDetails = async () => {
    try {
      const res = await axios.get(`/projects/${id}`);
      if (res.status === 200) {
        const project = res.data.data;

        if (project.startDate) {
          setValue(
            "startDate",
            new Date(project.startDate).toISOString().split("T")[0]
          );
        }
        if (project.completionDate) {
          setValue(
            "completionDate",
            new Date(project.completionDate).toISOString().split("T")[0]
          );
        }

        Object.keys(project).forEach((key) => {
          if (key !== "startDate" && key !== "completionDate") {
            setValue(key, project[key]);
          }
        });

        setLoading(false);
      }
    } catch (error) {
      toast.error("Error fetching project details!");
    }
  };

  const submitHandler = async (data) => {
    try {
      const res = await axios.put(`/updateProject/${id}`, data);
      if (res.status === 200) {
        toast.success("Project Updated Successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate(`/admin/viewprojecttable`);
        }, 2000);
      }
    } catch (error) {
      toast.error("Error updating project!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate(`/user/viewproject`);
      }, 2000);
    }
  };

  if (loading) {
    return <h3 className="loading-text">Loading project details...</h3>;
  }

  return (
    <div className="project-container">
      {loading && (
        <div className="loader-container">
          <CustomLoader />
        </div>
      )}
      <div className="form-card">
        <h2 className="form-title">Update Project</h2>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-input"
              {...register("title")}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input"
              rows="4"
              {...register("description")}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Technology</label>
            <select className="form-input" {...register("technology")}>
              <option value="MERN">MERN</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="PHP">PHP</option>
              <option value="Laravel">Laravel</option>
              <option value="Flutter">Flutter</option>
            </select>
          </div>

          <div className="form-group">
            <label>Estimated Hours</label>
            <input
              type="number"
              className="form-input"
              {...register("estimatedHours")}
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              className="form-input"
              {...register("startDate")}
            />
          </div>

          <div className="form-group">
            <label>Completion Date</label>
            <input
              type="date"
              className="form-input"
              {...register("completionDate")}
            />
          </div>

          <button type="submit" className="update-btn">
            Update Project
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateProject;
