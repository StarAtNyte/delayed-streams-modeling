import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VoiceInterface from './components/VoiceInterface'
import CommandHistory from './components/CommandHistory'
import SystemStatus from './components/SystemStatus'
import SettingsPanel from './components/SettingsPanel'
import { VoiceProvider } from './contexts/VoiceContext'
import { Settings, History, Activity } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState<'voice' | 'history' | 'status' | 'settings'>('voice')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check server connection
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health')
        setIsConnected(response.ok)
      } catch {
        setIsConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000)
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'voice', label: 'Voice Control', icon: Activity },
    { id: 'history', label: 'History', icon: History },
    { id: 'status', label: 'System', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const

  return (
    <VoiceProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <header className="glass-card mx-4 mt-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  VoiceOS
                </h1>
                <p className="text-sm text-blue-200">Voice-Controlled Computer Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-blue-200">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="glass-card mx-4 mt-4 p-2">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'text-blue-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-4 mt-4 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'voice' && <VoiceInterface />}
              {activeTab === 'history' && <CommandHistory />}
              {activeTab === 'status' && <SystemStatus />}
              {activeTab === 'settings' && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </VoiceProvider>
  )
}

export default App