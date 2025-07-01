import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from './Loader'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/verify-token`, {
          withCredentials: true
        })

        if (res.data.success) {
          setIsAuthenticated(true)
        } else {
          setErrorMessage(res.data.message || 'Authentication failed.')
          setIsAuthenticated(false)
        }
      } catch (err) {
        const message = err.response?.data?.message || 'You must log in to access this page.'
        setErrorMessage(message)
        setIsAuthenticated(false)
      } finally {
        setTimeout(() => setIsLoading(false), 300)
      }
    }

    verifyAuth()
  }, [])

  useEffect(() => {
    if (!isLoading && errorMessage) {
      toast.error(errorMessage)
    }
  }, [isLoading, errorMessage])

  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />
  }

  return children
}
