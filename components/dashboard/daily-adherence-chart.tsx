"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts"
import type { DailyAdherence } from "@/lib/mock-data"
import { Calendar } from "lucide-react"

interface DailyAdherenceChartProps {
  data: DailyAdherence[]
  title?: string
}

export function DailyAdherenceChart({ data, title = "Adherencia Diaria (30 días)" }: DailyAdherenceChartProps) {
  const getBarColor = (value: number) => {
    if (value >= 80) return "hsl(var(--success))"
    if (value >= 60) return "hsl(var(--warning))"
    return "hsl(var(--destructive))"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                interval={4}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 50, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))"
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`${value}%`, "Adherencia"]}
              />
              <ReferenceLine 
                y={80} 
                stroke="hsl(var(--success))" 
                strokeDasharray="3 3"
              />
              <Bar dataKey="adherence" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.adherence)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
