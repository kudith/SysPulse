export interface TerminalCommand {
  type: "command"
  content: string
  timestamp: Date
  directory: string
}

export interface TerminalOutput {
  type: "output"
  content: string
  outputType: "success" | "error" | "info" | "system" | "welcome"
  timestamp: Date
}
