import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './ProtectedRoute';
import Loader from './Loader';
import Animate from './Animate';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), []);
  const [socketId, setSocketId] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
      localStorage.setItem('socketId', socket.id);
    });

    socket.on('disconnect', () => {
      localStorage.removeItem('socketId');
      localStorage.removeItem('userId');
      setSocketId('');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  if (!socketId) return <Loader />;

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/user/login" element={<Login socketId={socketId} />} />
          <Route
            path="/user/home"
            element={
              <ProtectedRoute>
                  <Navbar />
                  <Animate>
                    <main className="flex-1 bg-gray-50 pt-16">
                      <Home socketId={socketId} />
                    </main>
                  </Animate>
                  <Footer />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App