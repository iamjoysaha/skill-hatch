import axios from "axios"
import React, { useEffect } from "react"

export default function Home({ socketId }) {
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId && socketId) {
      axios
        .put(`${import.meta.env.VITE_BACKEND_URL}/user/socket`, {
          user_id: userId,
          socket_id: socketId,
        })
        .then(() => {
          console.log("Socket ID updated on reconnect")
        })
        .catch((error) => {
          console.error("Error updating socket ID:", error)
        })
    }
  }, [socketId])

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center animate-fadeIn">
        Welcome to Your Learning Hub
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Roadmaps */}
        <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-road text-yellow-500"></i> Your Roadmaps
          </h3>

          <div className="space-y-4">
            {["Frontend Development", "UI/UX Design"].map((title, i) => (
              <div key={i}>
                <div className="text-sm font-medium text-gray-600">{title}</div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div className="h-2 bg-yellow-400 rounded-full w-0 transition-all duration-500"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Progress: 0%</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-yellow-400 text-gray-800 font-semibold py-2 rounded-md hover:bg-yellow-500 transition transform hover:-translate-y-1 text-sm">
            Generate New Roadmap
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-trophy text-yellow-500"></i> Progress Tracker
          </h3>
          <p className="text-sm text-gray-600">XP: 450 / 1000</p>
          <p className="text-sm text-gray-600 mb-4">Badges: 2</p>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: "fa-code", label: "HTML Master" },
              { icon: "fa-paint-brush", label: "CSS Pro" },
            ].map((badge, i) => (
              <span
                key={i}
                className="flex items-center bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-medium animate-grow"
              >
                <i className={`fas ${badge.icon} mr-1`}></i>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Community Highlights */}
        <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-users text-yellow-500"></i> Community Highlights
          </h3>

          {[
            {
              title: "React Meetup",
              date: "Next Week",
              desc: "Join our local React developers meetup!",
            },
            {
              title: "UI/UX Workshop",
              date: "This Friday",
              desc: "Learn advanced Figma techniques.",
            },
          ].map((event, i) => (
            <div
              key={i}
              className="mb-4 p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              <h4 className="text-sm font-semibold text-gray-700">{event.title}</h4>
              <p className="text-xs text-gray-600">Date: {event.date}</p>
              <p className="text-xs text-gray-600">{event.desc}</p>
              <div className="flex gap-2 mt-2">
                <button className="text-yellow-500 hover:text-yellow-600 text-xs font-medium underline">
                  Join Event
                </button>
                <button className="text-gray-800 hover:text-gray-600 text-xs font-medium underline">
                  Share Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
