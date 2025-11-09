import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RoadmapGenerator() {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRoadmap = async () => {
    if (!skill || !duration) {
      setError("⚠️ Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const question = `Create a learning roadmap for ${skill} for a ${level} level learner to complete in ${duration} weeks.`;
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/roadmap/generate`, { question });
      if (!data.success || !data.roadmap) 
        throw new Error("Invalid response from backend.");

      const parsedRoadmap = JSON.parse(data.roadmap.choices[0].message.content);
      const total_points = parsedRoadmap.tasks.reduce((sum, task) => sum + task.xp, 0);
      console.log("Generated Roadmap:", parsedRoadmap);

      // Save roadmap data to db
      const user_id = localStorage.getItem("userId");
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/roadmap/create`, {
        title: parsedRoadmap.title,
        description: parsedRoadmap.description,
        duration: parsedRoadmap.duration_weeks,
        tasks: parsedRoadmap.tasks,
        status: parsedRoadmap.status,
        level: level,
        badge: parsedRoadmap.badge,
        total_points: total_points,
        earned_points: 0,
        user_id: user_id,
      })

      if(!response.data.success) {
        setError("Failed to save roadmap to database!")
        toast.error("Failed to save roadmap to database!");
      } 
      else {
        toast.success("Roadmap generated successfully!");
      }

      localStorage.setItem("roadmapData", JSON.stringify({
        title: parsedRoadmap.title,
        totalXP: total_points,
        earnedXP: 0,
        badge: parsedRoadmap.badge
      }));

    } 
    catch (err) {
      console.error("Roadmap generation error:", err);
      setError("❌ Error generating roadmap.");
    } 
    finally {
      setLoading(false);
    }
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
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
      </div>
    </div>
  );
}