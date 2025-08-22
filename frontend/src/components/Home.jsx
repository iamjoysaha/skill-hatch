import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  const [roadmapData, setRoadmapData] = useState(null);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("reloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }

    // Get roadmap data from localStorage
    const storedData = localStorage.getItem("roadmapData");
    if (storedData) {
      try {
        setRoadmapData(JSON.parse(storedData));
      } catch (err) {
        console.error("Error parsing roadmapData:", err);
      }
    }
  }, []);

  const progress = roadmapData?.totalXP
    ? Math.min(100, Math.floor((roadmapData.earnedXP / roadmapData.totalXP) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <h3 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800 tracking-tight">
        Welcome to Skill Hatch!
      </h3>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Roadmaps */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <i className="fas fa-road text-yellow-500 text-xl sm:text-2xl"></i>
              Your Roadmaps
            </h3>

            {roadmapData ? (
              <>
                <div className={`text-sm font-semibold ${progress === 100 ? "text-gray-400 line-through" : "text-gray-700"}`}>
                  {roadmapData.title}
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Progress: {progress}%
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No roadmap found. Generate one below.
              </p>
            )}
          </div>

          <NavLink
            to={"/user/roadmapGenerator"}
            className="block text-center w-full mt-6 sm:mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:-translate-y-1 text-sm shadow-md"
          >
            Generate New Roadmap
          </NavLink>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <i className="fas fa-trophy text-yellow-500 text-xl sm:text-2xl"></i>
            Progress Tracker
          </h3>

          <p className="text-sm text-gray-600 font-medium mb-2">
            XP: {roadmapData?.earnedXP || 0} / {roadmapData?.totalXP || 0}
          </p>

          <p className="text-sm text-gray-600 font-medium mb-6">
            Badges: {roadmapData?.badge ? 1 : 0}
          </p>

          <div className="flex flex-wrap gap-3">
            {roadmapData?.badge ? (
              <span className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all transform hover:-translate-y-1">
                <i className={`fas ${roadmapData.badge.icon} mr-2 text-sm`}></i>
                {roadmapData.badge.title}
              </span>
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

          {[ 
            { title: "React Meetup", date: "Next Week", desc: "Join our local React developers meetup!" },
            { title: "UI/UX Workshop", date: "This Friday", desc: "Learn advanced Figma techniques." }
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
  );
}