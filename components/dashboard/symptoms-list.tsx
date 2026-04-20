"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { SymptomReport, SymptomCategory } from "@/lib/mock-data"
import { AlertCircle, Stethoscope } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SymptomsListProps {
  symptoms: SymptomReport[]
  title?: string
}

// Category configuration with labels and order
const categoryConfig: Record<SymptomCategory, { label: string; order: number }> = {
  gastrointestinal: { label: "Gastrointestinal", order: 1 },
  neurologico: { label: "Neurológico", order: 2 },
  metabolico: { label: "Metabólico", order: 3 },
  psicologico: { label: "Psicológico", order: 4 },
  cardiovascular: { label: "Cardiovascular", order: 5 },
  musculoesqueletico: { label: "Musculoesquelético", order: 6 },
}

// Severity configuration for 0-7 scale
function getSeverityConfig(severity: number) {
  if (severity <= 2) {
    return { 
      label: "Leve", 
      bgColor: "bg-success/15", 
      textColor: "text-success",
      badgeColor: "bg-success text-success-foreground"
    }
  } else if (severity <= 5) {
    return { 
      label: "Moderado", 
      bgColor: "bg-warning/15", 
      textColor: "text-warning",
      badgeColor: "bg-warning text-warning-foreground"
    }
  } else {
    return { 
      label: "Severo", 
      bgColor: "bg-destructive/15", 
      textColor: "text-destructive",
      badgeColor: "bg-destructive text-destructive-foreground"
    }
  }
}

