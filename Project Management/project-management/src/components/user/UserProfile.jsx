import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/profile.css";

const UserProfile = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      bio: "",
      phoneNumber: "",
      address: "",
    },
  });

  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const roleId = localStorage.getItem("role");
      const id = localStorage.getItem("id");

      if (roleId !== "USER") {
        console.error("User role not found in localStorage");
        toast.error("User data not found in localStorage ❌");
        return;
      }

      setUserId(id); // Store userId in state

      const res = await axios.get(`/user/${id}`);
      if (res.data.data) {
        setUser(res.data.data);
        reset(res.data.data); // Populate form fields with fetched data
      } else {
        toast.error("User not found in DB ❌");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Error fetching user data ❌");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [reset]);

  const updateProfile = async (data) => {
    try {
      if (!userId) {
        toast.error("User ID is missing ❌");
        return;
      }

      console.log("Submitting data:", data); // Debugging data sent

      const res = await axios.put(`/user/${userId}`, data);
      if (res.status === 200) {
        toast.success("Profile updated successfully! 🎉");

        // Update local state instead of making another API call
        setUser(data);
        reset(data); // Reset form with updated data
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile ❌");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1 className="profile-title">👤 Your Profile</h1>
        <form onSubmit={handleSubmit(updateProfile)}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              {...register("firstName", { required: "First Name is required" })}
              className="form-input"
            />
            {errors.firstName && <p className="error">{errors.firstName.message}</p>}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              {...register("lastName", { required: "Last Name is required" })}
              className="form-input"
            />
            {errors.lastName && <p className="error">{errors.lastName.message}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
              className="form-input"
              readOnly // Changed from disabled to readOnly
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              {...register("age", {
                required: "Age is required",
                min: { value: 1, message: "Age must be greater than 0" },
              })}
              className="form-input"
            />
            {errors.age && <p className="error">{errors.age.message}</p>}
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea {...register("bio")} rows="3" className="form-input" />
            {errors.bio && <p className="error">{errors.bio.message}</p>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              {...register("phoneNumber", {
                pattern: {
                  value: /^[0-9]{10}$/, // Regex for 10 digits
                  message: "Phone Number must be 10 digits",
                },
              })}
              className="form-input"
            />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber.message}</p>}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea {...register("address")} rows="3" className="form-input" />
            {errors.address && <p className="error">{errors.address.message}</p>}
          </div>

          <button type="submit" className="update-btn">
            Update Profile 🚀
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserProfile;
