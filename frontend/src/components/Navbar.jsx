import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import axios from 'axios'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  const handleLogout = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true })

      Cookies.remove('token')
      localStorage.removeItem('socketId')
      localStorage.removeItem('userId')

      toast.success(data.message)
      navigate('/user/login')
    } 
    catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed!')
    }
  }

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/user/profile" className="flex items-center gap-2">
            <img
              src="https://instaily.com/_next/static/media/test.b3910688.jpg"
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-gray-900">SkillHatch</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/user/home" label="Dashboard" current={location.pathname === '/user/home'} />
            <NavLink to="#" label="Roadmaps" />
            <NavLink to="#" label="Mentors" />
            <NavLink to="/user/chats" label="Chat" />
            <NavLink to="#" label="Progress" />
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1">
          <NavLink to="/user/home" label="Dashboard" mobile current={location.pathname === '/user/home'} />
          <NavLink to="#" label="Roadmaps" mobile />
          <NavLink to="#" label="Mentors" mobile />
          <NavLink to="#" label="Chat" mobile />
          <NavLink to="#" label="Progress" mobile />
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, label, mobile, current }) {
  const base = mobile
    ? 'block px-3 py-2 rounded-md text-sm'
    : 'text-sm font-medium'

  const active = current
    ? 'text-black border-b-2 border-black'
    : 'text-gray-600 hover:text-black transition'

  return (
    <Link to={to} className={`${base} ${active}`}>
      {label}
    </Link>
  )
}
