import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import notifySound from "../assets/notify.mp3";

export default function UnifiedChats({ socket, userRole = "student" }) {
  const userId = localStorage.getItem("userId");
  const typingTimeout = useRef(null);
  const messagesRef = useRef(null);
  const messageSoundRef = useRef(null);

  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [contacts, setContacts] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Dynamic configuration based on user role
  const config = {
    student: {
      endpoint: "/user/mentors",
      title: "Mentor Chats",
      emptyMessage: "Select a mentor to start chatting"
    },
    mentor: {
      endpoint: "/user/students", 
      title: "Chat With Students",
      emptyMessage: "Select a student to start chatting"
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}${config[userRole].endpoint}`
        );
        
        const now = new Date();
        const contactsData = res.data.mentors || res.data.students || res.data;
        
        const enriched = contactsData.map(contact => {
          const lastActive = new Date(contact.last_active_at);
          const diffMin = (now - lastActive) / 60000;
          return {
            ...contact,
            online: contact.status === "active" && diffMin < 60,
            lastActive: diffMin < 1 ? "just now" : 
                       diffMin < 60 ? `${Math.floor(diffMin)} min ago` : 
                       `${Math.floor(diffMin / 60)} hr ago`
          };
        });
        setContacts(enriched);
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      }
    };

    fetchContacts();
    const interval = setInterval(fetchContacts, 5000);
    return () => clearInterval(interval);
  }, [userRole]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ 
      top: messagesRef.current.scrollHeight, 
      behavior: "smooth" 
    });
  }, [messages, typingUsers, selectedContact]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", { userId, userRole });

    const receiveMessage = ({ from, to, text, timestamp }) => {
      const partnerId = from === userId ? to : from;
      const newMsg = {
        id: Date.now() + Math.random(),
        contactId: partnerId,
        sender: from === userId ? "You" : "Them",
        text,
        timestamp
      };

      setMessages(prev => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), newMsg]
      }));

      // Handle unread counts and notifications
      if (!selectedContact || selectedContact.id !== partnerId) {
        setUnreadCounts(prev => ({
          ...prev,
          [partnerId]: (prev[partnerId] || 0) + 1
        }));
        
        if (from !== userId && messageSoundRef.current) {
          messageSoundRef.current.currentTime = 0;
          messageSoundRef.current.play().catch(err => 
            console.error("Sound error", err)
          );
        }
      }
    };

    const handleTyping = ({ from }) => {
      setTypingUsers(prev => ({ ...prev, [from]: true }));
    };

    const handleStopTyping = ({ from }) => {
      setTypingUsers(prev => {
        const updated = { ...prev };
        delete updated[from];
        return updated;
      });
    };

    socket.on("receive_message", receiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("reconnect", () => socket.emit("join", { userId, userRole }));

    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("reconnect");
    };
  }, [socket, selectedContact, userId, userRole]);

  const handleTyping = (e) => {
    const val = e.target.value;
    setMessage(val);
    
    if (!selectedContact || !socket) return;

    socket.emit("typing", { to: selectedContact.id, from: userId });
    
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { to: selectedContact.id, from: userId });
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact || !socket) return;

    const timestamp = new Date().toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    
    const newMsg = { 
      id: Date.now() + Math.random(), 
      contactId: selectedContact.id, 
      sender: "You", 
      text: message, 
      timestamp 
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
    }));

    socket.emit("send_message", { 
      from: userId, 
      to: selectedContact.id, 
      text: message, 
      timestamp 
    });
    
    socket.emit("stop_typing", { to: selectedContact.id, from: userId });
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const selectedMessages = selectedContact ? messages[selectedContact.id] || [] : [];
  const isTyping = selectedContact && typingUsers[selectedContact.id];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-white">
      <audio ref={messageSoundRef} src={notifySound} preload="auto" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`absolute sm:static inset-0 bg-white sm:w-80 transition-transform duration-300 z-10 ${
          selectedContact ? "translate-x-full sm:translate-x-0" : "translate-x-0"
        }`}>
          <header className="p-4 shadow bg-white flex items-center gap-3 sticky top-0 z-10">
            {selectedContact && (
              <button 
                onClick={() => setSelectedContact(null)} 
                className="sm:hidden text-gray-500"
              >
                <i className="fas fa-arrow-left text-lg" />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-comments" /> 
              {config[userRole].title}
            </h2>
          </header>
          
          <div className="overflow-y-auto h-full pb-20">
            {contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  setUnreadCounts(prev => ({ ...prev, [contact.id]: 0 }));
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                  selectedContact?.id === contact.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="relative">
                  <img 
                    src={contact.profile_image || "https://instaily.com/_next/static/media/test.b3910688.jpg"} 
                    className="w-10 h-10 rounded-full object-cover" 
                    alt={`${contact.first_name} ${contact.last_name}`}
                  />
                  {contact.online && (
                    <span className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                  )}
                  {unreadCounts[contact.id] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCounts[contact.id]}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {contact.first_name} {contact.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {contact.online ? "Online" : `Last seen ${contact.lastActive}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col bg-gradient-to-tr from-white to-indigo-50">
          {selectedContact ? (
            <>
              <header className="p-[10px] shadow bg-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={selectedContact.profile_image || "https://instaily.com/_next/static/media/test.b3910688.jpg"} 
                      className="w-10 h-10 rounded-full object-cover" 
                      alt={`${selectedContact.first_name} ${selectedContact.last_name}`}
                    />
                    {selectedContact.online && (
                      <span className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedContact.first_name} {selectedContact.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedContact.online ? "Online" : `Last seen ${selectedContact.lastActive}`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedContact(null)} 
                  className="text-gray-500 hover:text-red-500 text-xl"
                >
                  <i className="fas fa-times" />
                </button>
              </header>

              <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                <div className="flex justify-center text-xs text-gray-500">Today</div>
                {selectedMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`max-w-[70%] px-4 py-3 rounded-xl shadow-md ${
                      msg.sender === "You" 
                        ? "ml-auto bg-yellow-100" 
                        : "mr-auto bg-white"
                    }`}
                  >
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
                <button 
                  onClick={() => setShowEmojiPicker(p => !p)} 
                  className="text-xl px-2"
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-4 z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              <p className="text-lg font-medium">{config[userRole].emptyMessage}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}