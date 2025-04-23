export interface Process {
  pid: number
  user: string
  command: string
  cpu: number
  memory: number
}

export interface ResourceData {
  time: string
  value: number
}
