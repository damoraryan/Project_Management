import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../../assets/forgotpassword.css";  // Ensure this is imported

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/user/forgotpassword", data);
      if (res.status === 200) {
        toast.dismiss(); // remove any existing toast
        toast.success("Password reset link sent to your email!", { position: "top-right" });
      }
    } catch (error) {
      toast.dismiss(); // remove any existing toast
      toast.error(error.response?.data?.message || "Failed to send reset link!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <ToastContainer />
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <form className="forgot-password-form" onSubmit={handleSubmit(submitHandler)}>
          <div className="forgot-password-field">
            <label className="forgot-password-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="forgot-password-input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format"
                }
              })}
            />
            {errors.email && <p className="forgot-password-error">{errors.email.message}</p>}
          </div>
          <button type="submit" className="forgot-password-submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <button className="forgot-password-back" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </div>
    </div>
  );
};
