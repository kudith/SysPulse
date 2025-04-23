"use client"

import { useEffect, useState } from "react"
import { cpuData, memoryData } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"

export function ResourceGraph() {
  const [cpuHistory, setCpuHistory] = useState(cpuData)
  const [memoryHistory, setMemoryHistory] = useState(memoryData)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuHistory((prev) => {
        const newData = [...prev]
        const lastTime = newData[newData.length - 1].time
        const newTime = new Date(new Date(lastTime).getTime() + 5000)

        // Generate a somewhat realistic CPU value based on the last value
        const lastValue = newData[newData.length - 1].value
        let newValue = lastValue + (Math.random() * 10 - 5)
        newValue = Math.max(0, Math.min(100, newValue))

        newData.push({
          time: newTime.toLocaleTimeString(),
          value: newValue,
        })

        if (newData.length > 20) {
          newData.shift()
        }

        return newData
      })

      setMemoryHistory((prev) => {
        const newData = [...prev]
        const lastTime = newData[newData.length - 1].time
        const newTime = new Date(new Date(lastTime).getTime() + 5000)

        // Memory tends to be more stable than CPU
        const lastValue = newData[newData.length - 1].value
        let newValue = lastValue + (Math.random() * 4 - 2)
        newValue = Math.max(0, Math.min(100, newValue))

        newData.push({
          time: newTime.toLocaleTimeString(),
          value: newValue,
        })

        if (newData.length > 20) {
          newData.shift()
        }

        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-terminal-dark p-2 border border-terminal-green/30 text-terminal-green text-xs">
          <p>{`${label}`}</p>
          <p>{`${payload[0].name}: ${payload[0].value?.toFixed(1)}%`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Tabs defaultValue="cpu" className="w-full">
      <TabsList className="bg-black border border-terminal-green/30 mb-4">
        <TabsTrigger
          value="cpu"
          className="data-[state=active]:bg-terminal-green/20 data-[state=active]:text-terminal-green text-terminal-green/70"
        >
          CPU Usage
        </TabsTrigger>
        <TabsTrigger
          value="memory"
          className="data-[state=active]:bg-terminal-green/20 data-[state=active]:text-terminal-green text-terminal-green/70"
        >
          Memory Usage
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cpu" className="mt-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cpuHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="time" stroke="#00ff99" tick={{ fill: "#00ff99", fontSize: 12 }} />
              <YAxis
                stroke="#00ff99"
                tick={{ fill: "#00ff99", fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                name="CPU"
                stroke="#00ff99"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#00ff99" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="memory" className="mt-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={memoryHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="time" stroke="#00ff99" tick={{ fill: "#00ff99", fontSize: 12 }} />
              <YAxis
                stroke="#00ff99"
                tick={{ fill: "#00ff99", fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                name="Memory"
                stroke="#00ff99"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#00ff99" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
