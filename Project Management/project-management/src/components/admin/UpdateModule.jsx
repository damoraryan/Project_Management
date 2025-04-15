import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/addprojectmodule.css';

export const UpdateModule = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/module/${id}`)
      .then((res) => {
        const moduleData = res.data.data;

        setProjectName(moduleData.projectId.title || '');

        const formattedDate = moduleData.startDate
          ? new Date(moduleData.startDate).toISOString().split('T')[0]
          : '';

        setStartDate(formattedDate);

        setValue("moduleName", moduleData.moduleName);
        setValue("description", moduleData.description);
        setValue("estimatedHours", moduleData.estimatedHours);
        setValue("startDate", formattedDate);
      })
      .catch(() => {
        toast.error("Failed to fetch module details! ❌");
      });
  }, [id, setValue]);

  const submitHandler = async (data) => {
    try {
      const res = await axios.put(`/module/${id}`, data);

      if (res.status === 200 || res.data.success) {
        toast.success("🎉 Module updated successfully!");
      } else {
        toast.error("⚠️ Something went wrong!");
      }
    } catch {
      toast.error("❌ Error updating module! Try again.");
    }
  };

  return (
    <div className="add-project-module-container">
      <div className="add-project-module-box">
        <h1 className="add-project-module-title">UPDATE PROJECT MODULE</h1>
        <form onSubmit={handleSubmit(submitHandler)}>

          {/* Project Name (Non-editable) */}
          <div className="input-container">
            <label className="input-label">Project Name</label>
            <input 
              type="text" 
              value={projectName} 
              readOnly 
              className="input-field read-only"
            />
          </div>

          <div className="input-container">
            <label className="input-label">Module Name</label>
            <input 
              type="text" 
              {...register("moduleName", { required: "Module name is required" })} 
              className="input-field" 
            />
            {errors.moduleName && <p className="error-message">{errors.moduleName.message}</p>}
          </div>

          <div className="input-container">
            <label className="input-label">Description</label>
            <textarea 
              {...register("description", { required: "Description is required" })} 
              className="textarea-field">
            </textarea>
            {errors.description && <p className="error-message">{errors.description.message}</p>}
          </div>

          <div className="input-container">
            <label className="input-label">Estimated Hours</label>
            <input 
              type="number" 
              {...register("estimatedHours", {
                required: "Estimated hours are required",
                min: { value: 1, message: "Hours must be positive" }
              })} 
              className="input-field" 
            />
            {errors.estimatedHours && <p className="error-message">{errors.estimatedHours.message}</p>}
          </div>

          <div className="input-container">
            <label className="input-label">Start Date</label>
            <input 
              type="date" 
              value={startDate}
              {...register("startDate", { required: "Start date is required" })} 
              className="input-field"
              onChange={(e) => setStartDate(e.target.value)} 
            />
            {errors.startDate && <p className="error-message">{errors.startDate.message}</p>}
          </div>

          <button type="submit" className="update-btn">Update</button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};
