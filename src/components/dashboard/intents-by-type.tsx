
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import type { PatientIntentData } from "@/lib/mock-data"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface IntentsByTypeProps {
  data: PatientIntentData[]
  totalMessages: number
}

const intentColors: Record<string, string> = {
  report_adherence: "var(--success)",
  report_non_adherence: "var(--destructive)",
  report_symptom: "var(--warning)",
  negative_emotion: "var(--chart-4)",
  positive_emotion: "var(--chart-mood)",
  show_resistance: "var(--destructive)",
  request_help: "var(--chart-adherence)",
  express_doubt: "var(--chart-motivation)",
  confirm: "var(--success)",
  partial_response: "var(--chart-grid)"
}

export function IntentsByType({ data, totalMessages }: IntentsByTypeProps) {
  if (data.length === 0) {
    return (
      <Card className="border-border" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            Interacciones por Intención
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">Sin datos de intenciones</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          Interacciones por Intención
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {totalMessages} mensajes totales
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Horizontal Bar Chart */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
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
                dataKey="label" 
                type="category" 
                tick={{ fill: "var(--chart-grid)", fontSize: 10 }} 
                axisLine={false} 
                tickLine={false}
                width={115}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)"
                }}
                formatter={(value: number, name: string, props: { payload: PatientIntentData }) => [
                  `${value} mensajes (${props.payload.percentage}%)`, 
                  "Cantidad"
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>}
              />
              <Bar dataKey="count" name="Mensajes" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.intent} fill={intentColors[entry.intent] || "var(--primary)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-2">Intención</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Mensajes</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Porcentaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.intent} className="hover:bg-muted/20">
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: intentColors[item.intent] || "var(--primary)" }}
                      />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-2">
                    <span className="text-sm font-medium text-foreground">{item.count}</span>
                  </TableCell>
                  <TableCell className="text-center py-2">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      item.percentage >= 15 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {item.percentage}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
