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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Patient } from "@/lib/mock-data"
import { getPatientSymptoms, getEstadoEmocionalLevel } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { ArrowUpDown, ArrowUp, ArrowDown, HelpCircle, CalendarCheck, Stethoscope } from "lucide-react"
import { EstadoEmocionalInfoModal, getEstadoEmocionalColorClass } from "./alert-badge"

interface PatientsTableProps {
  patients: Patient[]
  onSelectPatient?: (patient: Patient) => void
  selectedPatientId?: string
}

type SortKey = "name" | "bmi" | "bmiChange" | "adherenceFarmacologica" | "appointmentRate" | "symptomsCount" | "estadoEmocional"

// Estado Emocional level legend
const estadoEmocionalLegend = {
  "sin_malestar": { label: "Sin malestar", color: "bg-success/20 text-success" },
  "malestar_moderado": { label: "Malestar moderado", color: "bg-warning/20 text-warning" },
  "malestar_elevado": { label: "Malestar elevado", color: "bg-destructive/20 text-destructive" }
}

// Column definitions with descriptions
const columnDefinitions: Record<string, string> = {
  name: "Nombre completo del paciente, edad y genero",
  bmi: "Indice de Masa Corporal actual del paciente",
  bmiChange: "Variacion porcentual del IMC desde el inicio del tratamiento",
  adherenceFarmacologica: "Cumplimiento de medicamentos, cuidados personales y persistencia en el tratamiento",
  appointmentRate: "Porcentaje y numero de citas medicas asistidas",
  symptomsCount: "Cantidad de sintomas reportados por el paciente",
  estadoEmocional: "Puntuacion GHQ-12 del estado emocional del paciente (0-12)"
}
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

