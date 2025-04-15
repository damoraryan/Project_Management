import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ResetPassword = () => {
  const token = useParams().token;
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (data) => {
    try {
      const obj = {
        token: token,
        password: data.password,
      };

      const res = await axios.post('/user/resetpassword', obj);

      if (res.status === 200) {
        toast.dismiss();
        toast.success("Password Reset Successful! ✅", { position: "top-right" });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      toast.dismiss();
      let errMsg = "Something went wrong!";
      if (error.response) {
        errMsg = error.response.data.message || errMsg;
      }
      toast.error(errMsg, { position: "top-right" });
    }
  };

  return (
    <div className="reset-password">
      <h1>RESET PASSWORD</h1>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>
        <button type="submit" className="submit-btn">Reset Password</button>
      </form>
      <ToastContainer />
    </div>
  );
};
