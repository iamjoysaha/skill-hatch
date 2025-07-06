import { useEffect, useState } from "react"
import { Loader } from './index'

export default function Home({ socket }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("reloaded")

    if (!hasReloaded) {
      sessionStorage.setItem("reloaded", "true")
      window.location.reload()
    } else {
      sessionStorage.removeItem("reloaded")
    }

    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center animate-fadeIn tracking-tight">
        Welcome to Your Learning Hub
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Roadmaps */}
        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="fas fa-road text-yellow-500 text-2xl"></i> Your Roadmaps
          </h3>

          <div className="space-y-6">
            {["Frontend Development", "UI/UX Design"].map((title, i) => (
              <div key={i}>
                <div className="text-sm font-semibold text-gray-700">{title}</div>
                <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                    style={{ width: `0%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">Progress: 0%</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:-translate-y-1 text-sm shadow-md">
            Generate New Roadmap
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="fas fa-trophy text-yellow-500 text-2xl"></i> Progress Tracker
          </h3>
          <p className="text-sm text-gray-600 font-medium mb-2">XP: 450 / 1000</p>
          <p className="text-sm text-gray-600 font-medium mb-6">Badges: 2</p>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: "fa-code", label: "HTML Master" },
              { icon: "fa-paint-brush", label: "CSS Pro" }
            ].map((badge, i) => (
              <span
                key={i}
                className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full text-xs font-semibold animate-grow shadow-sm"
              >
                <i className={`fas ${badge.icon} mr-2 text-sm`}></i>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Community Highlights */}
        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="fas fa-users text-yellow-500 text-2xl"></i> Community Highlights
          </h3>

          {[
            {
              title: "React Meetup",
              date: "Next Week",
              desc: "Join our local React developers meetup!"
            },
            {
              title: "UI/UX Workshop",
              date: "This Friday",
              desc: "Learn advanced Figma techniques."
            }
          ].map((event, i) => (
            <div
              key={i}
              className="mb-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
            >
              <h4 className="text-sm font-semibold text-gray-800">{event.title}</h4>
              <p className="text-xs text-gray-600 font-medium">Date: {event.date}</p>
              <p className="text-xs text-gray-600 font-medium">{event.desc}</p>
              <div className="flex gap-3 mt-3">
                <button className="text-yellow-600 hover:text-yellow-700 text-xs font-semibold underline transition-colors">
                  Join Event
                </button>
                <button className="text-gray-700 hover:text-gray-800 text-xs font-semibold underline transition-colors">
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