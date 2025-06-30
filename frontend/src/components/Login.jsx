import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/Login.css';

export default function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post("http://localhost:3000/api/user/login", formData)
      if (data.success) {
        localStorage.setItem('userId', data.user.id)
        alert(data.message)
        navigate("/home")
      } 
      else {
        alert(data.message)
      }
    } 
    catch (error) {
      alert(error.response?.data?.message || "Something went wrong while login!")
      setFormData({ email: '', password: '' })
    }

    setFormData({ email: '', password: '' })
  }

  return (
    <>
      <div className="left-pane">
        <div className="left-overlay">
          <div className="left-text">
            <h1>Welcome Back to SkillHatch</h1>
            <p>Log in to continue your learning or mentoring journey with our vibrant community.</p>
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
          <h2>Log In</h2>
          <p>Access your SkillHatch account</p>

          <form onSubmit={handleSubmit}>
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
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
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
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="button">
              Log In
            </button>
          </form>

          <p className="footer-text">
            Don’t have an account?{' '}
            <button className="link-button" onClick={() => navigate('/')}>
              Register
            </button>
          </p>
        </div>
      </div>
    </>
  );
}