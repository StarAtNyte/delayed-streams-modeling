import { exec } from 'child_process'
import { promisify } from 'util'
import os from 'os'

const execAsync = promisify(exec)

class CommandExecutor {
  constructor() {
    this.platform = os.platform()
    this.commands = this.initializeCommands()
  }

  initializeCommands() {
    const baseCommands = {
      // File operations
      'open calculator': () => this.openApplication('calculator'),
      'open calc': () => this.openApplication('calculator'),
      'take screenshot': () => this.takeScreenshot(),
      'take a screenshot': () => this.takeScreenshot(),
      'show desktop': () => this.showDesktop(),
      'lock screen': () => this.lockScreen(),
      'create new folder': () => this.createFolder(),
      'search for documents': () => this.searchFiles('documents'),
      
      // System controls
      'adjust volume to fifty percent': () => this.setVolume(50),
      'set volume to 50': () => this.setVolume(50),
      'close current window': () => this.closeWindow(),
      'minimize window': () => this.minimizeWindow(),
      'maximize window': () => this.maximizeWindow(),
      
      // Application controls
      'open notepad': () => this.openApplication('notepad'),
      'open browser': () => this.openApplication('browser'),
      'open file manager': () => this.openApplication('filemanager'),
    }

    return baseCommands
  }

  async executeCommand(transcript) {
    try {
      const normalizedCommand = transcript.toLowerCase().trim()
      console.log(`Executing command: ${normalizedCommand}`)

      // Find matching command
      const commandKey = Object.keys(this.commands).find(key => 
        normalizedCommand.includes(key) || key.includes(normalizedCommand)
      )

      if (commandKey) {
        const result = await this.commands[commandKey]()
        return {
          success: true,
          message: result || `Successfully executed: ${commandKey}`
        }
      } else {
        // Try to parse and execute custom commands
        const customResult = await this.executeCustomCommand(normalizedCommand)
        if (customResult) {
          return customResult
        }
        
        return {
          success: false,
          message: `Command not recognized: ${transcript}`
        }
      }
    } catch (error) {
      console.error('Command execution error:', error)
      return {
        success: false,
        message: `Error executing command: ${error.message}`
      }
    }
  }

  async executeCustomCommand(command) {
    // Handle dynamic commands like "open [app name]", "set volume to [number]"
    
    if (command.startsWith('open ')) {
      const appName = command.replace('open ', '').trim()
      return {
        success: true,
        message: await this.openApplication(appName)
      }
    }
    
    if (command.includes('volume to ')) {
      const volumeMatch = command.match(/volume to (\d+)/i)
      if (volumeMatch) {
        const volume = parseInt(volumeMatch[1])
        return {
          success: true,
          message: await this.setVolume(volume)
        }
      }
    }
    
    return null
  }

  async openApplication(appName) {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          command = this.getWindowsAppCommand(appName)
          break
        case 'darwin':
          command = this.getMacAppCommand(appName)
          break
        case 'linux':
          command = this.getLinuxAppCommand(appName)
          break
        default:
          throw new Error(`Unsupported platform: ${this.platform}`)
      }
      
