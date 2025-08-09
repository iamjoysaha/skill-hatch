import { useState } from "react";
import axios from "axios";

export default function RoadmapGenerator() {
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");
  const [earnedXP, setEarnedXP] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [badgeEarned, setBadgeEarned] = useState(false);

  const generateRoadmap = async () => {
    if (!skill || !duration) {
      setError("⚠️ Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setRoadmap(null);
    setEarnedXP(0);
    setTotalXP(0);
    setBadgeEarned(false);

    try {
      const question = `Create a learning roadmap for ${skill} for a ${experience} level learner to complete in ${duration} weeks.`;
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/roadmap/create`, { question });

      if (!data.success || !data.roadmap) throw new Error("Invalid response from backend.");

      const parsed = JSON.parse(data.roadmap.choices[0].message.content);
      const tasks = parsed.tasks.map(task => ({ ...task, status: "pending" }));
      const total = parsed.tasks.reduce((sum, task) => sum + task.xp, 0);

      const fullRoadmap = { ...parsed, tasks };
      setRoadmap(fullRoadmap);
      setTotalXP(total);

      localStorage.setItem("roadmapData", JSON.stringify({
        title: parsed.title,
        totalXP: total,
        earnedXP: 0,
        badge: parsed.badge
      }));

    } catch (err) {
      console.error("Roadmap generation error:", err);
      setError("❌ Error generating roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = (index) => {
    setRoadmap((prev) => {
      const updatedTasks = [...prev.tasks];
      const task = updatedTasks[index];

      const isCompleting = task.status !== "completed";
      const xpChange = isCompleting ? task.xp : -task.xp;
      const updatedXP = earnedXP + xpChange;
      const badgeNowEarned = updatedXP >= totalXP;

      task.status = isCompleting ? "completed" : "pending";

      setEarnedXP(updatedXP);
      setBadgeEarned(badgeNowEarned);

      const roadmapData = JSON.parse(localStorage.getItem("roadmapData"));
      if (roadmapData) {
        roadmapData.earnedXP = updatedXP;

        if (badgeNowEarned && !roadmapData.badge) {
          roadmapData.badge = prev.badge;
        }
        localStorage.setItem("roadmapData", JSON.stringify(roadmapData));
      }

      return { ...prev, tasks: updatedTasks };
    });
  };

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8 mb-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <i className="fas fa-lightbulb text-yellow-500 text-2xl"></i> Generate Custom Roadmap
        </h3>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Skill to Learn</label>
            <input
              type="text"
              placeholder="e.g., Python, Web Development"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (weeks)</label>
            <input
              type="number"
              min={1}
              placeholder="e.g., 6"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:-translate-y-1 text-sm shadow-md"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>

        {/* Roadmap Display */}
        {roadmap && (
          <div className="mt-10 space-y-6">
            <h4 className="text-xl font-bold text-gray-800">{roadmap.title}</h4>
            <p className="text-sm text-gray-600">{roadmap.description}</p>
            <p className="text-sm text-gray-700 font-medium">Duration: {roadmap.duration_weeks} weeks</p>
            <p className="text-sm text-gray-700 font-medium mb-2">Total XP Earned: {earnedXP} / {totalXP}</p>

            {badgeEarned && (
              <div className="flex items-center gap-3 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-md">
                <span className="font-semibold text-sm">🏆 Congratulations! You've earned the "{roadmap.badge.title}" badge!</span>
              </div>
            )}

            {roadmap.tasks.map((task, i) => {
              const isCompleted = task.status === "completed";

              return (
                <div
                  key={i}
                  className={`border-l-4 p-4 rounded-lg shadow-sm transition-all ${
                    isCompleted ? "border-green-500 bg-green-50" : "border-yellow-500 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h5
                      className={`text-md font-semibold ${
                        isCompleted ? "text-gray-500 line-through" : "text-gray-800"
                      }`}
                    >
                      Week {task.week}: {task.task}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        } flex items-center gap-1`}
                      >
                        <i className={`fas ${isCompleted ? "fa-check-circle" : "fa-clock"}`}></i>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                      <label className="inline-flex items-center cursor-pointer ml-1">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isCompleted}
                          onChange={() => toggleTaskStatus(i)}
                        />
                        <div className={`w-9 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-all ${isCompleted ? "bg-green-400" : ""}`}>
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                              isCompleted ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-1">XP: {task.xp}</p>
                  <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                    {task.resources.map((r, j) => (
                      <li key={j}>
                        <a href={r} target="_blank" rel="noopener noreferrer" className="underline">{r}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}