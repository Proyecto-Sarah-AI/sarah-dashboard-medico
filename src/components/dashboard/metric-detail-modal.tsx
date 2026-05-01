
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { MetricHistoryPoint, MetricStatus } from "@/lib/clinical-metrics-data"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ReferenceArea,
  Legend,
  ResponsiveContainer
} from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface MetricDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  unit: string
  status: MetricStatus
  history: MetricHistoryPoint[]
  normalRange?: { min: number; max: number }
  warningRange?: { min: number; max: number }
}

export function MetricDetailModal({
  open,
  onOpenChange,
  title,
  unit,
  status,
  history,
  normalRange,
  warningRange
}: MetricDetailModalProps) {
  // Format dates for display
  const formattedData = history.map(d => ({
    ...d,
    displayDate: format(new Date(d.date), "dd MMM", { locale: es })
  }))
  
  // Calculate Y-axis domain
  const values = history.map(d => d.value)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  
  // Include range boundaries in domain calculation
  let domainMin = minVal
  let domainMax = maxVal
  
  if (normalRange) {
    domainMin = Math.min(domainMin, normalRange.min)
    domainMax = Math.max(domainMax, normalRange.max)
  }
  if (warningRange) {
    domainMax = Math.max(domainMax, warningRange.max)
  }
  
  const padding = (domainMax - domainMin) * 0.15
  domainMin = Math.max(0, domainMin - padding)
  domainMax = domainMax + padding
  
  const chartConfig = {
    value: {
      label: title,
      color: status === "normal" ? "var(--color-success)" : status === "warning" ? "var(--color-warning)" : "var(--color-destructive)"
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
            <span className="text-sm font-normal text-muted-foreground">({unit})</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Legend for clinical bands */}
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-success/20 border border-success/40" />
              <span className="text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-warning/20 border border-warning/40" />
              <span className="text-muted-foreground">Riesgo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/40" />
              <span className="text-muted-foreground">Crítico</span>
            </div>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={formattedData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              
              {/* Critical zone (below normal or above warning) */}
              {normalRange && (
                <ReferenceArea
                  y1={domainMin}
                  y2={normalRange.min}
                  fill="var(--color-destructive)"
                  fillOpacity={0.1}
                />
              )}
              {warningRange && (
                <ReferenceArea
                  y1={warningRange.max}
                  y2={domainMax}
                  fill="var(--color-destructive)"
                  fillOpacity={0.1}
                />
              )}
              
              {/* Warning zone */}
              {normalRange && warningRange && (
                <ReferenceArea
                  y1={normalRange.max}
                  y2={warningRange.max}
                  fill="var(--color-warning)"
                  fillOpacity={0.15}
                />
              )}
              
              {/* Normal zone */}
              {normalRange && (
                <ReferenceArea
                  y1={normalRange.min}
                  y2={normalRange.max}
                  fill="var(--color-success)"
                  fillOpacity={0.1}
                />
              )}
              
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[domainMin, domainMax]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                width={40}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`${value} ${unit}`, title]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-value)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
          
          {/* Range info */}
          {normalRange && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Rango normal:</span> {normalRange.min} - {normalRange.max} {unit}
                {warningRange && (
                  <span className="ml-4">
                    <span className="font-medium">Riesgo:</span> {warningRange.min} - {warningRange.max} {unit}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Blood Pressure Modal
interface BloodPressureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  history: { date: string; systolic: number; diastolic: number }[]
  status: MetricStatus
  normalRange: {
    systolic: { min: number; max: number }
    diastolic: { min: number; max: number }
  }
}

export function BloodPressureModal({
  open,
  onOpenChange,
  history,
  status,
  normalRange
}: BloodPressureModalProps) {
  const formattedData = history.map(d => ({
    ...d,
    displayDate: format(new Date(d.date), "dd MMM", { locale: es })
  }))
  
  const allValues = history.flatMap(d => [d.systolic, d.diastolic])
  const minVal = Math.min(...allValues, normalRange.diastolic.min)
  const maxVal = Math.max(...allValues, normalRange.systolic.max)
  const padding = (maxVal - minVal) * 0.15
  
  const chartConfig = {
    systolic: {
      label: "Sistólica",
      color: "var(--color-chart-1)"
    },
    diastolic: {
      label: "Diastólica",
      color: "var(--color-chart-2)"
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Presión Arterial
            <span className="text-sm font-normal text-muted-foreground">(mmHg)</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--color-chart-1)" }} />
              <span className="text-muted-foreground">Sistólica</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--color-chart-2)" }} />
              <span className="text-muted-foreground">Diastólica</span>
            </div>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={formattedData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              
              {/* Normal systolic range */}
              <ReferenceArea
                y1={normalRange.systolic.min}
                y2={normalRange.systolic.max}
                fill="var(--color-success)"
                fillOpacity={0.1}
              />
              
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[minVal - padding, maxVal + padding]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Sistólica"
                stroke="var(--color-systolic)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastólica"
                stroke="var(--color-diastolic)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
          
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Normal:</span> Sistólica {normalRange.systolic.min}-{normalRange.systolic.max} mmHg, Diastólica {normalRange.diastolic.min}-{normalRange.diastolic.max} mmHg
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Transaminases Modal
interface TransaminasasModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  historyAST: MetricHistoryPoint[]
  historyALT: MetricHistoryPoint[]
  status: MetricStatus
  normalRange: {
    ast: { min: number; max: number }
    alt: { min: number; max: number }
  }
}

export function TransaminasasModal({
  open,
  onOpenChange,
  historyAST,
  historyALT,
  status,
  normalRange
}: TransaminasasModalProps) {
  const formattedData = historyAST.map((d, i) => ({
    date: d.date,
    displayDate: format(new Date(d.date), "dd MMM", { locale: es }),
    ast: d.value,
    alt: historyALT[i]?.value || 0
  }))
  
  const allValues = [...historyAST.map(d => d.value), ...historyALT.map(d => d.value)]
  const minVal = Math.min(...allValues, normalRange.ast.min, normalRange.alt.min)
  const maxVal = Math.max(...allValues, normalRange.ast.max, normalRange.alt.max)
  const padding = (maxVal - minVal) * 0.15
  
  const chartConfig = {
    ast: {
      label: "AST (GOT)",
      color: "var(--color-chart-1)"
    },
    alt: {
      label: "ALT (GPT)",
      color: "var(--color-chart-2)"
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Transaminasas
            <span className="text-sm font-normal text-muted-foreground">(U/L)</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--color-chart-1)" }} />
              <span className="text-muted-foreground">AST (GOT)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--color-chart-2)" }} />
              <span className="text-muted-foreground">ALT (GPT)</span>
            </div>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={formattedData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              
              {/* Normal range band (use average of AST and ALT ranges) */}
              <ReferenceArea
                y1={Math.min(normalRange.ast.min, normalRange.alt.min)}
                y2={Math.max(normalRange.ast.max, normalRange.alt.max)}
                fill="var(--color-success)"
                fillOpacity={0.1}
              />
              
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[Math.max(0, minVal - padding), maxVal + padding]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="ast"
                name="AST (GOT)"
                stroke="var(--color-ast)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="alt"
                name="ALT (GPT)"
                stroke="var(--color-alt)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
          
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Normal:</span> AST {normalRange.ast.min}-{normalRange.ast.max} U/L, ALT {normalRange.alt.min}-{normalRange.alt.max} U/L
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
