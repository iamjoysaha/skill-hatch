import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import axios from 'axios'

const DEFAULT_PROFILE_IMAGE = 'https://instaily.com/_next/static/media/test.b3910688.jpg'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true })
      Cookies.remove('token')
      localStorage.removeItem('socketId')
      localStorage.removeItem('userId')
      toast.success(data.message)
      navigate('/user/login')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed!')
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = localStorage.getItem("userId")
      if (!user_id) return

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/user-data`, {
          params: { user_id },
          withCredentials: true,
        })

        if (data.success) {
          setUser(data.user)
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <nav className="sticky top-0 z-50 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/user/home" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">SkillHatch</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/user/home" label="Home" current={location.pathname === '/user/home'} />
            <NavLink to="/user/roadmaps" label="Roadmaps" />
            <NavLink to="/user/mentors" label="Mentors" />
            <NavLink to="/user/chats" label="Chats" />
            <NavLink to="/user/news" label="News & Announcements" />
          </div>

          {/* Profile Icon & Logout */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="hidden md:block text-sm font-medium text-white hover:text-yellow-400 transition-colors duration-200"
            >
              Logout
            </button>
            <Link to="/user/profile" className="flex items-center">
              <img
                src={user?.profile_image || DEFAULT_PROFILE_IMAGE}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 hover:text-yellow-400 transition-colors duration-200"
              />
            </Link>
            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-yellow-400 focus:outline-none transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-50 border-t border-gray-200 shadow-lg z-50 px-4 pt-3 pb-4">
          <div className="space-y-2">
            <NavLink to="/user/home" label="Home" mobile current={location.pathname === '/user/home'} />
            <NavLink to="/user/roadmaps" label="Roadmaps" mobile />
            <NavLink to="/user/mentors" label="Mentors" mobile />
            <NavLink to="/user/chats" label="Chats" mobile />
            <NavLink to="/user/news" label="News & Announcements" mobile />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-yellow-400 hover:bg-blue-50 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, label, mobile, current }) {
  const base = mobile
    ? 'block px-4 py-2 rounded-lg text-sm font-medium'
    : 'text-sm font-medium'

  const active = current
    ? 'text-yellow-400 bg-yellow-50 md:bg-transparent md:border-b-2 md:border-yellow-400'
    : 'text-white hover:text-yellow-400 hover:bg-yellow-50 md:hover:bg-transparent transition-colors duration-200'

  return (
    <Link to={to} className={`${base} ${active}`}>
      {label}
    </Link>
  )
}
