"use client"

import { cn } from "@/lib/utils"
import { Frown, Meh, Smile, SmilePlus, CircleOff, HelpCircle } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AlertBadgeProps {
  level: number
  type?: "abandonment" | "treatment"
  showLabel?: boolean
  size?: "sm" | "md"
}

const levelConfig = {
  1: { label: "Muy bajo", color: "bg-success text-success-foreground" },
  2: { label: "Bajo", color: "bg-chart-2 text-chart-2-foreground" },
  3: { label: "Moderado", color: "bg-warning text-warning-foreground" },
  4: { label: "Alto", color: "bg-chart-4 text-foreground" },
  5: { label: "Crítico", color: "bg-destructive text-destructive-foreground" }
}

export function AlertBadge({ level, type, showLabel = true, size = "sm" }: AlertBadgeProps) {
  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig[3]
  
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm"
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      config.color,
      sizeStyles[size]
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {showLabel && config.label}
    </span>
  )
}

interface MoodBadgeProps {
  value: number
  showLabel?: boolean
}

const moodConfig = {
  1: { label: "Muy bajo", icon: Frown, color: "text-destructive" },
  2: { label: "Bajo", icon: Frown, color: "text-warning" },
  3: { label: "Normal", icon: Meh, color: "text-muted-foreground" },
  4: { label: "Bueno", icon: Smile, color: "text-success" },
  5: { label: "Muy bueno", icon: SmilePlus, color: "text-success" }
}

export function MoodBadge({ value, showLabel = false }: MoodBadgeProps) {
  const roundedValue = Math.round(value) as 1 | 2 | 3 | 4 | 5
  const config = moodConfig[roundedValue] || moodConfig[3]
  const IconComponent = config.icon

  return (
    <span className={cn("inline-flex items-center gap-1", config.color)}>
      <IconComponent className="h-4 w-4" />
      {showLabel && <span className="text-xs text-muted-foreground">{config.label}</span>}
    </span>
  )
}

interface EstadoEmocionalBadgeProps {
  score: number
  showLabel?: boolean
  size?: "sm" | "md"
}

const estadoEmocionalConfig = {
  "sin_malestar": { label: "Sin malestar", color: "bg-success text-success-foreground" },
  "malestar_moderado": { label: "Malestar moderado", color: "bg-warning text-warning-foreground" },
  "malestar_elevado": { label: "Malestar elevado", color: "bg-destructive text-destructive-foreground" }
}

export function EstadoEmocionalBadge({ score, showLabel = true, size = "sm" }: EstadoEmocionalBadgeProps) {
  let level: "sin_malestar" | "malestar_moderado" | "malestar_elevado"
  if (score <= 3) level = "sin_malestar"
  else if (score <= 7) level = "malestar_moderado"
  else level = "malestar_elevado"

  const config = estadoEmocionalConfig[level]
  
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm"
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      config.color,
      sizeStyles[size]
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {showLabel && config.label}
    </span>
  )
}

export function getEstadoEmocionalColorClass(score: number): string {
  if (score <= 3) return "bg-success/20 text-success"
  if (score <= 7) return "bg-warning/20 text-warning"
  return "bg-destructive/20 text-destructive"
}

export function EstadoEmocionalInfoModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-muted transition-colors"
        title="Explicación de Estado Emocional"
      >
        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cómo Leer Estado Emocional (GHQ-12)</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-success">0-3</span>
                <span className="text-sm font-medium">Sin malestar</span>
              </div>
              <p className="text-xs text-muted-foreground">El paciente se adapta bien al tratamiento y muestra indicadores psicológicos positivos.</p>
            </div>

            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-warning">4-7</span>
                <span className="text-sm font-medium">Malestar moderado</span>
              </div>
              <p className="text-xs text-muted-foreground">El paciente muestra cierto malestar; considere monitoreo e intervenciones de apoyo.</p>
            </div>

            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-destructive">8-12</span>
                <span className="text-sm font-medium">Malestar elevado</span>
              </div>
              <p className="text-xs text-muted-foreground">El paciente experimenta malestar psicológico significativo; se recomienda atención clínica inmediata.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
