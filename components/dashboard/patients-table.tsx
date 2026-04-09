"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertBadge, MoodBadge } from "./alert-badge"
import type { Patient } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface PatientsTableProps {
  patients: Patient[]
  onSelectPatient?: (patient: Patient) => void
  selectedPatientId?: string
}

function AdherenceBar({ value }: { value: number }) {
  const getColor = (val: number) => {
    if (val >= 80) return "bg-success"
    if (val >= 60) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all", getColor(value))}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={cn(
        "text-xs font-medium w-9 text-right",
        value >= 80 ? "text-success" : value >= 60 ? "text-warning" : "text-destructive"
      )}>
        {value}%
      </span>
    </div>
  )
}

export function PatientsTable({ patients, onSelectPatient, selectedPatientId }: PatientsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Paciente</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-3">IMC</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-3">Cambio IMC</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3">Adherencia</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-3">Estado</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-3">Riesgo Abandono</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider text-center py-3">Riesgo Tratamiento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow 
              key={patient.id}
              className={cn(
                "cursor-pointer transition-all hover:bg-muted/40",
                selectedPatientId === patient.id && "bg-primary/10 hover:bg-primary/15"
              )}
              onClick={() => onSelectPatient?.(patient)}
            >
              <TableCell className="py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {patient.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {patient.age} años · {patient.gender === "M" ? "Masculino" : "Femenino"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center py-3">
                <span className="font-mono text-sm font-medium text-foreground">{patient.bmi.toFixed(1)}</span>
              </TableCell>
              <TableCell className="text-center py-3">
                <span className={cn(
                  "inline-flex items-center justify-center px-2 py-0.5 rounded-md font-mono text-sm font-medium",
                  patient.bmiChange < 0 
                    ? "bg-success/10 text-success" 
                    : patient.bmiChange > 0 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-muted text-muted-foreground"
                )}>
                  {patient.bmiChange > 0 ? "+" : ""}{patient.bmiChange.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell className="py-3">
                <AdherenceBar value={patient.adherence} />
              </TableCell>
              <TableCell className="text-center py-3">
                <div className="flex items-center justify-center gap-2">
                  <MoodBadge value={patient.mood} />
                  <MoodBadge value={patient.motivation} />
                </div>
              </TableCell>
              <TableCell className="text-center py-3">
                <AlertBadge level={patient.abandonmentRisk} type="abandonment" />
              </TableCell>
              <TableCell className="text-center py-3">
                <AlertBadge level={patient.treatmentRisk} type="treatment" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
