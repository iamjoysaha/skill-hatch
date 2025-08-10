import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from './Loader'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Unauthorized } from './index'

export default function ProtectedRoute({ children, role }) {
  const accountType = localStorage.getItem("accountType")
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
    error: ''
  })

  useEffect(() => {
    console.log("Account Type:", accountType)
  }, [accountType])

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify/verify-token`, { withCredentials: true })

        if (response.data.success && accountType === role) {
          setAuthStatus({ isLoading: false, isAuthenticated: true, error: '' })
        } 
        else {
          setAuthStatus({ isLoading: false, isAuthenticated: false, error: response.data.message || 'Authentication failed.'})
        }
      } 
      catch (error) {
        setAuthStatus({ isLoading: false, isAuthenticated: false, error: error.response?.data?.message || 'You must log in to access this page.'})
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

  if (!authStatus.isAuthenticated && accountType !== role) {
    return <Unauthorized/>
  }

  return children
}