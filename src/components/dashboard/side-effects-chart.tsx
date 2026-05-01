
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts"
import type { SideEffectReport } from "@/lib/mock-data"
import { AlertCircle, Pill } from "lucide-react"

interface SideEffectsChartProps {
  data: SideEffectReport[]
  title?: string
}

export function SideEffectsChart({ data, title = "Efectos Secundarios Reportados" }: SideEffectsChartProps) {
  const getSeverityColor = (severity: string) => {
    if (severity === "mild") return "var(--success)"
    if (severity === "moderate") return "var(--warning)"
    return "var(--destructive)"
  }

  if (data.length === 0) {
    return (
      <Card className="border-border" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Pill className="h-4 w-4 text-muted-foreground" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-success/10 p-3 mb-3">
              <AlertCircle className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Sin efectos secundarios reportados</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <Pill className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--chart-grid)" 
                strokeOpacity={0.3}
                horizontal={true} 
                vertical={true} 
              />
              <XAxis 
                type="number" 
                tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)"
                }}
                formatter={(value: number) => [`${value} veces`, "Reportado"]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>}
              />
              <Bar dataKey="count" name="Reportes" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
