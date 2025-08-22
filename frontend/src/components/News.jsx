import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const newsData = [
  {
    title: "AI Innovation Summit 2025",
    date: "September 10, 2025",
    content:
      "Join our virtual AI Innovation Summit on Microsoft Teams, featuring keynotes on machine learning advancements.",
  },
  {
    title: "Code & Create Bootcamp",
    date: "August 19, 2025",
    content:
      "Attend the Code & Create Bootcamp Orientation on Google Meet, hosted by Patricia Oko with guest Godson Pius. Focus on tech for good.",
  },
  {
    title: "Cybersecurity Webinar Series",
    date: "August 25, 2025",
    content:
      "Explore the latest in cybersecurity through our Microsoft Teams webinar series, covering threat detection and mitigation.",
  },
  {
    title: "Cloud Computing Workshop",
    date: "August 5, 2025",
    content:
      "Join our hands-on workshop on Google Meet to learn about cloud computing trends and tools for developers.",
  },
];

export default function News() {
  const [news, setNews] = useState(newsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedNews, setBookmarkedNews] = useState({});

  useEffect(() => {
    const filteredNews = newsData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setNews(filteredNews);
  }, [searchTerm]);

  const handleBookmark = (newsTitle) => {
    setBookmarkedNews((prev) => {
      const newBookmarks = { ...prev };
      if (newBookmarks[newsTitle]) {
        delete newBookmarks[newsTitle];
      } 
      else {
        newBookmarks[newsTitle] = true;
        toast.success(`Bookmarked!`);
      }
      return newBookmarks;
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-12">
        <h3 className="text-3xl sm:text-5xl font-bold text-center text-gray-800 mb-10 tracking-tight">
          Tech News & Events
        </h3>
        <div className="max-w-2xl mx-auto mb-12 relative">
          <input
            type="text"
            placeholder="Search tech events by title, content, or date..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.length === 0 ? (
            <div className="text-center text-gray-600 text-lg font-medium col-span-full">
              No events found! :(
            </div>
          ) : (
            news.map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
              >
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm text-center mb-2">
                  {item.date}
                </p>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {item.content}
                </p>
                <button
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                    bookmarkedNews[item.title]
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  onClick={() => handleBookmark(item.title)}
                >
                  {bookmarkedNews[item.title]
                    ? "Remove Bookmark"
                    : "Bookmark Event"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <style jsx>{`
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
