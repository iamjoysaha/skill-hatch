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
        console.log(data)
        toast.success(data.message)
        navigate('/user/home')
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Pane */}
      <div
        className="w-full lg:w-1/2 min-h-[300px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(https://instaily.com/_next/static/media/test.b3910688.jpg)` }}
      >
        <div className="absolute inset-0 bg-[#2e2b5f]/70 flex items-center justify-center p-6">
          <div className="text-center text-white max-w-md animate-fadeIn">
            <h1 className="text-3xl font-bold mb-4">Welcome Back to SkillHatch</h1>
            <p>Log in to continue your learning or mentoring journey with our vibrant community.</p>
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-1/2 bg-neutral flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl animate-slideUp">
          <div className="flex justify-center mb-6">
            <img
              src="https://instaily.com/_next/static/media/test.b3910688.jpg"
              alt="SkillHatch Logo"
              className="h-24 rounded-full object-cover"
            />
          </div>

          <h2 className="text-xl font-bold text-center text-primary mb-1">Log In</h2>
          <p className="text-center text-sm text-secondary mb-6">Access your SkillHatch account</p>

          {/* Login Form */}
          {!showForgotForm && (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full p-3 border border-gray-200 rounded-md shadow-sm text-sm"
                  required
                />
              </div>

              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-secondary mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-3 border border-gray-200 rounded-md shadow-sm text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-[#2e2b5f]"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2e2b5f] text-white hover:bg-[#1a1a1a] font-semibold py-2.5 rounded-md transition transform hover:-translate-y-1 text-sm"
              >
                Log In
              </button>
            </form>
          )}

          {/* Forgot Password Card */}
          {showForgotForm && !showOtpCard && (
            <div className="mt-4">
              <h3 className="text-center font-medium text-secondary mb-4">Forgot Password</h3>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 mb-3 border rounded-md text-sm"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-2 mb-3 border rounded-md text-sm"
              />
              <button
                onClick={handleSendOtp}
                className="w-full bg-[#2e2b5f] text-white py-2 rounded hover:bg-[#1a1a1a] transition"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* OTP Verification Card */}
          {showOtpCard && (
            <div className="mt-4">
              <h3 className="text-center font-medium text-secondary mb-4">Enter OTP</h3>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 mb-3 border rounded-md text-sm"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-[#2e2b5f] text-white py-2 rounded hover:bg-[#1a1a1a] transition"
              >
                Verify & Log In
              </button>
            </div>
          )}

          <div className="text-center text-sm text-secondary mt-6">
            <p>
              Don’t have an account?{' '}
              <button
                className="text-[#f4c150] hover:text-yellow-400 font-medium underline"
                onClick={() => navigate('/')}
              >
                Register
              </button>
            </p>
            <p className="mt-3">
              {!showForgotForm && (
                <button
                  className="text-[#2e2b5f] hover:text-[#1a1a1a] font-medium underline"
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