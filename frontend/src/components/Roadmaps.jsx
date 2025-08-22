import { useEffect, useState } from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import toast from "react-hot-toast";

function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [earnedXP, setEarnedXP] = useState({});
  const [filters, setFilters] = useState({
    level: "",
    duration: "",
    search: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleTaskStatus = async (roadmapIndex, taskIndex) => {
    const roadmap = roadmaps[roadmapIndex];
    if (!roadmap) 
      return;

    const updatedTasks = roadmap.tasks.map((task, tIdx) => {
      if (tIdx === taskIndex) {
        return {
          ...task,
          status:
            task.status.toLowerCase() === "completed"
              ? "Pending"
              : "Completed",
        };
      }
      return task;
    });

    const newEarnedXP = updatedTasks.filter((task) => task.status.toLowerCase() === "completed").reduce((sum, task) => sum + task.xp, 0);
    const totalXP = updatedTasks.reduce((sum, task) => sum + task.xp, 0);
    const allCompleted = newEarnedXP === totalXP;
    const roadmapStatus = allCompleted ? "completed" : "pending";
    const badge = allCompleted ? roadmap.badge : roadmap.badge;

    try {
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/roadmap/update/${roadmap.id}`, {
          task_id: roadmap.tasks[taskIndex].id,
          task_status: updatedTasks[taskIndex].status,
          roadmap_status: roadmapStatus,
          badge: badge,
          total_points: totalXP,
          earned_points: newEarnedXP,
        }
      );

      if (!data.success) {
        toast.error(data.message || "Failed to update roadmap");
        return;
      }

      setRoadmaps((prev) =>
        prev.map((r, rIdx) =>
          rIdx === roadmapIndex
            ? { ...r, tasks: updatedTasks, status: roadmapStatus }
            : r
        )
      );

      setEarnedXP((prevXP) => ({
        ...prevXP,
        [roadmapIndex]: newEarnedXP,
      }));

      toast.success("Task Updated!");
    } 
    catch (error) {
      console.error("Error updating roadmap:", error);
      toast.error("Error updating roadmap");
    }
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const user_id = localStorage.getItem("userId");
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/roadmap/roadmaps`, { params: { user_id } })

        if (data.success && data.roadmaps.length > 0) {
          console.log("Fetched roadmaps:", data.roadmaps);
          setRoadmaps(data.roadmaps);

          const xpMap = {};
          data.roadmaps.forEach((r, i) => {
            xpMap[i] = r.tasks
              .filter((t) => t.status.toLowerCase() === "completed")
              .reduce((sum, t) => sum + t.xp, 0);
          });
          setEarnedXP(xpMap);
        }
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      }
    };

    fetchRoadmaps();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    const matchesLevel = filters.level
      ? roadmap.level.toLowerCase() === filters.level.toLowerCase()
      : true;
    const matchesDuration = filters.duration
      ? roadmap.duration === parseInt(filters.duration)
      : true;
    const matchesSearch = filters.search
      ? roadmap.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        roadmap.description.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return matchesLevel && matchesDuration && matchesSearch;
  });

  const handleDeleteRoadmap = async (id) => {
    const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/roadmap/delete/${id}`);
    if (!data.success) {
      toast.error(data.message || "Failed to delete roadmap");
    }

    setRoadmaps((prev) => prev.filter((roadmap) => roadmap.id !== id));
    toast.success(data.message || "Roadmap deleted successfully");
  };

  return (
    <div className="bg-gray-100 flex flex-col md:flex-row min-h-full">
      {/* Filters Section */}
      <div className="md:w-80 bg-white shadow-lg p-6 md:sticky md:top-0">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h3 className="text-4xl md:text-2xl font-extrabold text-center mb-10 text-gray-800 tracking-tight">
            Find Your Roadmaps Here!
          </h3>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? <CloseIcon/> : <ArrowDownwardIcon />}
          </button>
        </div>
        <div
          className={`${
            isFilterOpen ? "block" : "hidden"
          } md:block space-y-6`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search roadmaps..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              name="duration"
              value={filters.duration}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="">All Durations</option>
              <option value="4">4 weeks</option>
              <option value="8">8 weeks</option>
              <option value="12">12 weeks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roadmaps Section */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {filteredRoadmaps.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {filteredRoadmaps.map((roadmap, rIdx) => {
              const totalXP =
                roadmap?.tasks?.reduce((sum, task) => sum + task.xp, 0) || 0;
              const xpEarned = earnedXP[rIdx] || 0;
              const badgeEarned = xpEarned === totalXP;
              const progress = totalXP
                ? Math.round((xpEarned / totalXP) * 100)
                : 0;

              return (
                <div
                  key={rIdx}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col w-full sm:w-[48%] lg:w-[46%]"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-bold text-gray-800 truncate">
                        {roadmap?.title || "Untitled Roadmap"}
                      </h4>
                      <button onClick={() => handleDeleteRoadmap(roadmap.id)}>
                        <DeleteIcon className="text-red-500 cursor-pointer hover:text-red-600" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {roadmap?.description || "No description available."}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-gray-700 mb-4">
                    <p>📅 {roadmap?.duration ?? 0} weeks</p>
                    <p>🎯 {roadmap?.level}</p>
                    <p>
                      ⭐{" "}
                      <span className="text-blue-600 font-semibold">
                        {xpEarned}
                      </span>{" "}
                      / {totalXP}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Progress: {progress}%
                  </p>

                  {/* Badge */}
                  {badgeEarned && roadmap?.badge?.title && (
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded-md text-xs font-medium mb-4">
                      🏆 {roadmap.badge.title}
                    </div>
                  )}

                  {/* Tasks */}
                  <div className="space-y-3 flex-1">
                    {roadmap?.tasks?.map((task, tIdx) => {
                      const isCompleted =
                        task.status.toLowerCase() === "completed";
                      return (
                        <div
                          key={tIdx}
                          className={`border-l-4 p-3 rounded-md shadow-sm transition-all ${
                            isCompleted
                              ? "border-blue-500 bg-blue-50"
                              : "border-yellow-400 bg-yellow-50"
                          }`}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <h5
                              className={`text-sm font-semibold ${
                                isCompleted
                                  ? "text-gray-500 line-through"
                                  : "text-gray-800"
                              }`}
                            >
                              Week {task.week}: {task.task}
                            </h5>
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={isCompleted}
                                onChange={() => toggleTaskStatus(rIdx, tIdx)}
                              />
                              <div
                                className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-0.5 transition-all ${
                                  isCompleted ? "bg-blue-500" : ""
                                }`}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                                    isCompleted
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  }`}
                                ></div>
                              </div>
                            </label>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            XP: {task.xp}
                          </p>
                          {/* Resources */}
                          {task.resources && task.resources.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700">
                                Resources:
                              </p>
                              <ul className="list-disc pl-4 text-xs text-blue-600 break-words">
                                {task.resources.map((resource, resIdx) => (
                                  <li key={resIdx} className="truncate">
                                    <a
                                      href={resource}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline block"
                                    >
                                      {resource}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No roadmaps found! :(
          </p>
        )}
      </div>
    </div>
  );
}

export default Roadmaps;