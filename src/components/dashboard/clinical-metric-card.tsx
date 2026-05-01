
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MetricStatus, MetricTrend, MetricHistoryPoint } from "@/lib/clinical-metrics-data"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"

interface ClinicalMetricCardProps {
  name: string
  value: number | string
  unit: string
  trend: MetricTrend
  status: MetricStatus
  history: MetricHistoryPoint[]
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

const statusColors = {
  normal: {
    bg: "bg-success/10",
    border: "border-success/30",
    text: "text-success",
    dot: "bg-success",
    chart: "var(--color-success)"
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    text: "text-warning",
    dot: "bg-warning",
    chart: "var(--color-warning)"
  },
  critical: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    text: "text-destructive",
    dot: "bg-destructive",
    chart: "var(--color-destructive)"
  }
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
}

export function ClinicalMetricCard({
  name,
  value,
  unit,
  trend,
  status,
  history,
  icon,
  onClick,
  className
}: ClinicalMetricCardProps) {
  const statusStyle = statusColors[status]
  const TrendIcon = trendIcons[trend]
  
  // Get last 6 points for sparkline
  const sparklineData = history.slice(-6)
  
  // Calculate Y-axis domain for better visualization
  const values = sparklineData.map(d => d.value)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const padding = (maxVal - minVal) * 0.1 || 1
  
  return (
    <Card 
      className={cn(
        "bg-card border-border cursor-pointer transition-all hover:shadow-md hover:border-primary/30",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Label */}
            <div className="flex items-center gap-1.5 mb-1">
              {icon && (
                <span className="text-muted-foreground shrink-0">
                  {icon}
                </span>
              )}
              <p className="text-xs text-muted-foreground truncate">{name}</p>
            </div>
            
            {/* Value */}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
            
            {/* Trend and Status */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium",
                statusStyle.bg,
                statusStyle.text
              )}>
                <TrendIcon className="h-3 w-3" />
                <span className="capitalize">
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
                </span>
              </div>
              <div className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
            </div>
          </div>
          
          {/* Sparkline */}
          <div className="w-16 h-10 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={[minVal - padding, maxVal + padding]} hide />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={statusStyle.chart}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Special card for Blood Pressure (two values)
interface BloodPressureCardProps {
  systolic: number
  diastolic: number
  unit: string
  trend: MetricTrend
  status: MetricStatus
  history: { date: string; systolic: number; diastolic: number }[]
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function BloodPressureCard({
  systolic,
  diastolic,
  unit,
  trend,
  status,
  history,
  icon,
  onClick,
  className
}: BloodPressureCardProps) {
  const statusStyle = statusColors[status]
  const TrendIcon = trendIcons[trend]
  
  const sparklineData = history.slice(-6)
  
  const allValues = sparklineData.flatMap(d => [d.systolic, d.diastolic])
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const padding = (maxVal - minVal) * 0.1 || 5
  
  return (
    <Card 
      className={cn(
        "bg-card border-border cursor-pointer transition-all hover:shadow-md hover:border-primary/30",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              {icon && (
                <span className="text-muted-foreground shrink-0">
                  {icon}
                </span>
              )}
              <p className="text-xs text-muted-foreground truncate">Presión arterial</p>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{systolic}/{diastolic}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-1.5">
              <div className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium",
                statusStyle.bg,
                statusStyle.text
              )}>
                <TrendIcon className="h-3 w-3" />
              </div>
              <div className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
            </div>
          </div>
          
          <div className="w-16 h-10 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={[minVal - padding, maxVal + padding]} hide />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke={statusStyle.chart}
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke={statusStyle.chart}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Special card for Transaminases (AST/ALT)
interface TransaminasasCardProps {
  ast: number
  alt: number
  unit: string
  trend: MetricTrend
  status: MetricStatus
  historyAST: MetricHistoryPoint[]
  historyALT: MetricHistoryPoint[]
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function TransaminasasCard({
  ast,
  alt,
  unit,
  trend,
  status,
  historyAST,
  historyALT,
  icon,
  onClick,
  className
}: TransaminasasCardProps) {
  const statusStyle = statusColors[status]
  const TrendIcon = trendIcons[trend]
  
  const sparklineAST = historyAST.slice(-6)
  const sparklineALT = historyALT.slice(-6)
  
  // Combine for chart data
  const sparklineData = sparklineAST.map((d, i) => ({
    date: d.date,
    ast: d.value,
    alt: sparklineALT[i]?.value || 0
  }))
  
  const allValues = [...sparklineAST.map(d => d.value), ...sparklineALT.map(d => d.value)]
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const padding = (maxVal - minVal) * 0.1 || 5
  
  return (
    <Card 
      className={cn(
        "bg-card border-border cursor-pointer transition-all hover:shadow-md hover:border-primary/30",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              {icon && (
                <span className="text-muted-foreground shrink-0">
                  {icon}
                </span>
              )}
              <p className="text-xs text-muted-foreground truncate">Transaminasas</p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground">AST:</span>
                <span className="text-sm font-bold text-foreground">{ast}</span>
                <span className="text-xs text-muted-foreground">{unit}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground">ALT:</span>
                <span className="text-sm font-bold text-foreground">{alt}</span>
                <span className="text-xs text-muted-foreground">{unit}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <div className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium",
                statusStyle.bg,
                statusStyle.text
              )}>
                <TrendIcon className="h-3 w-3" />
              </div>
              <div className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
            </div>
          </div>
          
          <div className="w-16 h-12 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={[minVal - padding, maxVal + padding]} hide />
                <Line
                  type="monotone"
                  dataKey="ast"
                  stroke={statusStyle.chart}
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="alt"
                  stroke={statusStyle.chart}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
