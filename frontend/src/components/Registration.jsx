import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import "./styles/Registration.css"

export default function Registration({ socket, socketId }) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    account_type: "student",
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    roll_no: "",
    expertise: "",
    college_name: "",
    socket_id: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, socket_id: socketId }))
  }, [socketId])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirm_password) {
      return alert("Passwords do not match!")
    }

    try {
      const { data } = await axios.post("http://localhost:3000/api/user/create", formData)

      if (data.success) {
        alert(data.message)
        navigate("/login")
      } 
      else {
        alert(data.message)
      }
    } 
    catch (error) {
      alert(error.response?.data?.message || "Something went wrong while registering!")
      setFormData({
        account_type: "student",
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        roll_no: "",
        expertise: "",
        college_name: "",
        socket_id: socketId,
      })
    }

    setFormData({
      account_type: "student",
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      roll_no: "",
      expertise: "",
      college_name: "",
      socket_id: socketId,
    })
  }

  return (
    <>
      <div className="left-pane">
        <div className="left-overlay">
          <div className="left-text">
            <h1>Welcome to SkillHatch</h1>
            <p>
              Join our community of learners and mentors to unlock your
              potential and share knowledge.
            </p>
          </div>
        </div>
      </div>

      <div className="right-pane">
        <div className="form-container">
          <div className="logo">
            <img
              src="https://instaily.com/_next/static/media/test.b3910688.jpg"
              alt="SkillHatch Logo"
              className="logo"
            />
          </div>
          <h2>Create Your Account</h2>
          <p>Start your learning or mentoring journey today!</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Account Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="account_type"
                    value="student"
                    checked={formData.account_type === "student"}
                    onChange={handleChange}
                    required
                  />
                  Student
                </label>
                <label>
                  <input
                    type="radio"
                    name="account_type"
                    value="mentor"
                    checked={formData.account_type === "mentor"}
                    onChange={handleChange}
                    required
                  />
                  Mentor
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">College Name</label>
              <input
                type="text"
                name="college_name"
                value={formData.college_name}
                onChange={handleChange}
                placeholder="Enter College Name"
                className="input"
                required
              />
            </div>

            {formData.account_type === "student" && (
              <div className="form-group">
                <label className="label">Roll No</label>
                <input
                  type="text"
                  name="roll_no"
                  value={formData.roll_no}
                  onChange={handleChange}
                  placeholder="Enter Roll No"
                  className="input"
                  required
                />
              </div>
            )}

            {formData.account_type === "mentor" && (
              <div className="form-group">
                <label className="label">Expertise</label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="e.g., Web Development"
                  className="input"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={`fas ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            <button type="submit" className="button">
              Register
            </button>
          </form>

          <p className="footer-text">
            Already have an account?{" "}
            <button className="link-button" onClick={() => navigate("/login")}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
