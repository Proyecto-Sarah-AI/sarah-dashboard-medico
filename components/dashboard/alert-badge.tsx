"use client"

import { cn } from "@/lib/utils"
import { Frown, Meh, Smile, SmilePlus, CircleOff } from "lucide-react"

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
