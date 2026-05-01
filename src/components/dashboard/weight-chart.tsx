
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts"
import type { WeightHistory } from "@/lib/mock-data"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { useMemo } from "react"

interface WeightChartProps {
  data: WeightHistory[]
  title?: string
}

export function WeightChart({ data, title = "Evolución de Peso e IMC" }: WeightChartProps) {
  // Calculate BMI trend
  const bmiTrend = useMemo(() => {
    if (data.length < 2) return { direction: "stable" as const, change: 0 }
    
    const firstBmi = data[0].bmi
    const lastBmi = data[data.length - 1].bmi
    const change = lastBmi - firstBmi
    
    if (change < -0.5) return { direction: "improving" as const, change }
    if (change > 0.5) return { direction: "deteriorating" as const, change }
    return { direction: "stable" as const, change }
  }, [data])

  // Calculate linear regression for trend line
  const trendLineData = useMemo(() => {
    if (data.length < 2) return data
    
    const n = data.length
    const sumX = data.reduce((acc, _, i) => acc + i, 0)
    const sumY = data.reduce((acc, d) => acc + d.bmi, 0)
    const sumXY = data.reduce((acc, d, i) => acc + i * d.bmi, 0)
    const sumX2 = data.reduce((acc, _, i) => acc + i * i, 0)
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    
    return data.map((d, i) => ({
      ...d,
      bmiTrend: intercept + slope * i
    }))
  }, [data])

  const TrendIcon = bmiTrend.direction === "improving" ? TrendingDown : 
                    bmiTrend.direction === "deteriorating" ? TrendingUp : Minus

  const trendColor = bmiTrend.direction === "improving" ? "text-success" : 
                     bmiTrend.direction === "deteriorating" ? "text-destructive" : "text-muted-foreground"

  const trendBadgeVariant = bmiTrend.direction === "improving" ? "default" : 
                           bmiTrend.direction === "deteriorating" ? "destructive" : "secondary"

  const trendLabel = bmiTrend.direction === "improving" ? "Mejorando" : 
                     bmiTrend.direction === "deteriorating" ? "Deteriorando" : "Estable"

  const trendLineColor = bmiTrend.direction === "improving" ? "var(--success)" : 
                         bmiTrend.direction === "deteriorating" ? "var(--destructive)" : "var(--chart-grid)"

  return (
    <Card className="border-border" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={trendBadgeVariant} className="flex items-center gap-1">
              <TrendIcon className={`h-3 w-3 ${trendColor}`} />
              <span>IMC {trendLabel}</span>
            </Badge>
            {bmiTrend.change !== 0 && (
              <span className={`text-xs font-mono ${trendColor}`}>
                {bmiTrend.change > 0 ? "+" : ""}{bmiTrend.change.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendLineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--chart-grid)" 
                strokeOpacity={0.3}
                vertical={true} 
              />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                axisLine={{ stroke: "var(--chart-grid)", strokeOpacity: 0.5 }}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 5', 'dataMax + 5']}
                label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft', fill: "var(--chart-grid)", fontSize: 10 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
                label={{ value: 'IMC', angle: 90, position: 'insideRight', fill: "var(--chart-grid)", fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)"
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="weight" 
                name="Peso (kg)"
                stroke="var(--chart-weight)" 
                strokeWidth={2}
                dot={{ fill: "var(--chart-weight)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "var(--chart-weight)" }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="bmi" 
                name="IMC"
                stroke="var(--chart-bmi)" 
                strokeWidth={2}
                dot={{ fill: "var(--chart-bmi)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "var(--chart-bmi)" }}
              />
              <Line 
                yAxisId="right"
                type="linear" 
                dataKey="bmiTrend" 
                name="Tendencia IMC"
                stroke={trendLineColor}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
