import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class VoiceProcessor {
  constructor() {
    this.isInitialized = false
    this.tempDir = path.join(__dirname, 'temp')
    this.ensureTempDir()
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }

  async processAudio(audioBuffer) {
    try {
      // For now, we'll simulate the Kyutai STT processing
      // In a real implementation, this would interface with the Rust STT server
      // or use the Python moshi package
      
      console.log(`Processing audio buffer of length: ${audioBuffer.length}`)
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock transcription - in reality this would call the Kyutai STT model
      const mockTranscripts = [
        "open calculator",
        "take a screenshot", 
        "show desktop",
        "lock screen",
        "create new folder",
        "search for documents",
        "adjust volume to fifty percent",
        "close current window"
      ]
      
      // Return a random mock transcript for demo purposes
      const transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]
      console.log(`Mock transcript: ${transcript}`)
      
      return transcript
    } catch (error) {
      console.error('Error in voice processing:', error)
      throw error
    }
  }

  async processWithKyutaiSTT(audioBuffer) {
    // This method would integrate with the actual Kyutai STT system
    // Either by calling the Rust server or using the Python package
    
    try {
      // Save audio buffer to temporary file
      const tempAudioFile = path.join(this.tempDir, `audio_${Date.now()}.wav`)
      
      // Convert audio buffer to WAV format (simplified)
      // In reality, you'd need proper audio format conversion
      
      // Call Kyutai STT using the Python script
      const pythonScript = path.join(__dirname, '../scripts/streaming_stt_timestamps.py')
      
      return new Promise((resolve, reject) => {
        const process = spawn('python', [
          pythonScript,
          '--file', tempAudioFile,
          '--hf-repo', 'kyutai/stt-1b-en_fr'
        ])
        
        let output = ''
        let error = ''
        
        process.stdout.on('data', (data) => {
          output += data.toString()
        })
        
        process.stderr.on('data', (data) => {
          error += data.toString()
        })
        
        process.on('close', (code) => {
          // Clean up temp file
          if (fs.existsSync(tempAudioFile)) {
            fs.unlinkSync(tempAudioFile)
          }
          
          if (code === 0) {
            // Parse the output to extract transcript
            const transcript = this.parseSTTOutput(output)
            resolve(transcript)
          } else {
            reject(new Error(`STT process failed: ${error}`))
          }
        })
      })
    } catch (error) {
      console.error('Error calling Kyutai STT:', error)
      throw error
    }
  }

  parseSTTOutput(output) {
    // Parse the output from the Kyutai STT script
    // The script outputs timestamped text, we need to extract just the text
    try {
      const lines = output.split('\n').filter(line => line.trim())
      const textParts = []
      
      for (const line of lines) {
        // Extract text from timestamp format: "word (start:end)"
        const match = line.match(/^(.+?)\s+\(\d+\.\d+:\d+\.\d+\)$/)
        if (match) {
          textParts.push(match[1].trim())
        }
      }
      
      return textParts.join(' ')
    } catch (error) {
      console.error('Error parsing STT output:', error)
      return output.trim() // Fallback to raw output
    }
  }
}

export default VoiceProcessor