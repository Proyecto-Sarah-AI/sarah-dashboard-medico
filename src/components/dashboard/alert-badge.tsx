
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
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
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

// Motivation (Readiness Ruler) data for the modal
const motivationLevelData = [
  {
    puntaje: 1,
    etiqueta: "No estoy nada preparado para cambiar",
    implicancia: "Riesgo muy alto de abandono (pre-contemplación)",
    accion: "Activar alerta. Preguntar por barreras. Escalar si es necesario."
  },
  {
    puntaje: 2,
    etiqueta: "Estoy pensando en cambiar, pero no ahora",
    implicancia: "En pre-contemplación / contemplación temprana",
    accion: "Explorar ambivalencia. Técnicas de entrevista motivacional."
  },
  {
    puntaje: 3,
    etiqueta: "Quiero cambiar, pero no sé cómo",
    implicancia: "En contemplación / preparación",
    accion: "Educar, ofrecer estrategias concretas y orientación."
  },
  {
    puntaje: 4,
    etiqueta: "Me estoy preparando para cambiar",
    implicancia: "En preparación / acción temprana",
    accion: "Reforzar positivamente. Ayudar a planificar próximos pasos."
  },
  {
    puntaje: 5,
    etiqueta: "Ya estoy tomando medidas activamente",
    implicancia: "En acción / mantenimiento",
    accion: "Refuerzo positivo. Reducir frecuencia de contacto gradualmente."
  }
]

const getMotivationColor = (puntaje: number) => {
  switch (puntaje) {
    case 1:
      return {
        colorClass: "bg-destructive",
        bgClass: "bg-destructive/10 border-destructive/20",
        textClass: "text-destructive"
      }
    case 2:
      return {
        colorClass: "bg-orange-500",
        bgClass: "bg-orange-500/10 border-orange-500/20",
        textClass: "text-orange-500"
      }
    case 3:
      return {
        colorClass: "bg-warning",
        bgClass: "bg-warning/10 border-warning/20",
        textClass: "text-warning"
      }
    case 4:
      return {
        colorClass: "bg-lime-500",
        bgClass: "bg-lime-500/10 border-lime-500/20",
        textClass: "text-lime-500"
      }
    case 5:
      return {
        colorClass: "bg-success",
        bgClass: "bg-success/10 border-success/20",
        textClass: "text-success"
      }
    default:
      return {
        colorClass: "bg-muted",
        bgClass: "bg-muted/10 border-muted/20",
        textClass: "text-muted-foreground"
      }
  }
}

