import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from './Loader'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
    error: ''
  })

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/verify/verify-token`,
          { withCredentials: true }
        )

        if (response.data.success) {
          setAuthStatus({ isLoading: false, isAuthenticated: true, error: '' })
        } else {
          setAuthStatus({
            isLoading: false,
            isAuthenticated: false,
            error: response.data.message || 'Authentication failed.'
          })
        }
      } catch (err) {
        setAuthStatus({
          isLoading: false,
          isAuthenticated: false,
          error: err.response?.data?.message || 'You must log in to access this page.'
        })
      }
    }

    verifyUser()
  }, [])

  useEffect(() => {
    if (!authStatus.isLoading && authStatus.error) {
      toast.error(authStatus.error)
    }
  }, [authStatus])

  if (authStatus.isLoading) {
    return <Loader />
  }

  if (!authStatus.isAuthenticated) {
    return <Navigate to="/user/login" replace />
  }

  return children
}