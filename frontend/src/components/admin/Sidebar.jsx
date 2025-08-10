import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, { withCredentials: true });
      Cookies.remove("token");
      localStorage.removeItem("socketId");
      localStorage.removeItem("userId");
      toast.success(data.message);
      navigate("/user/login");
    } 
    catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-gray-200 p-4 flex flex-col">
      <div className="mb-8">
        <Link to="/admin/dashboard" className="text-2xl font-extrabold text-white tracking-tight">
          SkillHatch
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink to="/admin/dashboard" className="block px-4 py-2 rounded transition-colors  bg-gray-700 text-white">
          Dashboard
        </NavLink>
        <NavLink to="/admin/chats" className="block px-4 py-2 rounded transition-colors  bg-gray-700 text-white">
          Chats
        </NavLink>
      </nav>

      <button onClick={handleLogout} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
        Logout
      </button>
    </div>
  );
}
