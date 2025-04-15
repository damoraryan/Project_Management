import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/login.css";

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const validationSchema = {
    email: {
      required: { value: true, message: "Email is required" },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: "Invalid email format",
      },
    },
    password: {
      required: { value: true, message: "Password is required" },
      minLength: { value: 6, message: "Password must be at least 6 characters long" },
    },
  };

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/user/login", data);

      if (res.status === 200) {
        toast.dismiss();
        toast.success("Login Success! 🎉", { position: "top-right" });

        const userId = res.data.data._id;
        const userRole = res.data.data.roleId?.name;

        localStorage.setItem("id", userId);
        localStorage.setItem("role", userRole);

        setTimeout(() => {
          if (userRole === "ADMIN") {
            navigate("/admin");
          } else if (userRole === "USER") {
            navigate("/user");
          } else {
            navigate("/login");
          }
        }, 2000);
      }
    } catch (error) {
      toast.dismiss();
      let errorMessage = "Login Failed! ❌";
      if (error.response) {
        errorMessage = error.response.data.message || "Invalid email or password!";
      }
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="brand">
          <div className="brand-logo"></div>
          <h1>LOGIN USER</h1>
          <p>Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="text"
              id="email"
              {...register("email", validationSchema.email)}
              placeholder="Enter email"
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register("password", validationSchema.password)}
              placeholder="Enter password"
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <a href="/forgotpassword" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="social-login">
          <p>Or login with</p>
          <div className="social-buttons">
            <div className="social-btn">G</div>
            <div className="social-btn">F</div>
          </div>
        </div>
        <div className="signup-link">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};