// Mini sparkline component for severity evolution
function SeveritySparkline({ history }: { history: { severity: number; date: string }[] }) {
  if (history.length < 2) {
    return <span className="text-xs text-muted-foreground">--</span>
  }

  const maxSeverity = 7
  const width = 80
  const height = 24
  const padding = 2
  
  // Calculate points for the sparkline
  const points = history.map((h, i) => {
    const x = padding + (i / (history.length - 1)) * (width - padding * 2)
    const y = height - padding - (h.severity / maxSeverity) * (height - padding * 2)
    return { x, y, severity: h.severity, date: h.date }
  })

  // Create path for the line
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  // Determine trend color based on first vs last value
  const firstValue = history[history.length - 1].severity // oldest
  const lastValue = history[0].severity // most recent
  const trendColor = lastValue < firstValue 
    ? "stroke-success" // improving (lower severity)
    : lastValue > firstValue 
      ? "stroke-destructive" // worsening
      : "stroke-muted-foreground" // stable

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <svg 
            width={width} 
            height={height} 
            className="cursor-help"
            aria-label="Evolución de severidad"
          >
            {/* Background reference lines */}
            <line 
              x1={padding} 
              y1={height - padding - (2 / maxSeverity) * (height - padding * 2)} 
              x2={width - padding} 
              y2={height - padding - (2 / maxSeverity) * (height - padding * 2)} 
              className="stroke-success/20" 
              strokeWidth="1" 
              strokeDasharray="2,2"
            />
            <line 
              x1={padding} 
              y1={height - padding - (5 / maxSeverity) * (height - padding * 2)} 
              x2={width - padding} 
              y2={height - padding - (5 / maxSeverity) * (height - padding * 2)} 
              className="stroke-warning/20" 
              strokeWidth="1" 
              strokeDasharray="2,2"
            />
            
            {/* Main line */}
            <path
              d={pathD}
              fill="none"
              className={cn(trendColor, "stroke-2")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={2}
                className={cn(
                  "fill-current",
                  p.severity <= 2 ? "text-success" : p.severity <= 5 ? "text-warning" : "text-destructive"
                )}
              />
            ))}
          </svg>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium text-xs">Historial de severidad</p>
            <div className="space-y-0.5">
              {history.slice(0, 5).map((h, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-muted-foreground">{h.date}</span>
                  <span className={cn(
                    "font-medium",
                    h.severity <= 2 ? "text-success" : h.severity <= 5 ? "text-warning" : "text-destructive"
                  )}>
                    {h.severity}/7
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Aggregate symptoms by name within each category
interface AggregatedSymptom {
  symptom: string
  category: SymptomCategory
  count: number
  lastDate: string
  lastSeverity: number
  severityHistory: { severity: number; date: string }[]
}

function aggregateSymptoms(symptoms: SymptomReport[]): Map<SymptomCategory, AggregatedSymptom[]> {
  // First, group by symptom name
  const bySymptom = symptoms.reduce((acc, s) => {
    const key = `${s.category}-${s.symptom}`
    if (!acc[key]) {
      acc[key] = {
        symptom: s.symptom,
        category: s.category,
        count: 0,
        lastDate: s.date,
        lastSeverity: s.severity,
        severityHistory: []
      }
    }
    acc[key].count++
    acc[key].severityHistory.push({ severity: s.severity, date: s.date })
    
    // Update last date and severity if this is more recent
    if (s.date > acc[key].lastDate) {
      acc[key].lastDate = s.date
      acc[key].lastSeverity = s.severity
    }
    return acc
  }, {} as Record<string, AggregatedSymptom>)

  // Sort severity history by date (most recent first)
  Object.values(bySymptom).forEach(item => {
    item.severityHistory.sort((a, b) => b.date.localeCompare(a.date))
  })

  // Group by category
  const byCategory = new Map<SymptomCategory, AggregatedSymptom[]>()
  
  Object.values(bySymptom).forEach(item => {
    if (!byCategory.has(item.category)) {
      byCategory.set(item.category, [])
    }
    byCategory.get(item.category)!.push(item)
  })

  // Sort symptoms within each category by severity (highest first)
  byCategory.forEach((items) => {
    items.sort((a, b) => b.lastSeverity - a.lastSeverity)
  })

  return byCategory
}

export function SymptomsList({ symptoms, title = "Síntomas Reportados" }: SymptomsListProps) {
  const aggregatedByCategory = aggregateSymptoms(symptoms)
  
  // Sort categories by their defined order
  const sortedCategories = Array.from(aggregatedByCategory.entries())
    .sort((a, b) => categoryConfig[a[0]].order - categoryConfig[b[0]].order)

  const totalReports = symptoms.length
  const uniqueSymptoms = Array.from(new Set(symptoms.map(s => s.symptom))).length

  if (symptoms.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-success/10 p-3 mb-3">
              <AlertCircle className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Sin síntomas reportados</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
          {title}
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {totalReports} reportes / {uniqueSymptoms} síntomas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-2">
                  Síntoma
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">
                  Último Reporte
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">
                  Veces Reportado
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">
                  Severidad
                </TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">
                  Evolución
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCategories.map(([category, items]) => (
                <>
                  {/* Category header row */}
                  <TableRow 
                    key={`cat-${category}`} 
                    className="bg-muted/50 hover:bg-muted/50 border-t border-border"
                  >
                    <TableCell 
                      colSpan={5} 
                      className="py-1.5 px-4"
                    >
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {categoryConfig[category].label}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({items.length} {items.length === 1 ? 'síntoma' : 'síntomas'})
                      </span>
                    </TableCell>
                  </TableRow>
                  
                  {/* Symptom rows for this category */}
                  {items.map((item) => {
                    const config = getSeverityConfig(item.lastSeverity)
                    return (
                      <TableRow 
                        key={`${category}-${item.symptom}`} 
                        className={cn(
                          "hover:bg-muted/20",
                          item.lastSeverity >= 6 && "bg-destructive/5"
                        )}
                      >
                        <TableCell className="py-2 pl-6">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              item.lastSeverity <= 2 ? "bg-success" : 
                              item.lastSeverity <= 5 ? "bg-warning" : "bg-destructive"
                            )} />
                            <span className="text-sm font-medium text-foreground">
                              {item.symptom}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-2">
                          <span className="text-sm text-muted-foreground">
                            {item.lastDate}
                          </span>
                        </TableCell>
                        <TableCell className="text-center py-2">
                          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-muted text-sm font-medium text-foreground">
                            {item.count}
                          </span>
                        </TableCell>
                        <TableCell className="text-center py-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={cn(
                              "inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold",
                              config.bgColor,
                              config.textColor
                            )}>
                              {item.lastSeverity}
                            </span>
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                              config.badgeColor
                            )}>
                              {config.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-2">
                          <div className="flex justify-center">
                            <SeveritySparkline history={item.severityHistory} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>0-2 Leve</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span>3-5 Moderado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span>6-7 Severo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
