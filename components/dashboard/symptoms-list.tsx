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
import type { SymptomReport } from "@/lib/mock-data"
import { AlertCircle, Stethoscope } from "lucide-react"

interface SymptomsListProps {
  symptoms: SymptomReport[]
  title?: string
}

const severityConfig = {
  1: { label: "Leve", color: "bg-success/20 text-success", badgeColor: "bg-success text-success-foreground" },
  2: { label: "Moderado", color: "bg-warning/20 text-warning", badgeColor: "bg-warning text-warning-foreground" },
  3: { label: "Severo", color: "bg-destructive/20 text-destructive", badgeColor: "bg-destructive text-destructive-foreground" }
}

// Group symptoms by name and calculate aggregates
function aggregateSymptoms(symptoms: SymptomReport[]) {
  const grouped = symptoms.reduce((acc, symptom) => {
    if (!acc[symptom.symptom]) {
      acc[symptom.symptom] = {
        symptom: symptom.symptom,
        count: 0,
        lastDate: symptom.date,
        maxSeverity: symptom.severity
      }
    }
    acc[symptom.symptom].count++
    if (symptom.date > acc[symptom.symptom].lastDate) {
      acc[symptom.symptom].lastDate = symptom.date
    }
    if (symptom.severity > acc[symptom.symptom].maxSeverity) {
      acc[symptom.symptom].maxSeverity = symptom.severity
    }
    return acc
  }, {} as Record<string, { symptom: string; count: number; lastDate: string; maxSeverity: 1 | 2 | 3 }>)

  return Object.values(grouped).sort((a, b) => b.count - a.count)
}

export function SymptomsList({ symptoms, title = "Síntomas Reportados" }: SymptomsListProps) {
  const aggregatedSymptoms = aggregateSymptoms(symptoms)

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
            {symptoms.length} reportes
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-2">Síntoma</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Último Reporte</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Veces Reportado</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-2">Severidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggregatedSymptoms.map((item) => {
                const config = severityConfig[item.maxSeverity]
                return (
                  <TableRow key={item.symptom} className="hover:bg-muted/20">
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", config.color.split(" ")[0].replace("/20", ""))} />
                        <span className="text-sm font-medium text-foreground">{item.symptom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <span className="text-sm text-muted-foreground">{item.lastDate}</span>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-muted text-sm font-medium text-foreground">
                        {item.count}
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        config.badgeColor
                      )}>
                        {config.label}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
