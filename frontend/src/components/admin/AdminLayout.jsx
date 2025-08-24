import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 z-50`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6">
        <button className="lg:hidden mb-4 inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-white rounded-md shadow text-sm sm:text-base" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          <span className="hidden xs:inline">
            {isSidebarOpen ? "Close" : "Open"}
          </span>
        </button>
        <Outlet />
      </div>
    </div>
  );
}