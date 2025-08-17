import axios from "axios"
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
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
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    Cookies.remove('token')
    setFormData((prev) => ({ ...prev }))
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      return toast.error("Passwords do not match!")
    }

    const payload = { ...formData }
    if (formData.account_type === "student") {
      delete payload.expertise
    } else {
      delete payload.roll_no
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/create`, payload)

      if (data.success) {
        toast.success(data.message)
        navigate("/user/login")
      } else {
        toast.error(data.message)
      }
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while registering!")
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Side */}
      <div
        className="w-full lg:w-1/2 min-h-[300px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(https://instaily.com/_next/static/media/test.b3910688.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/80 flex items-center justify-center p-6">
          <div className="text-center text-white max-w-md animate-fadeIn">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Welcome to SkillHatch</h1>
            <p className="text-lg leading-relaxed">Join our vibrant community to unlock your potential and share knowledge.</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl animate-slideUp border border-gray-100">
          <div className="flex justify-center mb-6">
            <img src="https://instaily.com/_next/static/media/test.b3910688.jpg" alt="SkillHatch Logo" className="h-28 rounded-full object-cover border-4 border-gray-100 shadow-md"
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-center text-sm text-gray-500 mb-8">Start your learning or mentoring journey today!</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="account_type"
                    value="student"
                    checked={formData.account_type === "student"}
                    onChange={handleChange}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                    required
                  />
                  <span className="text-sm text-gray-700">Student</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="account_type"
                    value="mentor"
                    checked={formData.account_type === "mentor"}
                    onChange={handleChange}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                    required
                  />
                  <span className="text-sm text-gray-700">Mentor</span>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Username"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Email address"
                required
              />
            </div>

            {/* College Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">College Name</label>
              <input
                type="text"
                name="college_name"
                value={formData.college_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Enter College Name"
                required
              />
            </div>

            {/* Roll No (for Student) */}
            {formData.account_type === "student" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Roll No</label>
                <input
                  type="text"
                  name="roll_no"
                  value={formData.roll_no}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  placeholder="Enter Roll No"
                  required
                />
              </div>
            )}

            {/* Expertise (for Mentor) */}
            {formData.account_type === "mentor" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expertise</label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  placeholder="e.g., Web Development"
                  required
                />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-900 transition"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-900 transition"
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800 font-semibold py-3 rounded-lg transition transform hover:-translate-y-1 shadow-md text-sm"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <button
              onClick={() => navigate("/user/login")}
              className="text-amber-500 hover:text-amber-600 font-semibold underline transition"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}