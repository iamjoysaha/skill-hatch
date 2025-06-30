import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client'
import { useMemo, useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const socket = useMemo(()=> io('http://localhost:3000'), [])
  const [socketId, setSocketId] = useState('')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected!')
      console.log('Your socket id: ', socket.id)

      setSocketId(socket.id)

      const userId = localStorage.getItem('userId')
      console.log(userId)

      if (userId) {
        axios.put('http://localhost:3000/api/user/socket', {
          user_id: userId,
          socket_id: socket.id
        })
        .then(() => {
          console.log('Socket ID updated on reconnect')
        })
        .catch((err) => {
          console.error('Error updating socket ID:', err)
        })
      }
    })

    return () => {
      socket.off('connect')
    }
  }, [socket])

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Registration socket={socket} socketId={socketId} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;