import { toast } from "react-hot-toast"
import Cookies from "js-cookie"
import axios from "axios"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

export default function Sidebar({ onClose }) {
  const navigate = useNavigate()
  const [profileImage, setProfileImage] = useState('https://instaily.com/_next/static/media/test.b3910688.jpg')

  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = localStorage.getItem("userId")
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/user-data`, {
        params: { user_id },
        withCredentials: true,
      });

      if (data.success) {
        setProfileImage(data.user.profile_image || 'https://instaily.com/_next/static/media/test.b3910688.jpg')
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true })
      Cookies.remove("token")
      localStorage.removeItem("socketId")
      localStorage.removeItem("userId")
      toast.success(data.message)
      navigate("/user/login")
      if (onClose) 
        onClose()
    } 
    catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed!")
    }
  }

  return (
    <div className="w-64 bg-gray-800 text-gray-200 p-4 flex flex-col h-full">
      {/* Header with Logo + Profile */}
      <div className="flex justify-between items-center mb-6 lg:mb-8">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2"
          onClick={onClose}
        >
          {/* Profile Image */}
          <img
            src={profileImage} 
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-yellow-400"
          />
          <span className="text-2xl font-extrabold text-white tracking-tight">
            SkillHatch
          </span>
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <NavLink
          to="/admin/dashboard"
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition-colors ${
              isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/chats"
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition-colors ${
              isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Chats
        </NavLink>

        <NavLink
          to="/admin/requests"
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition-colors ${
              isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Requests
        </NavLink>

        <NavLink
          to="/admin/contributions"
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition-colors ${
              isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Contributions
        </NavLink>

        <NavLink
          to="/admin/posts"
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition-colors ${
              isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Posts
        </NavLink>

        <NavLink
          to="/admin/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition-colors ${
              isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Settings
        </NavLink>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition-colors shadow-md"
      >
        Logout
      </button>
    </div>
  );
}