import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Requests() {
  const [friendRequests, setFriendRequests] = useState([])
  const [requestCount, setRequestCount] = useState(0)
  const [connectedFriends, setConnectedFriends] = useState([])
  const [connectedCount, setConnectedCount] = useState(0)

  // Function to accept a friend request
  const acceptFriend = async(id) => {
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/connection/status/update`, {
        student_id: id,
        mentor_id: parseInt(localStorage.getItem('userId')),
        status: "accepted",
      })

      if(data.success) {
        setRequestCount(requestCount - 1)
        toast.success(data.message)
      }
    }
    catch (error) {
      toast.error(error.response.data.message)
      console.error(error)
    }

    const request = friendRequests.find((req) => req.id === id);
    if (request) {
      setConnectedFriends([
        ...connectedFriends,
        {
          id: request.id,
          name: request.name,
          avatar: request.avatar,
          level: request.level,
          college: request.college,
          rollNo: request.rollNo,
          userId: request.userId,
        },
      ]);
      setFriendRequests(friendRequests.filter((req) => req.id !== id));
    }
  };

  // Function to decline a friend request
  const declineFriend = (id) => {
    handleDisconnect(id)
    setFriendRequests(friendRequests.filter((req) => req.id !== id))
    setConnectedCount(connectedCount - 1)
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/connection/status/${localStorage.getItem('userId')}`
        );

        if (data.success) {
          let requests = [];

          for (let i = 0; i < data.connections.length; i++) {
            if (data.connections[i].status === "pending") {
              let student = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/user-data`,
                {
                  params: {
                    user_id: data.connections[i].student_id,
                  },
                }
              );

              if (student.data.success) {
                requests.push({
                  id: student.data.user.id,
                  name: student.data.user.first_name + " " + student.data.user.last_name,
                  avatar: student.data.user.profile_image,
                  level: student.data.user.level,
                  college: student.data.user.college_name,
                  rollNo: student.data.user.roll_no,
                  userId: student.data.user.username,
                });
              }
            }
          }

          setFriendRequests(requests)
          setRequestCount(requests.length)
        }
      } catch (error) {
        console.error("Error fetching connection status:", error);
      }
    };

    const fetchConnectedStudents = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/connection/get/accepted`, {
          params: {
            mentor_id: localStorage.getItem('userId')
          }
        })
        
        if(data.success) {
          let students = []
          for(let i = 0; i < data.connections.length; i++) {
            let student = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/user-data`, {
              params: {
                user_id: data.connections[i].student_id
              }
            })

            if(student.data.success) {
              students.push({
                id: student.data.user.id,
                name: student.data.user.first_name + " " + student.data.user.last_name,
                avatar: student.data.user.profile_image,
                level: student.data.user.level,
                college: student.data.user.college_name,
                rollNo: student.data.user.roll_no,
                userId: student.data.user.username,
              })
            }
          }

          setConnectedFriends(students)
          setConnectedCount(students.length)
        }
      } 
      catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchRequests();
    fetchConnectedStudents();
  }, []);

  const handleDisconnect = async (id) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/connection/disconnect`, {
        data: {
          student_id: id,
          mentor_id: localStorage.getItem('userId'),
        },
      });

      if (data.success) {
        toast.success(data.message);
        setConnectedFriends(connectedFriends.filter((f) => f.id !== id));
        setConnectedCount(connectedCount - 1);
      } else {
        toast.error(data.message);
      }
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "Failed to disconnect");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8 sm:px-6 sm:py-10 shadow-lg">
      <h1 className="text-center text-4xl font-bold text-gray-800 mb-8">
        Find Your Students Here!
      </h1>

      <div className="friend-requests w-full max-w-[700px] bg-white p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">
          Pending Requests ({requestCount})
        </h2>
        <div>
          {friendRequests.length === 0 ? (
            <p className="text-center text-gray-500 text-base sm:text-lg italic py-6">
              No pending requests.
            </p>
          ) : (
            friendRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-100 mb-3 last:mb-0"
              >
                <img
                  src={request.avatar || "https://instaily.com/_next/static/media/test.b3910688.jpg"}
                  alt={request.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-200 object-cover mb-3 sm:mb-0 sm:mr-4"
                />
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    {request.name} ({request.userId})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Level: {request.level}
                  </p>
                  <p className="text-sm text-gray-600">
                    College: {request.college}
                  </p>
                  <p className="text-sm text-gray-600">
                    Roll No: {request.rollNo}
                  </p>
                </div>
                <div className="friend-actions flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                    onClick={() => acceptFriend(request.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                    onClick={() => declineFriend(request.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="connected-friends w-full max-w-[700px] bg-white p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">
          Connected Students ({connectedCount})
        </h2>
        <div>
          {connectedFriends.length === 0 ? (
            <p className="text-center text-gray-500 text-base sm:text-lg italic py-6">
              No connected students!
            </p>
          ) : (
            connectedFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-100 mb-3 last:mb-0"
              >
                <img
                  src={friend.avatar || "https://instaily.com/_next/static/media/test.b3910688.jpg"}
                  alt={friend.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-200 object-cover mb-3 sm:mb-0 sm:mr-4"
                />
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    {friend.name} ({friend.userId})
                  </h3>
                  <p className="text-sm text-gray-600">Level: {friend.level}</p>
                  <p className="text-sm text-gray-600">
                    College: {friend.college}
                  </p>
                  <p className="text-sm text-gray-600">
                    Roll No: {friend.rollNo}
                  </p>
                </div>
                <div className="friend-actions flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                    onClick={() => handleDisconnect(friend.id)}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
