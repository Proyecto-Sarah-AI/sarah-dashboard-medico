
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { MoodHistory } from "@/lib/mock-data"

interface MoodChartProps {
  data: MoodHistory[]
  title?: string
}

export function MoodChart({ data, title = "Ánimo y Motivación" }: MoodChartProps) {
  return (
    <Card className="border-border" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
                tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)"
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value: number) => [value.toFixed(1), ""]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                name="Ánimo"
                stroke="var(--chart-mood)" 
                strokeWidth={2}
                dot={{ fill: "var(--chart-mood)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "var(--chart-mood)" }}
              />
              <Line 
                type="monotone" 
                dataKey="motivation" 
                name="Motivación"
                stroke="var(--chart-motivation)" 
                strokeWidth={2}
                dot={{ fill: "var(--chart-motivation)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "var(--chart-motivation)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
