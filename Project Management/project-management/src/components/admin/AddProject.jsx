import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/addproject.css";
import { useNavigate } from "react-router-dom"; // ✅ Correct import

export const AddProject = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate(); // ✅ Initialize navigate

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/projects", data);
      toast.success("Project added successfully!");
      reset();
      setTimeout(() => navigate("/admin/viewprojecttable"), 1500); // ✅ Navigate after success
    } catch (error) {
      toast.error("Failed to add project. Try again.");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h1 className="form-title">Add Project</h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" {...register("title", { required: true })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="description" {...register("description", { required: true })}></textarea>
          </div>
          <div className="form-group">
            <label>Technology</label>
            <select {...register("technology", { required: true })}>
              <option value="">Select Technology</option>
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
            <input type="number" {...register("estimatedHours", { required: true })} />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" className="date-input" {...register("startDate", { required: true })} />
          </div>
          <div className="form-group">
            <label>Completion Date</label>
            <input type="date" className="date-input" {...register("completionDate", { required: true })} />
          </div>
          <div>
            <button type="submit" className="update-btn">Add Project</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};
