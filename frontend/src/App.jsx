import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Home, Login, Profile, ProtectedRoute, Registration, Layout, RoadmapGenerator, Roadmaps, Mentors, News, Dashboard, UnifiedChats } from './components/index'
import AdminLayout from './components/admin/AdminLayout'

function App() {
  const userId = localStorage.getItem("userId")
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!userId) 
      return

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { userId }
    })
    
    newSocket.on('connect', () => {
      console.log(`User connected: ${newSocket.id}`)
      localStorage.setItem('socketId', newSocket.id)
      newSocket.emit("join", { userId })
    })
    
    newSocket.on('disconnect', () => {
      localStorage.removeItem('socketId')
      localStorage.removeItem('userId')
    })
    
    setSocket(newSocket)
    return () => {
      newSocket.disconnect()
    }
  }, [userId])

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/user/login" element={<Login />} />

          {/* for user */}
          <Route path="/user" element={ <ProtectedRoute role={'student'}><Layout /></ProtectedRoute> }>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="roadmapGenerator" element={<RoadmapGenerator />} />
            <Route path="chats" element={<UnifiedChats socket={socket} userRole="student" />} />
            <Route path="roadmaps" element={<Roadmaps />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="news" element={<News />} />
          </Route>

          {/* for admin */}
          <Route path="/admin" element={<ProtectedRoute role={'mentor'}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chats" element={<UnifiedChats socket={socket} userRole="mentor" />} />
          </Route>


          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </AnimatePresence>
    </Router>
  )
}

export default App