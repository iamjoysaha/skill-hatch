import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './main.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster />
  </>,
)
