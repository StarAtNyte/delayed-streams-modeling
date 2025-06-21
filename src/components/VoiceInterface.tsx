import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, Square } from 'lucide-react'
import { useVoice } from '../contexts/VoiceContext'

export default function VoiceInterface() {
  const { 
    isListening, 
    isProcessing, 
    currentTranscript, 
    startListening, 
    stopListening,
    addCommand 
  } = useVoice()
  
  const [audioLevel, setAudioLevel] = useState(0)

  // Simulate audio level for visual feedback
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    } else {
      setAudioLevel(0)
    }
  }, [isListening])

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
      if (currentTranscript.trim()) {
        addCommand({
          text: currentTranscript,
          status: 'processing'
        })
      }
    } else {
      startListening()
    }
  }

  return (
    <div className="glass-card p-8">
      <div className="text-center space-y-8">
        {/* Voice Button */}
        <div className="relative flex justify-center">
          <motion.button
            onClick={handleVoiceToggle}
            className={`voice-button w-32 h-32 rounded-full flex items-center justify-center text-white shadow-2xl ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : 'bg-gradient-to-r from-primary-500 to-accent-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isListening ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
          >
            {isListening ? (
              <Square className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
            
            {/* Pulse rings for listening state */}
            {isListening && (
              <>
                <div className="pulse-ring" style={{ animationDelay: '0s' }} />
                <div className="pulse-ring" style={{ animationDelay: '0.5s' }} />
                <div className="pulse-ring" style={{ animationDelay: '1s' }} />
              </>
            )}
          </motion.button>
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Ready to Listen'}
          </h2>
          <p className="text-blue-200">
            {isListening 
              ? 'Speak your command clearly' 
              : 'Click the microphone to start voice control'
            }
          </p>
        </div>

        {/* Audio Visualizer */}
        {isListening && (
          <motion.div 
            className="flex justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-primary-500 to-accent-500 rounded-full"
                animate={{
                  height: [4, Math.random() * 40 + 10, 4],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Current Transcript */}
        {currentTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 max-w-2xl mx-auto"
          >
            <div className="flex items-start space-x-3">
              <Volume2 className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-200 mb-1">You said:</p>
                <p className="text-white font-medium">{currentTranscript}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Commands */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { text: 'Open Calculator', icon: '🧮' },
            { text: 'Take Screenshot', icon: '📸' },
            { text: 'Show Desktop', icon: '🖥️' },
            { text: 'Lock Screen', icon: '🔒' },
          ].map((command, index) => (
            <motion.button
              key={index}
              onClick={() => addCommand({ text: command.text, status: 'processing' })}
              className="glass-card p-4 hover:bg-white/20 transition-all duration-200 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {command.icon}
              </div>
              <p className="text-sm text-blue-200">{command.text}</p>
            </motion.button>
          ))}
        </div>

        {/* Instructions */}
        <div className="glass-card p-6 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-primary-300">Voice Commands</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-200">
            <div>
              <h4 className="font-medium text-white mb-2">File Operations</h4>
              <ul className="space-y-1">
                <li>"Open [application name]"</li>
                <li>"Create new folder"</li>
                <li>"Delete [file name]"</li>
                <li>"Search for [term]"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">System Control</h4>
              <ul className="space-y-1">
                <li>"Take a screenshot"</li>
                <li>"Lock the screen"</li>
                <li>"Adjust volume to [level]"</li>
                <li>"Show desktop"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}