export function MotivacionInfoModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-muted transition-colors"
        title="Explicación de Motivación (Readiness Ruler)"
      >
        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Escala de Disposición al Cambio (Readiness Ruler)</DialogTitle>
            <p className="text-sm text-muted-foreground">Referencia clínica — escala 1 a 5</p>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {motivationLevelData.map((level) => {
              const colors = getMotivationColor(level.puntaje)
              return (
                <div 
                  key={level.puntaje}
                  className={cn(
                    "flex rounded-lg border overflow-hidden",
                    colors.bgClass
                  )}
                >
                  {/* Color stripe */}
                  <div className={cn("w-2 flex-shrink-0", colors.colorClass)} />
                  
                  <div className="flex-1 p-4 space-y-2">
                    {/* Header with score and label */}
                    <div className="flex items-start gap-2">
                      <span className={cn("text-lg font-bold", colors.textClass)}>
                        {level.puntaje}
                      </span>
                      <span className="text-base font-semibold">— {level.etiqueta}</span>
                    </div>

                    {/* Clinical implication */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Implicancia clínica:</span>
                      <span className="text-sm">{level.implicancia}</span>
                    </div>

                    {/* Recommended action - highlighted */}
                    <div className={cn(
                      "p-3 rounded-md border-l-4",
                      colors.colorClass,
                      "bg-background/60"
                    )}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Acción de Sarah:</p>
                      <p className="text-sm font-semibold">{level.accion}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Combination Matrix data
const matrizCombinacionData = [
  {
    situacion: "Deprimido pero quiere cambiar",
    estadoEmocional: "Alto (≥ 7)",
    readinessRuler: "Alto (4–5)",
    interpretacion: "La depresión es barrera tratable; la motivación está presente. Tratar malestar primero; reforzar motivación.",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-200 dark:border-teal-800"
  },
  {
    situacion: "Sin malestar pero no quiere cambiar",
    estadoEmocional: "Bajo (0–2)",
    readinessRuler: "Bajo (1–2)",
    interpretacion: "Sin depresión pero sin motivación. Sarah activa entrevista motivacional y explora ambivalencia.",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    situacion: "Deprimido y sin motivación",
    estadoEmocional: "Alto (≥ 7)",
    readinessRuler: "Bajo (1–2)",
    interpretacion: "Riesgo muy alto de abandono. Sarah escala a psicólogo/psiquiatra de forma urgente.",
    alertaRoja: true,
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800"
  },
  {
    situacion: "Sin malestar y con alta motivación",
    estadoEmocional: "Bajo (0–2)",
    readinessRuler: "Alto (4–5)",
    interpretacion: "Bajo riesgo. Sarah mantiene seguimiento normal y aplica refuerzo positivo.",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800"
  }
]

export function MatrizCombinacionModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        Ver Matriz de Combinación
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Matriz de combinación de resultados</DialogTitle>
            <p className="text-sm text-muted-foreground">Interpretación clínica combinando Estado Emocional (GHQ-12) y Readiness Ruler</p>
          </DialogHeader>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold border border-border">Situación del paciente</th>
                  <th className="px-4 py-3 text-center font-semibold border border-border">Estado Emocional</th>
                  <th className="px-4 py-3 text-center font-semibold border border-border">Readiness Ruler</th>
                  <th className="px-4 py-3 text-left font-semibold border border-border">Interpretación + Acción de Sarah</th>
                </tr>
              </thead>
              <tbody>
                {matrizCombinacionData.map((row, index) => (
                  <tr key={index} className={cn(row.bgColor, row.borderColor)}>
                    <td className="px-4 py-3 border border-border font-bold">
                      {row.situacion}
                    </td>
                    <td className="px-4 py-3 text-center border border-border font-mono">
                      {row.estadoEmocional}
                    </td>
                    <td className="px-4 py-3 text-center border border-border font-mono">
                      {row.readinessRuler}
                    </td>
                    <td className="px-4 py-3 border border-border">
                      {row.interpretacion}
                      {row.alertaRoja && (
                        <span className="ml-1 font-bold text-destructive">Alerta ROJA.</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Risk level configurations for the modal
const riskLevelData = [
  {
    nivel: 1,
    label: "Muy alto",
    colorClass: "bg-destructive",
    bgClass: "bg-destructive/10 border-destructive/20",
    textClass: "text-destructive",
    criterios: "Expresa no querer continuar, dejó de asistir a controles, silencio >7 días",
    umbrales: {
      adherencia: "<40%",
      ghq12: "≥7",
      readiness: "≤2",
      convivencia: "Vive solo"
    },
    accion: "Escalada inmediata. Contacto telefónico. Alerta ROJA."
  },
  {
    nivel: 2,
    label: "Alto",
    colorClass: "bg-orange-500",
    bgClass: "bg-orange-500/10 border-orange-500/20",
    textClass: "text-orange-500",
    criterios: "Ambivalencia expresada, ha faltado 1–2 controles, efectos secundarios no manejados",
    umbrales: {
      adherencia: "40–60%",
      ghq12: "≥7 o 3–6",
      readiness: "≤2",
      convivencia: "Cualquiera"
    },
    accion: "Re-engagement. Contacto diario. Alerta NARANJA."
  },
  {
    nivel: 3,
    label: "Moderado",
    colorClass: "bg-warning",
    bgClass: "bg-warning/10 border-warning/20",
    textClass: "text-warning",
    criterios: "Adherencia parcial, dificultades prácticas (acceso, costo, horarios)",
    umbrales: {
      adherencia: "60–79%",
      ghq12: "3–6",
      readiness: "3",
      convivencia: "Cualquiera"
    },
    accion: "Educar y ofrecer estrategias. Contacto cada 2–3 días. Alerta AMARILLA."
  },
  {
    nivel: 4,
    label: "Bajo",
    colorClass: "bg-lime-500",
    bgClass: "bg-lime-500/10 border-lime-500/20",
    textClass: "text-lime-500",
    criterios: "Adherencia adecuada, asiste a controles, motivación estable, apoyo familiar",
    umbrales: {
      adherencia: "80–89%",
      ghq12: "0–2",
      readiness: "4",
      convivencia: "Acompañado"
    },
    accion: "Seguimiento normal cada 3–5 días. Refuerzo positivo."
  },
  {
    nivel: 5,
    label: "Muy bajo",
    colorClass: "bg-success",
    bgClass: "bg-success/10 border-success/20",
    textClass: "text-success",
    criterios: "Adherencia óptima, asiste a todos los controles, alta motivación sostenida",
    umbrales: {
      adherencia: "≥90%",
      ghq12: "0–2",
      readiness: "5",
      convivencia: "Acompañado"
    },
    accion: "Reducir frecuencia de contacto. Seguimiento semanal. Prevención de fatiga."
  }
]

interface RiesgoAbandonoInfoModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function RiesgoAbandonoInfoModal({ isOpen, onOpenChange }: RiesgoAbandonoInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Criterios de riesgo de abandono</DialogTitle>
          <p className="text-sm text-muted-foreground">Referencia clínica — escala 1 a 5</p>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          {riskLevelData.map((level) => (
            <div 
              key={level.nivel}
              className={cn(
                "flex rounded-lg border overflow-hidden",
                level.bgClass
              )}
            >
              {/* Color stripe */}
              <div className={cn("w-2 flex-shrink-0", level.colorClass)} />
              
              <div className="flex-1 p-4 space-y-3">
                {/* Header with level number and label */}
                <div className="flex items-center gap-2">
                  <span className={cn("text-lg font-bold", level.textClass)}>
                    {level.nivel}
                  </span>
                  <span className="text-base font-semibold">— {level.label}</span>
                </div>

                {/* Clinical criteria */}
                <p className="text-sm text-muted-foreground">
                  {level.criterios}
                </p>

                {/* Threshold pills */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-background/80 text-xs font-medium border">
                    Adherencia {level.umbrales.adherencia}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-background/80 text-xs font-medium border">
                    GHQ-12 {level.umbrales.ghq12}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-background/80 text-xs font-medium border">
                    Readiness {level.umbrales.readiness}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-background/80 text-xs font-medium border">
                    {level.umbrales.convivencia}
                  </span>
                </div>

                {/* Recommended action - highlighted */}
                <div className={cn(
                  "p-3 rounded-md border-l-4",
                  level.colorClass,
                  "bg-background/60"
                )}>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Acción de Sarah:</p>
                  <p className="text-sm font-semibold">{level.accion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
