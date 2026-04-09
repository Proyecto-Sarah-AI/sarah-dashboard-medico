"use client"

import { useState, useMemo } from "react"
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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface PatientsTableProps {
  patients: Patient[]
  onSelectPatient?: (patient: Patient) => void
  selectedPatientId?: string
}

type SortKey = "name" | "bmi" | "bmiChange" | "adherence" | "mood" | "abandonmentRisk" | "treatmentRisk"
type SortDirection = "asc" | "desc" | null

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

interface SortableHeaderProps {
  label: string
  sortKey: SortKey
  currentSort: SortKey | null
  direction: SortDirection
  onSort: (key: SortKey) => void
  className?: string
}

function SortableHeader({ label, sortKey, currentSort, direction, onSort, className }: SortableHeaderProps) {
  const isActive = currentSort === sortKey
  
  return (
    <TableHead 
      className={cn(
        "text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3 cursor-pointer select-none hover:bg-muted/50 transition-colors",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <span className={cn("transition-colors", isActive ? "text-foreground" : "text-muted-foreground/50")}>
          {isActive && direction === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : isActive && direction === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5" />
          )}
        </span>
      </div>
    </TableHead>
  )
}

export function PatientsTable({ patients, onSelectPatient, selectedPatientId }: PatientsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortKey(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const sortedPatients = useMemo(() => {
    if (!sortKey || !sortDirection) return patients

    return [...patients].sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortKey) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "bmi":
          aValue = a.bmi
          bValue = b.bmi
          break
        case "bmiChange":
          aValue = a.bmiChange
          bValue = b.bmiChange
          break
        case "adherence":
          aValue = a.adherence
          bValue = b.adherence
          break
        case "mood":
          aValue = a.mood + a.motivation
          bValue = b.mood + b.motivation
          break
        case "abandonmentRisk":
          aValue = a.abandonmentRisk
          bValue = b.abandonmentRisk
          break
        case "treatmentRisk":
          aValue = a.treatmentRisk
          bValue = b.treatmentRisk
          break
        default:
          return 0
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue)
      }

      return sortDirection === "asc" 
        ? (aValue as number) - (bValue as number) 
        : (bValue as number) - (aValue as number)
    })
  }, [patients, sortKey, sortDirection])

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
            <SortableHeader 
              label="Paciente" 
              sortKey="name" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
            />
            <SortableHeader 
              label="IMC" 
              sortKey="bmi" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
              className="text-center"
            />
            <SortableHeader 
              label="Cambio IMC" 
              sortKey="bmiChange" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
              className="text-center"
            />
            <SortableHeader 
              label="Adherencia" 
              sortKey="adherence" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
            />
            <SortableHeader 
              label="Estado" 
              sortKey="mood" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
              className="text-center"
            />
            <SortableHeader 
              label="Riesgo Abandono" 
              sortKey="abandonmentRisk" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
              className="text-center"
            />
            <SortableHeader 
              label="Riesgo Tratamiento" 
              sortKey="treatmentRisk" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
              className="text-center"
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPatients.map((patient) => (
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
