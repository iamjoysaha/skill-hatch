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
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/user/home" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              SkillHatch
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavItem to="/user/home" label="Home" active={location.pathname === '/user/home'} />
            <NavItem to="/user/roadmaps" label="Roadmaps" active={location.pathname === '/user/roadmaps'} />
            <NavItem to="/user/mentors" label="Mentors" active={location.pathname === '/user/mentors'} />
            <NavItem to="/user/chats" label="Chats" active={location.pathname === '/user/chats'} />
            <NavItem to="/user/news" label="News & Announcements" active={location.pathname === '/user/news'} />
          </div>

          {/* Profile + Logout */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="hidden md:block text-sm font-medium text-white hover:text-yellow-400 transition-colors duration-300"
            >
              Logout
            </button>
            <Link to="/user/profile">
              <img
                src={user?.profile_image || DEFAULT_PROFILE_IMAGE}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400 transition-transform duration-300 hover:scale-105"
              />
            </Link>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-yellow-400 focus:outline-none transition-colors duration-300"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with Smooth Transition */}
        <div
          className={`md:hidden absolute top-16 left-0 w-full bg-gray-800 border-t border-gray-700 shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
          }`}
          style={{ zIndex: 60 }}
        >
          <div className="px-4 space-y-4">
            <NavItem to="/user/home" label="Home" mobile active={location.pathname === '/user/home'} />
            <NavItem to="/user/roadmaps" label="Roadmaps" mobile active={location.pathname === '/user/roadmaps'} />
            <NavItem to="/user/mentors" label="Mentors" mobile active={location.pathname === '/user/mentors'} />
            <NavItem to="/user/chats" label="Chats" mobile active={location.pathname === '/user/chats'} />
            <NavItem to="/user/news" label="News & Announcements" mobile active={location.pathname === '/user/news'} />
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavItem({ to, label, active, mobile }) {
  const baseClasses = mobile
    ? 'block w-full px-4 py-3 rounded-lg text-lg font-semibold'
    : 'text-sm font-medium'

  const activeClasses = active
    ? 'text-yellow-400 md:border-b-2 md:border-yellow-400'
    : 'text-white hover:text-yellow-400'

  return (
    <Link
      to={to}
      className={`${baseClasses} ${activeClasses} transition-colors duration-300`}
    >
      {label}
    </Link>
  )
}