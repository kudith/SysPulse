import React from 'react'
import { Activity, Server, AlertTriangle } from 'lucide-react'

interface ServerMetrics {
  cpu: number
  memory: number
  disk: number
  uptime: number
}

interface ServerHealthScoreProps {
  metrics: ServerMetrics
}

export const ServerHealthScore = ({ metrics }: ServerHealthScoreProps) => {
  const calculateHealthScore = (metrics: ServerMetrics): number => {
    const weights = {
      cpu: 0.4,
      memory: 0.3, 
      disk: 0.2,
      uptime: 0.1
    }

    const cpuScore = 100 - metrics.cpu // Lower CPU usage is better
    const memoryScore = 100 - metrics.memory
    const diskScore = 100 - metrics.disk
    const uptimeScore = Math.min(metrics.uptime / (30 * 24 * 60 * 60) * 100, 100) // Max 30 days

    return Math.round(
      cpuScore * weights.cpu +
      memoryScore * weights.memory + 
      diskScore * weights.disk +
      uptimeScore * weights.uptime
    )
  }

  const score = calculateHealthScore(metrics)
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { color: 'text-green-500', status: 'Sehat' }
    if (score >= 60) return { color: 'text-yellow-500', status: 'Perlu Perhatian' }
    return { color: 'text-red-500', status: 'Kritis' }
  }

  const { color, status } = getHealthStatus(score)

  return (
    <div className="bg-[#1e1e1e] p-6 rounded-lg border border-zinc-800/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#d8dee9] text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#6be5fd]" />
          Server Health Score
        </h3>
        <Server className="h-5 w-5 text-[#3fdaa4]" />
      </div>

      <div className="text-center my-4">
        <div className={`text-4xl font-bold ${color}`}>
          {score}%
        </div>
        <div className={`text-sm mt-1 ${color}`}>
          {status}
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex justify-between items-center">
          <span className="text-[#a8aebb]">CPU Usage</span>
          <span className={`${metrics.cpu > 80 ? 'text-red-500' : 'text-[#d8dee9]'}`}>
            {metrics.cpu}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#a8aebb]">Memory Usage</span>
          <span className={`${metrics.memory > 80 ? 'text-red-500' : 'text-[#d8dee9]'}`}>
            {metrics.memory}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#a8aebb]">Disk Usage</span>
          <span className={`${metrics.disk > 80 ? 'text-red-500' : 'text-[#d8dee9]'}`}>
            {metrics.disk}%
          </span>
        </div>
      </div>

      {score < 60 && (
        <div className="mt-4 p-3 bg-red-500/10 rounded-md border border-red-500/20 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-500">Perlu tindakan segera!</span>
        </div>
      )}
    </div>
  )
}