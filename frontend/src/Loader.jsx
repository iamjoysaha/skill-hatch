import React from 'react'

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  )
}