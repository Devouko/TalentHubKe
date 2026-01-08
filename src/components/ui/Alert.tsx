import React from 'react'
import { CheckCircle, AlertTriangle, X } from 'lucide-react'

interface AlertProps {
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
      type === 'success' 
        ? 'bg-green-600/90 border-green-500 text-white' 
        : 'bg-red-600/90 border-red-500 text-white'
    }`}>
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertTriangle className="w-5 h-5" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Alert