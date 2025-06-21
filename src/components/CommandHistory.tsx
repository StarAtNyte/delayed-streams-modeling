import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useVoice } from '../contexts/VoiceContext'

export default function CommandHistory() {
  const { commands } = useVoice()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-400 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-400/30 bg-green-400/10'
      case 'failed':
        return 'border-red-400/30 bg-red-400/10'
      case 'processing':
        return 'border-blue-400/30 bg-blue-400/10'
      default:
        return 'border-gray-400/30 bg-gray-400/10'
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Command History</h2>
        <div className="text-sm text-blue-200">
          {commands.length} commands executed
        </div>
      </div>

      {commands.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-blue-200 mb-2">No Commands Yet</h3>
          <p className="text-blue-300">Start using voice commands to see your history here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commands.map((command, index) => (
            <motion.div
              key={command.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 border ${getStatusColor(command.status)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(command.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white truncate">
                      {command.text}
                    </h3>
                    <span className="text-xs text-blue-300 flex-shrink-0 ml-4">
                      {command.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {command.confidence && (
                    <div className="mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-blue-300">Confidence:</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${command.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-300">{command.confidence}%</span>
                      </div>
                    </div>
                  )}
                  
                  {command.response && (
                    <div className="mt-2 p-3 bg-black/20 rounded-lg">
                      <p className="text-sm text-blue-200">{command.response}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      command.status === 'completed' ? 'bg-green-400/20 text-green-300' :
                      command.status === 'failed' ? 'bg-red-400/20 text-red-300' :
                      command.status === 'processing' ? 'bg-blue-400/20 text-blue-300' :
                      'bg-gray-400/20 text-gray-300'
                    }`}>
                      {command.status.charAt(0).toUpperCase() + command.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}