function AdherenceStackedBars({ 
  farmacologica, 
  cuidado, 
  persistencia 
}: { 
  farmacologica: number
  cuidado: number
  persistencia: number
}) {
  const getColor = (val: number) => {
    if (val >= 75) return "bg-success"
    if (val >= 50) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all", getColor(farmacologica))}
            style={{ width: `${farmacologica}%` }}
          />
        </div>
        <span className="text-xs font-medium w-20">Farmacológica → {farmacologica}%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all", getColor(cuidado))}
            style={{ width: `${cuidado}%` }}
          />
        </div>
        <span className="text-xs font-medium w-20">Cuidado → {cuidado}%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all", getColor(persistencia))}
            style={{ width: `${persistencia}%` }}
          />
        </div>
        <span className="text-xs font-medium w-20">Persistencia → {persistencia}%</span>
      </div>
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
  description?: string
  showInfoModal?: boolean
}

function SortableHeader({ label, sortKey, currentSort, direction, onSort, className, description, showInfoModal }: SortableHeaderProps) {
  const isActive = currentSort === sortKey
  
  return (
    <TableHead 
      className={cn(
        "text-muted-foreground font-semibold text-xs uppercase tracking-wider py-3 cursor-pointer select-none hover:bg-muted/50 transition-colors",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1.5 justify-center">
        <span>{label}</span>
        {showInfoModal ? (
          <EstadoEmocionalInfoModal />
        ) : (
          description && (
            <Tooltip>
              <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                <HelpCircle className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px] text-xs">
                {description}
              </TooltipContent>
            </Tooltip>
          )
        )}
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
        case "adherenceFarmacologica":
          aValue = (a.adherenceFarmacologica + a.adherenciaCuidado + a.persistencia) / 3
          bValue = (b.adherenceFarmacologica + b.adherenciaCuidado + b.persistencia) / 3
          break
        case "appointmentRate":
          aValue = a.appointmentRate
          bValue = b.appointmentRate
          break
        case "symptomsCount":
          aValue = a.symptomsCount
          bValue = b.symptomsCount
          break
        case "estadoEmocional":
          aValue = a.estadoEmocional
          bValue = b.estadoEmocional
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
    <TooltipProvider>
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Estado Emocional Legend */}
      <div className="px-4 py-2 bg-muted/20 border-b border-border flex items-center gap-4 flex-wrap text-xs">
        <span className="text-muted-foreground font-medium">Estado Emocional:</span>
        {Object.entries(estadoEmocionalLegend).map(([key, value]) => (
          <span key={key} className="flex items-center gap-1">
            <span className={cn("w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-xs", value.color)}>
              ●
            </span>
            <span className="text-muted-foreground">{value.label}</span>
          </span>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
            <SortableHeader 
              label="Paciente" 
              sortKey="name" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort}
              description={columnDefinitions.name}
            />
            <SortableHeader 
              label="IMC" 
              sortKey="bmi" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
              className="text-center"
              description={columnDefinitions.bmi}
            />
            <SortableHeader 
              label="Cambio IMC" 
              sortKey="bmiChange" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
              className="text-center"
              description={columnDefinitions.bmiChange}
            />
            <SortableHeader 
              label="Adherencia" 
              sortKey="adherenceFarmacologica" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort}
              description={columnDefinitions.adherenceFarmacologica}
            />
            <SortableHeader 
              label="Estado Emocional" 
              sortKey="estadoEmocional" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort} 
              className="text-center"
              description={columnDefinitions.estadoEmocional}
              showInfoModal={true}
            />
            <SortableHeader 
              label="Citas Asistidas" 
              sortKey="appointmentRate" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort}
              className="text-center"
              description={columnDefinitions.appointmentRate}
            />
            <SortableHeader 
              label="Sintomas" 
              sortKey="symptomsCount" 
              currentSort={sortKey} 
              direction={sortDirection} 
              onSort={handleSort}
              className="text-center"
              description={columnDefinitions.symptomsCount}
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
              <TableCell className="py-3 min-w-[200px]">
                <AdherenceStackedBars 
                  farmacologica={patient.adherenceFarmacologica}
                  cuidado={patient.adherenciaCuidado}
                  persistencia={patient.persistencia}
                />
              </TableCell>
              <TableCell className="text-center py-3 px-4">
                {(() => {
                  const colorClass = getEstadoEmocionalColorClass(patient.estadoEmocional)
                  return (
                    <span className={cn(
                      "inline-flex items-center justify-center w-7 h-7 rounded font-mono font-bold text-sm",
                      colorClass
                    )}>
                      {patient.estadoEmocional}
                    </span>
                  )
                })()}
              </TableCell>
              <TableCell className="text-center py-3 px-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={cn(
                      "font-mono text-sm font-medium cursor-help",
                      patient.appointmentRate >= 80 ? "text-success" : 
                      patient.appointmentRate >= 60 ? "text-warning" : "text-destructive"
                    )}>
                      {patient.appointmentRate}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {patient.appointmentsAttended} de {patient.appointmentsTotal} citas asistidas
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center py-3 px-4">
                {(() => {
                  const symptoms = getPatientSymptoms(patient.id)
                  const symptomsCount = symptoms.length
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-0.5 cursor-help">
                          <span className={cn(
                            "inline-flex items-center justify-center w-7 h-7 rounded font-mono font-bold text-sm",
                            symptomsCount === 0 ? "bg-success/20 text-success" :
                            symptomsCount <= 2 ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"
                          )}>
                            {symptomsCount}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-[250px]">
                        {symptomsCount === 0 ? (
                          <span>Sin sintomas reportados</span>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-medium">{symptomsCount} sintoma{symptomsCount > 1 ? "s" : ""} reportado{symptomsCount > 1 ? "s" : ""}:</p>
                            <ul className="text-xs space-y-0.5">
                              {symptoms.slice(0, 5).map((s, i) => (
                                <li key={i} className="flex items-center gap-1">
                                  <span className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    s.severity === 1 ? "bg-success" : s.severity === 2 ? "bg-warning" : "bg-destructive"
                                  )} />
                                  {s.symptom}
                                </li>
                              ))}
                              {symptoms.length > 5 && (
                                <li className="text-muted-foreground">+{symptoms.length - 5} mas...</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )
                })()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </TooltipProvider>
  )
}
