import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Chats, Home, Login, Profile, ProtectedRoute, Registration, Layout, RoadmapGenerator } from './components/index'

function App() {
  const userId = localStorage.getItem("userId")
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!userId) return

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { userId }
    })

    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log(`User connected: ${newSocket.id}`)
      localStorage.setItem('socketId', newSocket.id)
      newSocket.emit("join", { userId })
    })

    newSocket.on('disconnect', () => {
      localStorage.removeItem('socketId')
      localStorage.removeItem('userId')
    })

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

          <Route path="/user" element={ <ProtectedRoute><Layout /></ProtectedRoute> }>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="roadmapGenerator" element={<RoadmapGenerator />} />
            <Route path="chats" element={<Chats socket={socket} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App