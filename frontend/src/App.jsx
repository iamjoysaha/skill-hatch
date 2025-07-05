import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Chats, Home, Loader, Login, Profile, ProtectedRoute, Registration, Layout } from './components/index'

function App() {
  const userId = localStorage.getItem("userId")
  const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL, { query: { userId } }), [userId])

  const [socketId, setSocketId] = useState(0)

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`User connected: ${socket.id}`)
      setSocketId(socket.id)
      localStorage.setItem('socketId', socket.id)

      socket.emit("join", { userId })
    })

    socket.on('disconnect', () => {
      localStorage.removeItem('socketId')
      localStorage.removeItem('userId')
      setSocketId('')
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [socket])

  if (userId && !socketId) return <Loader />

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/user/login" element={<Login />} />

          <Route path="/user" element={ <ProtectedRoute><Layout /></ProtectedRoute> }>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chats" element={<Chats socket={socket} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App