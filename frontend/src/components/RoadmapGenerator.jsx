import { useState } from "react"
import axios from 'axios'

export default function RoadmapGenerator() {
  const [skill, setSkill] = useState("")
  const [experience, setExperience] = useState("Beginner")
  const [duration, setDuration] = useState("")
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState("")

  const generateRoadmap = async () => {
    if (!skill || !duration) {
      setError("⚠️ Please fill out all fields.")
      return
    }

    setLoading(true)
    setError("")
    setRoadmap(null)

    try {
      const question = `Create a learning roadmap for ${skill} for a ${experience} level learner to complete in ${duration} weeks.`

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/roadmap/create`, { question })
      if (!response.data.success) 
        throw new Error("Something went wrong.")

      const parsed = JSON.parse(response.data.roadmap.choices[0].message.content)
      setRoadmap(parsed)

    } 
    catch (error) {
      setError("❌ Error generating roadmap.")
      console.error("Roadmap generation error:", error)
    } 
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8 mb-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <i className="fas fa-lightbulb text-yellow-500 text-2xl"></i> Generate Custom Roadmap
        </h3>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Skill to Learn</label>
            <input
              type="text"
              placeholder="e.g., Python, Web Development"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Experience Level</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Duration (weeks)</label>
            <input
              type="number"
              min={1}
              placeholder="e.g., 6"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:-translate-y-1 text-sm shadow-md"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        </div>

        {roadmap && (
          <div className="mt-10 space-y-6">
            <h4 className="text-xl font-bold text-gray-800">{roadmap.title}</h4>
            <p className="text-sm text-gray-600 font-medium mb-2">
              Duration: {roadmap.duration_weeks} weeks
            </p>

            {roadmap.tasks.map((task, i) => (
              <div
                key={i}
                className="border-l-4 border-yellow-500 bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <h5 className="text-md font-semibold text-gray-800">
                  Week {task.week}: {task.task}
                </h5>
                <p className="text-xs text-gray-600 mb-1">XP: {task.xp}</p>
                <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                  {task.resources.map((r, j) => (
                    <li key={j}>
                      <a href={r} target="_blank" rel="noopener noreferrer" className="underline">
                        {r}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}