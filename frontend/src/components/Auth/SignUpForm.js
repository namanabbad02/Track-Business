import React, { useState } from "react";
import "./AuthForm.css"; // Add CSS for styling

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    userMail: "",
    companyName: "",
    companyMail: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.userName.match(/^[a-zA-Z0-9_]+$/))
      newErrors.userName = "User Name must be alphanumeric.";
    if (!formData.userMail.match(/^\S+@\S+\.\S+$/))
      newErrors.userMail = "Enter a valid email address.";
    if (!formData.companyName) newErrors.companyName = "Company Name is required.";
    if (!formData.companyMail.match(/^\S+@\S+\.\S+$/))
      newErrors.companyMail = "Enter a valid company email.";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Sign-Up Successful!", formData);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <small>{errors.name}</small>}
        </div>
        <div className="form-group">
          <label>User Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className={errors.userName ? "error" : ""}
          />
          {errors.userName && <small>{errors.userName}</small>}
        </div>
        <div className="form-group">
          <label>User Email</label>
          <input
            type="email"
            name="userMail"
            value={formData.userMail}
            onChange={handleChange}
            className={errors.userMail ? "error" : ""}
          />
          {errors.userMail && <small>{errors.userMail}</small>}
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className={errors.companyName ? "error" : ""}
          />
          {errors.companyName && <small>{errors.companyName}</small>}
        </div>
        <div className="form-group">
          <label>Company Email</label>
          <input
            type="email"
            name="companyMail"
            value={formData.companyMail}
            onChange={handleChange}
            className={errors.companyMail ? "error" : ""}
          />
          {errors.companyMail && <small>{errors.companyMail}</small>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <small>{errors.password}</small>}
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""}
          />
          {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
