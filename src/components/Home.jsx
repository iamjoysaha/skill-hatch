import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import axios from "axios"

export default function Home() {
  const [roadmapData, setRoadmapData] = useState([])
  const [communityData, setCommunityData] = useState([])
  const [badges, setBadges] = useState([])
  const [totalXP, setTotalXP] = useState(0)
  const [earnedXP, setEarnedXP] = useState(0)

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("reloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }

    // Fetch roadmap data from backend
    const user_id = localStorage.getItem("userId");
    const fetchRoadmapData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/roadmap/roadmaps`, {
          params: { user_id },
          withCredentials: true,
        }
      )

      const latest = (data.roadmaps || [])
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 2)

      if (data.success) {
        setRoadmapData(latest);

        let totalEarned = 0;
        let totalPoints = 0;

        data.roadmaps.forEach((roadmap) => {
          totalPoints += roadmap.total_points;
          roadmap.tasks?.forEach((task) => {
            if (task.status === "Completed") {
              totalEarned += task.xp;
            }
          });
        });

        setEarnedXP(totalEarned)
        setTotalXP(totalPoints)
      }
    } 
    catch (error) {
      console.error("Error fetching roadmap data:", error);
    }
  }

    // fetch badges
    const fetchBadgeInfo = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/badges`, { params: { id: user_id }})

        if (data.success) {
          setBadges(data.badges)
        }
      } 
      catch (error) {
        console.error("Error fetching badges:", error);
      }
    }

    // fetch community contents
    const fetchCommunityContent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/community/get/all`)
        const data = await response.json()
        
        const latest = (data.contents || [])
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 1)

        setCommunityData(latest)
      } 
      catch (error) {
        console.error("Error fetching community content:", error);
      }
    }

    fetchRoadmapData()
    fetchBadgeInfo()
    fetchCommunityContent()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <h3 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800 tracking-tight">
        Welcome to Skill Hatch!
      </h3>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
      {/* Your Progress */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="fas fa-road text-yellow-500 text-xl sm:text-2xl"></i>
            Your Progress
          </h3>

          {roadmapData.length > 0 ? (
            roadmapData.map((roadmap) => (
              <div key={roadmap.id} className="mb-6">
                <h4 className="text-md font-semibold text-gray-800">
                  {roadmap.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {roadmap.description}
                </p>

                {/* Progress bar per roadmap */}
                <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-3 ${roadmap.status === "completed" 
                      ? "bg-green-500" 
                      : "bg-gradient-to-r from-yellow-400 to-yellow-600"} rounded-full`}
                    style={{
                      width: `${Math.floor(
                        (roadmap.earned_points / roadmap.total_points) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Progress: {Math.floor((roadmap.earned_points / roadmap.total_points) * 100)}%
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No roadmap found. Generate one below.</p>
          )}
        </div>

        <NavLink
          to={"/user/roadmapGenerator"}
          className="block text-center w-full mt-6 sm:mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:-translate-y-1 text-sm shadow-md"
        >
          Generate New Roadmap
        </NavLink>
      </div>


      {/* Your Achievements */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <i className="fas fa-trophy text-yellow-500 text-xl sm:text-2xl"></i>
          Your Achievements
        </h3>

        <p className="text-sm text-gray-600 font-medium mb-2">
          XP: {earnedXP || 0} / {totalXP || 0}
        </p>

        <p className="text-sm text-gray-600 font-medium mb-6">
          Badges: {badges?.length || 0}
        </p>

        <div className="flex flex-wrap gap-3">
          {badges.length > 0 ? (
            badges.map((badge, index) => (
              <span
                key={index}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all transform hover:-translate-y-1"
              >
                <img src={badge.image} alt={badge.title} className="w-5 h-5" />
                {badge.title}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No badges earned yet!</span>
          )}
        </div>
      </div>

        {/* Community Highlights */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="fas fa-users text-yellow-500 text-xl sm:text-2xl"></i>
            Community Highlights
          </h3>

          {communityData.map((data, i) => (
            <div
              key={i}
              className="mb-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
            >
              <img
                src={data.image_url || "https://instaily.com/_next/static/media/test.b3910688.jpg"}
                alt={data.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h4 className="text-sm font-semibold text-gray-800">{data.title}</h4>
              <p className="text-xs text-gray-600 font-medium">{data.description}</p>
              <p className="text-xs text-gray-600 font-medium">Date: {new Date(data.updatedAt).toLocaleDateString()}</p>
              {data.link && (
                <div className="flex gap-3 mt-3">
                  <button className="text-yellow-600 hover:text-yellow-700 text-xs font-semibold underline transition-colors">
                    <a href={`${data.link}`} target="_blank" rel="noopener noreferrer">Link</a>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}