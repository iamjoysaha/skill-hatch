import axios from "axios"
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { v4 as uuid4 } from 'uuid'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Registration() {
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
    Cookies.remove('token')
    setFormData((prev) => ({ ...prev, socket_id: uuid4() }))
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      return toast.error("Passwords do not match!")
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/create`, formData)

      if (data.success) {
        toast.success(data.message)
        navigate("/user/login")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while registering!")
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 min-h-[300px] bg-cover bg-center relative" style={{ backgroundImage: `url(https://instaily.com/_next/static/media/test.b3910688.jpg)` }}>
        <div className="absolute inset-0 bg-[#2e2b5f]/70 flex items-center justify-center p-6">
          <div className="text-center text-white max-w-md animate-fadeIn">
            <h1 className="text-3xl font-bold mb-4">Welcome to SkillHatch</h1>
            <p>Join our community of learners and mentors to unlock your potential and share knowledge.</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-neutral px-6 py-12">
        <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg animate-slideUp">
          <div className="flex justify-center mb-6">
            <img
              src="https://instaily.com/_next/static/media/test.b3910688.jpg"
              alt="SkillHatch Logo"
              className="h-20 rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold text-center text-primary mb-1">Create Your Account</h2>
          <p className="text-center text-sm text-secondary mb-6">Start your learning or mentoring journey today!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Account Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="account_type"
                    value="student"
                    checked={formData.account_type === "student"}
                    onChange={handleChange}
                    required
                  />
                  <span className="text-sm">Student</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="account_type"
                    value="mentor"
                    checked={formData.account_type === "mentor"}
                    onChange={handleChange}
                    required
                  />
                  <span className="text-sm">Mentor</span>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-3 border rounded-md text-sm" placeholder="First name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-3 border rounded-md text-sm" placeholder="Last name" required />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-3 border rounded-md text-sm" placeholder="Username" required />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-md text-sm" placeholder="Email address" required />
            </div>

            {/* College Name */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">College Name</label>
              <input type="text" name="college_name" value={formData.college_name} onChange={handleChange} className="w-full p-3 border rounded-md text-sm" placeholder="Enter College Name" required />
            </div>

            {/* Roll No (for Student) */}
            {formData.account_type === "student" && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Roll No</label>
                <input type="text" name="roll_no" value={formData.roll_no} onChange={handleChange} className="w-full p-3 border rounded-md text-sm" placeholder="Enter Roll No" required />
              </div>
            )}

            {/* Expertise (for Mentor) */}
            {formData.account_type === "mentor" && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Expertise</label>
                <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} className="w-full p-3 border rounded-md text-sm" placeholder="e.g., Web Development" required />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-secondary mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-md text-sm"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-[#2e2b5f]"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-secondary mb-1">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full p-3 border rounded-md text-sm"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-[#2e2b5f]"
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#f4c150] text-[#2e2b5f] font-semibold py-2.5 rounded-md hover:bg-yellow-400 transition transform hover:-translate-y-1 text-sm"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-secondary mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate("/user/login")}
              className="text-[#f4c150] hover:text-yellow-400 font-medium underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
