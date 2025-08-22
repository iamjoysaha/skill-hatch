import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Mentors() {
  const [allMentors, setAllMentors] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentRequests, setSentRequests] = useState({});

  useEffect(() => {
    const fetchMentors = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/mentors`);
      if (data.error) {
        toast.error(data.error);
        return;
      }

      console.log(data.mentors);
      setMentors(data.mentors);
      setAllMentors(data.mentors);
    };
    
    fetchMentors();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setMentors(allMentors);
    } else {
      const filteredMentors = allMentors.filter(mentor =>
        mentor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mentor.expertise || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mentor.college_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMentors(filteredMentors);
    }
  }, [searchTerm, allMentors]);

  const handleRequest = async (id) => {
    const userId = localStorage.getItem('userId');
    if (sentRequests[id] === 'pending') {
      try {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/connection/delete`,
          {
            params: {
              student_id: userId,
              mentor_id: id,
            },
          }
        );

        if (!data.success) {
          toast.error(data.message);
          return;
        }

        toast.success("Request cancelled!");
        setSentRequests((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel request!");
      }
    } 
    else {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/connection/create`,
          {
            student_id: userId,
            mentor_id: id,
          }
        );

        if (!data.success) {
          toast.error(data.message);
          return;
        }

        toast.success("Request sent!");
        setSentRequests((prev) => ({
          ...prev,
          [id]: "pending",
        }));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send request!");
      }
    }
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      const userId = localStorage.getItem('userId');
      const statusMap = {};

      for (let mentor of allMentors) {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/connection/status/${userId}/${mentor.id}`
          );

          if (data.success && data.data) {
            statusMap[mentor.id] = data.data.status;
          }
        } catch (error) {
          console.error(error);
          console.error(`Failed to fetch status for mentor ${mentor.id}`);
        }
      }

      setSentRequests(statusMap);
    };

    if (allMentors.length > 0) {
      fetchStatuses();
    }
  }, [allMentors]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <h3 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-800 tracking-tight">
          Find Your Mentors Here!
        </h3>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mentors by name, expertise, or experience..."
              className="w-full p-4 pr-12 rounded-xl border border-gray-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
        </div>

        {/* Mentors */}
        {mentors.length === 0 ? (
          <div className="text-center text-gray-600 text-lg font-medium">
            No mentors found!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map(mentor => (
              <div
                key={mentor.first_name}
                className="mentor-card bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform animate-fade-in"
              >
                <img
                  src={mentor?.profile_image || 'https://instaily.com/_next/static/media/test.b3910688.jpg'}
                  alt={`image`}
                  className="w-28 h-28 rounded-full mx-auto mb-5 border-4 border-indigo-100 object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                />
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-3">{mentor.first_name} {mentor.last_name}</h2>
                <p className="text-gray-600 text-center text-sm mb-2">
                  <span className="font-medium">Expertise In:</span> {mentor?.expertise}
                </p>
                <p className="text-gray-600 text-center text-sm mb-2">
                  <span className="font-medium">Experience:</span> {mentor?.experience || 'N/A'}
                </p>
                <p className="text-gray-600 text-center text-sm mb-4">
                  <span className="font-medium">College:</span> {mentor?.college_name}
                </p>
                <button
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 transform
                    ${sentRequests[mentor.id] === 'pending'
                      ? 'bg-red-500 hover:bg-red-600'
                      : sentRequests[mentor.id] === 'accepted'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  onClick={() => handleRequest(mentor.id)}
                  disabled={sentRequests[mentor.id] === 'accepted'}
                >
                  {sentRequests[mentor.id] === 'pending'
                    ? 'Cancel Request'
                    : sentRequests[mentor.id] === 'accepted'
                    ? 'Connected'
                    : 'Send Request'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>
      {`
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
      `}
      </style>
    </div>
  );
}