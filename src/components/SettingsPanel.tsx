import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Volume2, Mic, Monitor, Shield, Zap } from 'lucide-react'

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    voiceActivation: true,
    continuousListening: false,
    confirmDestructive: true,
    audioFeedback: true,
    visualFeedback: true,
    language: 'en',
    confidence: 80,
    volume: 70,
    micSensitivity: 60,
    autoExecute: false,
    darkMode: true,
    notifications: true
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: {
    icon: any
    title: string
    description: string
    children: React.ReactNode
  }) => (
    <div className="glass-card p-6">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-primary-500/20 rounded-lg">
          <Icon className="w-6 h-6 text-primary-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-blue-200 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  )

  const Toggle = ({ 
    checked, 
    onChange, 
    label 
  }: {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-white">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary-500' : 'bg-gray-600'
        }`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ x: checked ? 26 : 2 }}
          transition={{ duration: 0.2 }}
        />
      </button>
    </div>
  )

  const Slider = ({ 
    value, 
    onChange, 
    label, 
    min = 0, 
    max = 100 
  }: {
    value: number
    onChange: (value: number) => void
    label: string
    min?: number
    max?: number
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-white">{label}</span>
        <span className="text-primary-400 font-medium">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </motion.button>
        </div>

        <div className="grid gap-6">
          <SettingCard
            icon={Mic}
            title="Voice Recognition"
            description="Configure how VoiceOS listens and processes your voice commands"
          >
            <div className="space-y-4">
              <Toggle
                checked={settings.voiceActivation}
                onChange={(checked) => handleSettingChange('voiceActivation', checked)}
                label="Voice Activation"
              />
              <Toggle
                checked={settings.continuousListening}
                onChange={(checked) => handleSettingChange('continuousListening', checked)}
                label="Continuous Listening"
              />
              <Slider
                value={settings.confidence}
                onChange={(value) => handleSettingChange('confidence', value)}
                label="Confidence Threshold"
              />
              <Slider
                value={settings.micSensitivity}
                onChange={(value) => handleSettingChange('micSensitivity', value)}
                label="Microphone Sensitivity"
              />
            </div>
          </SettingCard>

          <SettingCard
            icon={Volume2}
            title="Audio & Feedback"
            description="Control audio output and feedback preferences"
          >
            <div className="space-y-4">
              <Toggle
                checked={settings.audioFeedback}
                onChange={(checked) => handleSettingChange('audioFeedback', checked)}
                label="Audio Feedback"
              />
              <Toggle
                checked={settings.visualFeedback}
                onChange={(checked) => handleSettingChange('visualFeedback', checked)}
                label="Visual Feedback"
              />
              <Slider
                value={settings.volume}
                onChange={(value) => handleSettingChange('volume', value)}
                label="System Volume"
              />
            </div>
          </SettingCard>

          <SettingCard
            icon={Shield}
            title="Security & Safety"
            description="Configure safety measures and confirmation settings"
          >
            <div className="space-y-4">
              <Toggle
                checked={settings.confirmDestructive}
                onChange={(checked) => handleSettingChange('confirmDestructive', checked)}
                label="Confirm Destructive Actions"
              />
              <Toggle
                checked={settings.autoExecute}
                onChange={(checked) => handleSettingChange('autoExecute', checked)}
                label="Auto-execute Commands"
              />
            </div>
          </SettingCard>

          <SettingCard
            icon={Monitor}
            title="Interface & Display"
            description="Customize the appearance and behavior of VoiceOS"
          >
            <div className="space-y-4">
              <Toggle
                checked={settings.darkMode}
                onChange={(checked) => handleSettingChange('darkMode', checked)}
                label="Dark Mode"
              />
              <Toggle
                checked={settings.notifications}
                onChange={(checked) => handleSettingChange('notifications', checked)}
                label="System Notifications"
              />
              <div className="space-y-2">
                <label className="text-white">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-primary-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="en_fr">English + French</option>
                </select>
              </div>
            </div>
          </SettingCard>

          <SettingCard
            icon={Zap}
            title="Performance"
            description="Optimize VoiceOS performance for your system"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-white">Processing Mode</label>
                <select
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-primary-500 focus:outline-none"
                >
                  <option value="realtime">Real-time (Low Latency)</option>
                  <option value="balanced">Balanced</option>
                  <option value="accuracy">High Accuracy</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-white">Model Size</label>
                <select
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-primary-500 focus:outline-none"
                >
                  <option value="1b">1B Parameters (Fast)</option>
                  <option value="2.6b">2.6B Parameters (Accurate)</option>
                </select>
              </div>
            </div>
          </SettingCard>
        </div>
      </div>
    </div>
  )
}