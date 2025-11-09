import React, { useState, useEffect } from "react";

export default function Community() {
  const [allContent, setAllContent] = useState([]);   // original data
  const [filteredContent, setFilteredContent] = useState([]); // filtered data
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCommunityContent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/community/get/all`);
        const data = await response.json();
        setAllContent(data.contents || []);
        setFilteredContent(data.contents || []);
      } catch (error) {
        console.error("Error fetching community content:", error);
      }
    };

    fetchCommunityContent();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredContent(allContent);
      return;
    }

    const filtered = allContent.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContent(filtered);
  }, [searchTerm, allContent]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = (item) => {
    // if (item.link) {
    //   window.open(item.link, "_blank");
    // }
    console.log("Clicked:", item);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-12">
        <h3 className="text-3xl sm:text-5xl font-bold text-center text-gray-800 mb-10 tracking-tight">
          Tech News & Events
        </h3>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <input
            type="text"
            placeholder="Search by title, description, or type..."
            className="w-full p-4 pr-12 rounded-xl border border-gray-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!filteredContent.length ? (
            <div className="text-center text-gray-600 text-lg font-medium col-span-full">
              No events found!
            </div>
          ) : (
            filteredContent.map((item) => (
              <button
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in text-left"
              >
                <img
                  src={item.image_url || "https://instaily.com/_next/static/media/test.b3910688.jpg"}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-xs mb-2">
                  {formatDate(item.createdAt)} • {item.type}
                </p>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.description}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 text-sm font-medium hover:underline break-words"
                  >
                    Link
                  </a>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <style jsx> {`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}