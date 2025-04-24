export interface Process {
  pid: number
  user: string
  command: string
  cpu: number
  memory: number
  status?: string // Menambahkan status opsional
}

export interface ResourceData {
  time: string
  value: number
}

export interface SystemStatus {
  cpuHistory: ResourceData[]
  memoryHistory: ResourceData[]
  processes: Process[]
}
