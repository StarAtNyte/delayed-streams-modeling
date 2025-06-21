import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

interface Command {
  id: string
  text: string
  timestamp: Date
  status: 'processing' | 'completed' | 'failed'
  response?: string
  confidence?: number
}

interface VoiceContextType {
  isListening: boolean
  isProcessing: boolean
  currentTranscript: string
  commands: Command[]
  startListening: () => void
  stopListening: () => void
  addCommand: (command: Omit<Command, 'id' | 'timestamp'>) => void
  updateCommand: (id: string, updates: Partial<Command>) => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [commands, setCommands] = useState<Command[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    
    wsRef.current = new WebSocket(wsUrl)
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected')
    }
    
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'transcript':
            setCurrentTranscript(data.text)
            break
          case 'command_result':
            updateCommand(data.commandId, {
              status: data.success ? 'completed' : 'failed',
              response: data.response
            })
            break
          case 'processing_start':
            setIsProcessing(true)
            break
          case 'processing_end':
            setIsProcessing(false)
            break
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    
    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected')
      setTimeout(connectWebSocket, 3000) // Reconnect after 3 seconds
    }
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }, [])

  useEffect(() => {
    connectWebSocket()
    return () => {
      wsRef.current?.close()
    }
  }, [connectWebSocket])

  const startListening = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'start_listening' }))
      setIsListening(true)
      setCurrentTranscript('')
    }
  }, [])

  const stopListening = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stop_listening' }))
      setIsListening(false)
    }
  }, [])

  const addCommand = useCallback((command: Omit<Command, 'id' | 'timestamp'>) => {
    const newCommand: Command = {
      ...command,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setCommands(prev => [newCommand, ...prev])
    return newCommand.id
  }, [])

  const updateCommand = useCallback((id: string, updates: Partial<Command>) => {
    setCommands(prev => prev.map(cmd => 
      cmd.id === id ? { ...cmd, ...updates } : cmd
    ))
  }, [])

  return (
    <VoiceContext.Provider value={{
      isListening,
      isProcessing,
      currentTranscript,
      commands,
      startListening,
      stopListening,
      addCommand,
      updateCommand
    }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider')
  }
  return context
}