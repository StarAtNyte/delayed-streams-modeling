import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import VoiceProcessor from './voice-processor.js'
import CommandExecutor from './command-executor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

// Initialize voice processor and command executor
const voiceProcessor = new VoiceProcessor()
const commandExecutor = new CommandExecutor()

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected')
  
  let isListening = false
  let audioBuffer = []

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString())
      
      switch (data.type) {
        case 'start_listening':
          isListening = true
          audioBuffer = []
          ws.send(JSON.stringify({ type: 'listening_started' }))
          break
          
        case 'stop_listening':
          isListening = false
          if (audioBuffer.length > 0) {
            ws.send(JSON.stringify({ type: 'processing_start' }))
            
            try {
              // Process audio with Kyutai STT
              const transcript = await voiceProcessor.processAudio(audioBuffer)
              
              if (transcript && transcript.trim()) {
                ws.send(JSON.stringify({
                  type: 'transcript',
                  text: transcript,
                  confidence: 0.95 // Mock confidence for now
                }))
                
                // Execute command
                const commandId = Date.now().toString()
                const result = await commandExecutor.executeCommand(transcript)
                
                ws.send(JSON.stringify({
                  type: 'command_result',
                  commandId,
                  success: result.success,
                  response: result.message
                }))
              }
            } catch (error) {
              console.error('Error processing audio:', error)
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to process audio'
              }))
            }
            
            ws.send(JSON.stringify({ type: 'processing_end' }))
          }
          break
          
        case 'audio_data':
          if (isListening && data.audio) {
            audioBuffer.push(...data.audio)
          }
          break
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
    isListening = false
  })
})

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`VoiceOS server running on port ${PORT}`)
  console.log(`Web interface: http://localhost:${PORT}`)
})