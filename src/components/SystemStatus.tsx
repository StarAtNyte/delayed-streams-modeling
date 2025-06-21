import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, HardDrive, Wifi, Battery, Monitor, Mic } from 'lucide-react'

interface SystemInfo {
  cpu: number
  memory: number
  disk: number
  network: boolean
  audio: boolean
  display: string
}

export default function SystemStatus() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: true,
    audio: true,
    display: '1920x1080'
  })

  useEffect(() => {
    // Simulate system monitoring
    const interval = setInterval(() => {
      setSystemInfo({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: 65 + Math.random() * 10,
        network: Math.random() > 0.1,
        audio: Math.random() > 0.05,
        display: '1920x1080'
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const StatusCard = ({ 
    icon: Icon, 
    title, 
    value, 
    unit, 
    color, 
    isOnline 
  }: {
    icon: any
    title: string
    value: number | string
    unit?: string
    color: string
    isOnline?: boolean
  }) => (
    <motion.div
      className="glass-card p-6"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        {isOnline !== undefined && (
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
        )}
      </div>
      
      {typeof value === 'number' && unit !== 'status' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">{Math.round(value)}{unit}</span>
            <span className="text-sm text-blue-200">{Math.round(value)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                value > 80 ? 'bg-red-500' : value > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      ) : (
        <div className="text-2xl font-bold text-white">{value}</div>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-6">System Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard
            icon={Cpu}
            title="CPU Usage"
            value={systemInfo.cpu}
            unit="%"
            color="bg-blue-500"
          />
          
          <StatusCard
            icon={HardDrive}
            title="Memory"
            value={systemInfo.memory}
            unit="%"
            color="bg-green-500"
          />
          
          <StatusCard
            icon={HardDrive}
            title="Disk Usage"
            value={systemInfo.disk}
            unit="%"
            color="bg-purple-500"
          />
          
          <StatusCard
            icon={Wifi}
            title="Network"
            value="Connected"
            color="bg-indigo-500"
            isOnline={systemInfo.network}
          />
          
          <StatusCard
            icon={Mic}
            title="Audio System"
            value="Active"
            color="bg-pink-500"
            isOnline={systemInfo.audio}
          />
          
          <StatusCard
            icon={Monitor}
            title="Display"
            value={systemInfo.display}
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Voice Recognition Status */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Voice Recognition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-200">STT Model</span>
              <span className="text-white font-medium">Kyutai DSM 1B</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Language</span>
              <span className="text-white font-medium">English/French</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Latency</span>
              <span className="text-white font-medium">0.5s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Accuracy</span>
              <span className="text-white font-medium">94.2%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Voice Activity Detection</span>
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Streaming Mode</span>
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Batch Processing</span>
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Word Timestamps</span>
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}