      await execAsync(command)
      return `Opened ${appName}`
    } catch (error) {
      throw new Error(`Failed to open ${appName}: ${error.message}`)
    }
  }

  getWindowsAppCommand(appName) {
    const windowsApps = {
      'calculator': 'calc',
      'notepad': 'notepad',
      'browser': 'start chrome',
      'filemanager': 'explorer',
      'paint': 'mspaint',
      'wordpad': 'write'
    }
    
    return windowsApps[appName.toLowerCase()] || `start ${appName}`
  }

  getMacAppCommand(appName) {
    const macApps = {
      'calculator': 'open -a Calculator',
      'notepad': 'open -a TextEdit',
      'browser': 'open -a Safari',
      'filemanager': 'open -a Finder',
      'terminal': 'open -a Terminal'
    }
    
    return macApps[appName.toLowerCase()] || `open -a "${appName}"`
  }

  getLinuxAppCommand(appName) {
    const linuxApps = {
      'calculator': 'gnome-calculator',
      'notepad': 'gedit',
      'browser': 'firefox',
      'filemanager': 'nautilus',
      'terminal': 'gnome-terminal'
    }
    
    return linuxApps[appName.toLowerCase()] || appName
  }

  async takeScreenshot() {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          // Use PowerShell to take screenshot
          command = 'powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait(\'{PRTSC}\')"'
          break
        case 'darwin':
          command = 'screencapture -c'
          break
        case 'linux':
          command = 'gnome-screenshot -c'
          break
        default:
          throw new Error(`Screenshot not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return 'Screenshot taken'
    } catch (error) {
      throw new Error(`Failed to take screenshot: ${error.message}`)
    }
  }

  async showDesktop() {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          command = 'powershell -command "(New-Object -comObject Shell.Application).MinimizeAll()"'
          break
        case 'darwin':
          command = 'osascript -e "tell application \\"System Events\\" to key code 103"'
          break
        case 'linux':
          command = 'wmctrl -k on'
          break
        default:
          throw new Error(`Show desktop not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return 'Desktop shown'
    } catch (error) {
      throw new Error(`Failed to show desktop: ${error.message}`)
    }
  }

  async lockScreen() {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          command = 'rundll32.exe user32.dll,LockWorkStation'
          break
        case 'darwin':
          command = 'pmset displaysleepnow'
          break
        case 'linux':
          command = 'gnome-screensaver-command -l'
          break
        default:
          throw new Error(`Lock screen not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return 'Screen locked'
    } catch (error) {
      throw new Error(`Failed to lock screen: ${error.message}`)
    }
  }

  async setVolume(level) {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          command = `powershell -command "(New-Object -comObject WScript.Shell).SendKeys([char]175)"`
          break
        case 'darwin':
          command = `osascript -e "set volume output volume ${level}"`
          break
        case 'linux':
          command = `amixer set Master ${level}%`
          break
        default:
          throw new Error(`Volume control not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return `Volume set to ${level}%`
    } catch (error) {
      throw new Error(`Failed to set volume: ${error.message}`)
    }
  }

  async createFolder() {
    try {
      const folderName = `New Folder ${Date.now()}`
      let command
      
      switch (this.platform) {
        case 'win32':
          command = `mkdir "${folderName}"`
          break
        case 'darwin':
        case 'linux':
          command = `mkdir "${folderName}"`
          break
        default:
          throw new Error(`Create folder not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return `Created folder: ${folderName}`
    } catch (error) {
      throw new Error(`Failed to create folder: ${error.message}`)
    }
  }

  async searchFiles(query) {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          command = `powershell -command "explorer.exe search-ms:query=${query}"`
          break
        case 'darwin':
          command = `open -a Finder && osascript -e 'tell application "Finder" to activate' -e 'tell application "System Events" to keystroke "f" using command down'`
          break
        case 'linux':
          command = `nautilus --search=${query}`
          break
        default:
          throw new Error(`File search not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return `Searching for: ${query}`
    } catch (error) {
      throw new Error(`Failed to search files: ${error.message}`)
    }
  }

  async closeWindow() {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          command = 'powershell -command "(New-Object -comObject WScript.Shell).SendKeys(\\"%{F4}\\")"'
          break
        case 'darwin':
          command = 'osascript -e "tell application \\"System Events\\" to keystroke \\"w\\" using command down"'
          break
        case 'linux':
          command = 'xdotool key alt+F4'
          break
        default:
          throw new Error(`Close window not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return 'Window closed'
    } catch (error) {
      throw new Error(`Failed to close window: ${error.message}`)
    }
  }

  async minimizeWindow() {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          command = 'powershell -command "(New-Object -comObject WScript.Shell).SendKeys(\\" {F9}\\")"'
          break
        case 'darwin':
          command = 'osascript -e "tell application \\"System Events\\" to keystroke \\"m\\" using command down"'
          break
        case 'linux':
          command = 'xdotool key alt+F9'
          break
        default:
          throw new Error(`Minimize window not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return 'Window minimized'
    } catch (error) {
      throw new Error(`Failed to minimize window: ${error.message}`)
    }
  }

  async maximizeWindow() {
    try {
      let command
      
      switch (this.platform) {
        case 'win32':
          command = 'powershell -command "(New-Object -comObject WScript.Shell).SendKeys(\\" {F10}\\")"'
          break
        case 'darwin':
          command = 'osascript -e "tell application \\"System Events\\" to keystroke \\"f\\" using {control down, command down}"'
          break
        case 'linux':
          command = 'xdotool key alt+F10'
          break
        default:
          throw new Error(`Maximize window not supported on ${this.platform}`)
      }
      
      await execAsync(command)
      return 'Window maximized'
    } catch (error) {
      throw new Error(`Failed to maximize window: ${error.message}`)
    }
  }
}

export default CommandExecutor