import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("reloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloaded");
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Total Students", value: "150" },
          { title: "Active Courses", value: "12" },
          { title: "Pending Enrollments", value: "8" },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="text-sm sm:text-base font-semibold text-gray-800">
              {card.title}
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>John Doe enrolled in Web Development - 2 hours ago</li>
          <li>Jane Smith completed Data Science module - 5 hours ago</li>
        </ul>
      </div>
    </div>
  );
}