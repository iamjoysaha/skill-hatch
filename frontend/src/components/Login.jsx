import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Login({ socketId }) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    Cookies.remove('token')
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        formData,
        { withCredentials: true }
      )

      if (data.success) {
        localStorage.setItem('userId', data.user.id)

        axios
          .put(`${import.meta.env.VITE_BACKEND_URL}/user/socket`, {
            user_id: data.user.id,
            socket_id: socketId,
          })
          .catch((error) => console.error('Error updating socket ID:', error))

        toast.success(data.message)
        navigate('/user/home')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong while login!')
    }

    setFormData({ email: '', password: '' })
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

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e2b5f] text-sm"
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
                className="w-full p-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e2b5f] text-sm"
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
              className="w-full bg-[#f4c150] text-[#2e2b5f] font-semibold py-2.5 rounded-md hover:bg-yellow-400 transition transform hover:-translate-y-1 text-sm"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-secondary mt-6">
            Don’t have an account?{' '}
            <button
              className="text-[#f4c150] hover:text-yellow-400 font-medium underline"
              onClick={() => navigate('/')}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}