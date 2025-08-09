import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', phone: '', password: '' })
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotForm, setShowForgotForm] = useState(false)
  const [showOtpCard, setShowOtpCard] = useState(false)

  useEffect(() => {
    Cookies.remove('token')
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, { email: formData.email, password: formData.password }, { withCredentials: true })
      
      if (data.success) {
        localStorage.setItem('userId', data.user.id)
        toast.success(data.message)

        if(data.user.account_type === 'student') {
          navigate('/user/home')
        }
        else if(data.user.account_type === 'mentor') {
          navigate('/admin/dashboard')
        }
      }
    } 
    catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!')
    }

    setFormData({ ...formData, password: '' })
  }

  const handleSendOtp = async () => {
    if (!formData.email || !formData.phone) {
      return toast.error('Enter both email and phone!')
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/verify/send-otp`,
        { email: formData.email, phone: formData.phone }
      )
      toast.success(data.message)
      setShowOtpCard(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/verify/verify-otp`,
        { email: formData.email, otp },
        { withCredentials: true }
      )

      if (data.success) {
        localStorage.setItem('userId', data.user.id)

        toast.success(data.message)
        navigate('/user/home')
      } 
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Pane */}
      <div
        className="w-full lg:w-1/2 min-h-[300px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(https://instaily.com/_next/static/media/test.b3910688.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/80 flex items-center justify-center p-6">
          <div className="text-center text-white max-w-md animate-fadeIn">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Welcome Back to SkillHatch</h1>
            <p className="text-lg leading-relaxed">Join our vibrant community to continue your learning or mentoring journey.</p>
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl animate-slideUp border border-gray-100">
          <div className="flex justify-center mb-6">
            <img
              src="https://instaily.com/_next/static/media/test.b3910688.jpg"
              alt="SkillHatch Logo"
              className="h-28 rounded-full object-cover border-4 border-gray-100 shadow-md"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Log In</h2>
          <p className="text-center text-sm text-gray-500 mb-8">Access your SkillHatch account</p>

          {/* Login Form */}
          {!showForgotForm && (
            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  required
                />
              </div>

              <div className="mb-6 relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-3 border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-900 transition"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white hover:bg-gray-800 font-semibold py-3 rounded-lg transition transform hover:-translate-y-1 shadow-md text-sm"
              >
                Log In
              </button>
            </form>
          )}

          {/* Forgot Password Card */}
          {showForgotForm && !showOtpCard && (
            <div className="mt-6">
              <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">Forgot Password</h3>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 mb-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 mb-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
              />
              <button
                onClick={handleSendOtp}
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition transform hover:-translate-y-1 shadow-md text-sm"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* OTP Verification Card */}
          {showOtpCard && (
            <div className="mt-6">
              <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">Enter OTP</h3>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 mb-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition transform hover:-translate-y-1 shadow-md text-sm"
              >
                Verify & Log In
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>
              Don’t have an account?{' '}
              <button
                className="text-amber-500 hover:text-amber-600 font-semibold underline transition"
                onClick={() => navigate('/')}
              >
                Register
              </button>
            </p>
            <p className="mt-4">
              {!showForgotForm && (
                <button
                  className="text-gray-900 hover:text-gray-800 font-semibold underline transition"
                  onClick={() => setShowForgotForm(true)}
                >
                  Forgot Password?
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}