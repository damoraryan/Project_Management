import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const validationSchema = {
    firstName: {
      required: { value: true, message: "First Name is required" },
    },
    lastName: {
      required: { value: true, message: "Last Name is required" },
    },
    email: {
      required: { value: true, message: "Email is required" },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: "Invalid email format",
      },
    },
    password: {
      required: { value: true, message: "Password is required" },
      minLength: { value: 6, message: "Password must be at least 6 characters" },
      maxLength: { value: 20, message: "Password cannot exceed 20 characters" },
    },
    age: {
      required: { value: true, message: "Age is required" },
      min: { value: 18, message: "You must be at least 18 years old" },
    },
  };

  const submitHandler = async (data) => {
    try {
      toast.dismiss(); // Clear any existing toasts

      data.roleId = "67c527b058f3cf0b8ca7af11";
      const res = await axios.post("/user/signup", data);

      if (res.status === 201) {
        toast.success("User created successfully! 🎉", { position: "top-right" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("User not created! ❌", { position: "top-right" });
      }
    } catch (error) {
      toast.dismiss();
      const errMsg = error.response?.data?.message || "Signup Failed! 💥";
      toast.error(errMsg, { position: "top-right" });
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="brand">
          <div className="brand-logo"></div>
          <h1>CREATE ACCOUNT</h1>
          <p>Sign up to get started</p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" {...register("firstName", validationSchema.firstName)} placeholder="Enter first name" />
            {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" {...register("lastName", validationSchema.lastName)} placeholder="Enter last name" />
            {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" {...register("email", validationSchema.email)} placeholder="Enter email" />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" {...register("password", validationSchema.password)} placeholder="Enter password" />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input type="number" id="age" {...register("age", validationSchema.age)} placeholder="Enter age" />
            {errors.age && <p className="error-text">{errors.age.message}</p>}
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <div className="signup-link">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};
