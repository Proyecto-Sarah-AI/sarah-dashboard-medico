
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
  Cell,
  Legend
} from "recharts"
import type { DailyAdherence } from "@/lib/mock-data"
import { Calendar } from "lucide-react"

interface DailyAdherenceChartProps {
  data: DailyAdherence[]
  title?: string
}

export function DailyAdherenceChart({ data, title = "Adherencia Diaria (30 días)" }: DailyAdherenceChartProps) {
  const getBarColor = (value: number) => {
    if (value >= 80) return "var(--success)"
    if (value >= 60) return "var(--warning)"
    return "var(--destructive)"
  }

  return (
    <Card className="border-border" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
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
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--chart-grid)" 
                strokeOpacity={0.3}
                vertical={false} 
              />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "var(--chart-grid)", fontSize: 9 }}
                axisLine={{ stroke: "var(--chart-grid)", strokeOpacity: 0.5 }}
                tickLine={false}
                interval={4}
              />
              <YAxis 
                tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 50, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)"
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value: number) => [`${value}%`, "Adherencia"]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>}
              />
              <ReferenceLine 
                y={80} 
                stroke="var(--chart-target)" 
                strokeDasharray="3 3"
                strokeWidth={2}
              />
              <Bar dataKey="adherence" name="Adherencia Diaria" radius={[2, 2, 0, 0]}>
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
