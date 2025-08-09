import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import notifySound from "../assets/notify.mp3";

export default function Chats({ socket }) {
  const userId = localStorage.getItem("userId");
  const typingTimeout = useRef(null);
  const messagesRef = useRef(null);
  const messageSoundRef = useRef(null);

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [typingMentors, setTypingMentors] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [mentors, setMentors] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/mentors`);
        const now = new Date();
        const enriched = res.data.mentors.map(m => {
          const lastActive = new Date(m.last_active_at);
          const diffMin = (now - lastActive) / 60000;
          return {
            ...m,
            online: m.status === "active" && diffMin < 15,
            lastActive: diffMin < 1 ? "just now" : diffMin < 60 ? `${Math.floor(diffMin)} min ago` : `${Math.floor(diffMin / 60)} hr ago`
          };
        });
        setMentors(enriched);
      } catch (err) {
        console.error("Failed to fetch mentors", err);
      }
    };

    fetchMentors();
    const interval = setInterval(fetchMentors, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingMentors, selectedMentor]);

  useEffect(() => {
    if (!socket) return;

    const receiveMessage = ({ from, to, text, timestamp }) => {
      const partnerId = from === userId ? to : from;
      const newMsg = {
        id: Date.now(),
        mentorId: partnerId,
        sender: from === userId ? "You" : "Them",
        text,
        timestamp
      };

      setMessages(prev => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), newMsg]
      }));

      if (!selectedMentor || selectedMentor.id !== partnerId) {
        setUnreadCounts(prev => ({
          ...prev,
          [partnerId]: (prev[partnerId] || 0) + 1
        }));
        if (from !== userId && messageSoundRef.current) {
          messageSoundRef.current.currentTime = 0;
          messageSoundRef.current.play().catch(err => console.error("Sound error", err));
        }
      }
    };

    socket.on("receive_message", receiveMessage);
    socket.on("typing", ({ from }) => setTypingMentors(p => ({ ...p, [from]: true })));
    socket.on("stop_typing", ({ from }) => {
      setTypingMentors(p => {
        const updated = { ...p };
        delete updated[from];
        return updated;
      });
    });

    socket.on("reconnect", () => socket.emit("join", { userId }));

    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("reconnect");
    };
  }, [socket, selectedMentor, userId]);

  const handleTyping = (e) => {
    const val = e.target.value;
    setMessage(val);
    if (!selectedMentor || !socket) return;

    socket.emit("typing", { to: selectedMentor.id, from: userId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { to: selectedMentor.id, from: userId });
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedMentor || !socket) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: Date.now(), mentorId: selectedMentor.id, sender: "You", text: message, timestamp };

    setMessages(prev => ({
      ...prev,
      [selectedMentor.id]: [...(prev[selectedMentor.id] || []), newMsg]
    }));

    socket.emit("send_message", { from: userId, to: selectedMentor.id, text: message, timestamp });
    socket.emit("stop_typing", { to: selectedMentor.id, from: userId });
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData) => setMessage(prev => prev + emojiData.emoji);
  const selectedMessages = selectedMentor ? messages[selectedMentor.id] || [] : [];
  const isTyping = selectedMentor && typingMentors[selectedMentor.id];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-white">
      <audio ref={messageSoundRef} src={notifySound} preload="auto" />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`absolute sm:static inset-0 bg-white sm:w-80 transition-transform duration-300 z-10 ${selectedMentor ? "translate-x-full sm:translate-x-0" : "translate-x-0"}`}>
          <header className="p-4 shadow bg-white flex items-center gap-3 sticky top-0 z-10">
            {selectedMentor && <button onClick={() => setSelectedMentor(null)} className="sm:hidden text-gray-500"><i className="fas fa-arrow-left text-lg" /></button>}
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><i className="fas fa-comments" /> Mentor Chats</h2>
          </header>
          <div className="overflow-y-auto h-full pb-20">
            {mentors.map(mentor => (
              <div
                key={mentor.id}
                onClick={() => {
                  setSelectedMentor(mentor);
                  setUnreadCounts(prev => ({ ...prev, [mentor.id]: 0 }));
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${selectedMentor?.id === mentor.id ? "bg-blue-50" : ""}`}
              >
                <div className="relative">
                  <img src={mentor.profile_image || "https://instaily.com/_next/static/media/test.b3910688.jpg"} className="w-10 h-10 rounded-full object-cover" />
                  {mentor.online && <span className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />}
                  {unreadCounts[mentor.id] > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCounts[mentor.id]}</span>}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{mentor.first_name} {mentor.last_name}</p>
                  <p className="text-xs text-gray-500">{mentor.online ? "Online" : `Last seen ${mentor.lastActive}`}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col bg-gradient-to-tr from-white to-indigo-50">
          {selectedMentor ? (
            <>
              <header className="p-[10px] shadow bg-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={selectedMentor.profile_image || "https://instaily.com/_next/static/media/test.b3910688.jpg"} className="w-10 h-10 rounded-full object-cover" />
                    {selectedMentor.online && <span className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{selectedMentor.first_name} {selectedMentor.last_name}</p>
                    <p className="text-xs text-gray-500">{selectedMentor.online ? "Online" : `Last seen ${selectedMentor.lastActive}`}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMentor(null)} className="text-gray-500 hover:text-red-500 text-xl"><i className="fas fa-times" /></button>
              </header>

              <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                <div className="flex justify-center text-xs text-gray-500">Today</div>
                {selectedMessages.map(msg => (
                  <div key={msg.id} className={`max-w-[70%] px-4 py-3 rounded-xl shadow-md ${msg.sender === "You" ? "ml-auto bg-yellow-100" : "mr-auto bg-white"}`}>
                    <p className="text-gray-700">{msg.text}</p>
                    <span className="block mt-1 text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="max-w-[70%] px-4 py-3 rounded-xl shadow-md mr-auto bg-white text-left">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="block mt-1 text-xs text-gray-400">Typing...</span>
                  </div>
                )}
              </div>

              <footer className="p-4 bg-white shadow-inner flex items-center gap-2 relative">
                <button onClick={() => setShowEmojiPicker(p => !p)} className="text-xl px-2">😊</button>
                {showEmojiPicker && <div className="absolute bottom-16 left-4 z-50"><EmojiPicker onEmojiClick={handleEmojiClick} /></div>}
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !socket?.connected}
                  className="w-10 h-10 bg-yellow-300 hover:bg-yellow-400 text-white rounded-full flex items-center justify-center disabled:opacity-50 shadow"
                >
                  <i className="fas fa-paper-plane text-gray-700" />
                </button>
              </footer>
            </>
          ) : (
            <div className="sm:flex hidden flex-1 flex-col items-center justify-center text-gray-500 text-center px-4">
              <i className="fas fa-comments text-5xl mb-4 animate-pulse" />
              <p className="text-lg font-medium">Select a mentor to start chatting</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}