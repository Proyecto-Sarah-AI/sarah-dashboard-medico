"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { AlertBadge, MoodBadge, EstadoEmocionalBadge, EstadoEmocionalInfoModal, RiesgoAbandonoInfoModal } from "./alert-badge"
import { WeightChart } from "./weight-chart"
import { AdherenceChart } from "./adherence-chart"
import { MoodChart } from "./mood-chart"
import { DailyAdherenceChart } from "./daily-adherence-chart"
import { WeeklyAdherenceChart } from "./weekly-adherence-chart"
import { AdherenceChartsContainer } from "./adherence-charts-container"
import { SideEffectsChart } from "./side-effects-chart"
import { SymptomsList } from "./symptoms-list"
import { InteractionsTable } from "./interactions-table"
import { IntentsByType } from "./intents-by-type"
import { ClinicalRecordCard } from "./clinical-record-card"
import { MedicationPlanCard } from "./medication-plan-card"
import { MessagingPanel } from "./messaging-panel"
import { ClinicalMetricsSection } from "./clinical-metrics-section"
import type { Patient } from "@/lib/mock-data"
import { getPatientClinicalMetrics } from "@/lib/clinical-metrics-data"
import { 
  getWeightHistory, 
  getAdherenceHistory, 
  getMoodHistory, 
  getPatientSymptoms,
  getDailyAdherenceHistory,
  getWeeklyAdherenceHistory,
  getSideEffectsReport,
  getPatientInteractions,
  getPatientIntents,
  getMedicalEventFrequency,
  getPatientClinicalRecord,
  getPatientMedicationPlan,
  getPatientMessages,
  getPatientCaregivers,
  getEstadoEmocionalLevel,
  getRiesgoLabel,
  getRiesgoColor,
  getCondicionLabel,
  getAccionRecomendada
} from "@/lib/mock-data"
import { 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Activity,
  CalendarCheck,
  CalendarX,
  ArrowLeft,
  Clock,
  AlertTriangle,
  ShieldAlert,
  CalendarClock,
  User,
  BarChart3,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

interface PatientDetailProps {
  patient: Patient
  onClose?: () => void
}

function getMotivationDescription(value: number): string {
  switch (value) {
    case 1:
      return "El paciente no esta nada preparado para cambiar."
    case 2:
      return "El paciente esta pensando en cambiar, pero no ahora."
    case 3:
      return "El paciente quiere cambiar, pero no sabe como."
    case 4:
      return "El paciente se esta preparando para cambiar."
    case 5:
      return "El paciente esta tomando medidas activamente."
    default:
      return ""
  }
}

export function PatientDetail({ patient, onClose }: PatientDetailProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  })
  const [isRiesgoModalOpen, setIsRiesgoModalOpen] = useState(false)

  const weightHistory = getWeightHistory(patient.id)
  const adherenceHistory = getAdherenceHistory(patient.id)
  const moodHistory = getMoodHistory(patient.id)
  const symptoms = getPatientSymptoms(patient.id)
  const dailyAdherence = getDailyAdherenceHistory(patient.id)
  const weeklyAdherence = getWeeklyAdherenceHistory(patient.id)
  const sideEffects = getSideEffectsReport(patient.id)
  const interactions = getPatientInteractions(patient.id)
  const patientIntents = getPatientIntents(patient.id)
  const medicalEventFrequency = getMedicalEventFrequency(patient.id)
  const clinicalRecord = getPatientClinicalRecord(patient.id)
  const medicationPlan = getPatientMedicationPlan(patient.id)
  const patientMessages = getPatientMessages(patient.id)
  const caregivers = getPatientCaregivers(patient.id)
  const clinicalMetrics = getPatientClinicalMetrics(patient.id)

  // Calculate days without registering (simulated based on last interaction)
  const lastInteractionDate = new Date(patient.lastInteraction)
  const today = new Date()
  const daysSinceLastActivity = Math.floor((today.getTime() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-4">
      {/* Back Button */}
      {onClose && (
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Button>
      )}

      {/* Header */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {patient.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {patient.age} anos · {patient.gender === "M" ? "Masculino" : "Femenino"} · ID: {patient.id}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {patient.treatmentDays} dias en tratamiento
                  </Badge>
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Ultima actividad: {patient.lastInteraction}
                  </Badge>
                  {daysSinceLastActivity > 7 && (
                    <Badge variant="destructive" className="text-xs">
                      {daysSinceLastActivity} dias sin registrar
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Badge */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-start gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-1 cursor-help">
                      <span className="text-xs text-muted-foreground font-medium">Riesgo de abandono</span>
                      <span className={cn(
                        "inline-flex items-center justify-center px-3 py-1.5 rounded-md font-bold text-sm",
                        getRiesgoColor(patient.riesgoAbandono.nivel)
                      )}>
                        Nivel {patient.riesgoAbandono.nivel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getRiesgoLabel(patient.riesgoAbandono.nivel)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[320px]">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 border-b border-border pb-2">
                        <span className={cn(
                          "inline-flex items-center justify-center px-2 py-0.5 rounded font-bold text-xs",
                          getRiesgoColor(patient.riesgoAbandono.nivel)
                        )}>
                          Nivel {patient.riesgoAbandono.nivel}
                        </span>
                        <span className="font-medium text-sm">
                          {getRiesgoLabel(patient.riesgoAbandono.nivel)}
                        </span>
                      </div>
                      
                      {patient.riesgoAbandono.condicionesActivas.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Condiciones activas:</p>
                          <ul className="text-xs space-y-0.5">
                            {patient.riesgoAbandono.condicionesActivas.map((condicion, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                                {getCondicionLabel(condicion)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {patient.riesgoAbandono.condicionesActivas.length === 0 && (
                        <p className="text-xs text-muted-foreground">Sin condiciones de riesgo activas</p>
                      )}
                      
                      <div className="pt-1 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-0.5">Accion recomendada:</p>
                        <p className="text-xs">{getAccionRecomendada(patient.riesgoAbandono.nivel)}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <button
                  onClick={() => setIsRiesgoModalOpen(true)}
                  className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-muted transition-colors"
                  title="Ver criterios de riesgo"
                >
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <RiesgoAbandonoInfoModal 
                isOpen={isRiesgoModalOpen} 
                onOpenChange={setIsRiesgoModalOpen} 
              />
            </div>
            
            {/* Date Range Selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd MMM", { locale: es })} - {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                      </>
                    ) : (
                      format(dateRange.from, "dd MMM yyyy", { locale: es })
                    )
                  ) : (
                    "Seleccionar rango"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
                <div className="p-3 border-t border-border flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setDateRange({
                      from: new Date(new Date().setDate(new Date().getDate() - 7)),
                      to: new Date()
                    })}
                  >
                    7 dias
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setDateRange({
                      from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                      to: new Date()
                    })}
                  >
                    30 dias
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setDateRange({
                      from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
                      to: new Date()
                    })}
                  >
                    3 meses
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Information vs Statistics */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="info" className="gap-2">
            <User className="h-4 w-4" />
            Informacion
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Estadisticas
          </TabsTrigger>
          <TabsTrigger value="communication" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Comunicacion
          </TabsTrigger>
        </TabsList>

        {/* Information Tab */}
        <TabsContent value="info" className="space-y-4 mt-4">
          {/* Clinical Metrics Section - replaces Quick Stats with extended metrics */}
          <ClinicalMetricsSection metrics={clinicalMetrics} patient={patient} />

          {/* Risk Alerts & Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-warning" />
                  Factores de Riesgo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(() => {
                    const avgAdherence = (patient.adherenceFarmacologica + patient.adherenciaCuidado + patient.persistencia) / 3
                    return (
                      <>
                        {avgAdherence < 70 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-destructive" />
                            <span className="text-muted-foreground">Baja adherencia al tratamiento ({Math.round(avgAdherence)}%)</span>
                          </div>
                        )}
                        {patient.appointmentRate < 70 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-warning" />
                            <span className="text-muted-foreground">Tasa de asistencia baja ({patient.appointmentRate}%)</span>
                          </div>
                        )}
                        {patient.mood <= 2 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-warning" />
                            <span className="text-muted-foreground">Estado de animo bajo</span>
                          </div>
                        )}
                        {patient.motivation <= 2 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-warning" />
                            <span className="text-muted-foreground">Motivacion baja</span>
                          </div>
                        )}
                        {patient.symptomsCount >= 3 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-destructive" />
                            <span className="text-muted-foreground">Multiples sintomas reportados ({patient.symptomsCount})</span>
                          </div>
                        )}
                        {daysSinceLastActivity > 7 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-destructive" />
                            <span className="text-muted-foreground">Sin actividad reciente ({daysSinceLastActivity} dias)</span>
                          </div>
                        )}
                        {patient.estadoEmocional >= 8 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-destructive" />
                            <span className="text-muted-foreground">Malestar emocional elevado</span>
                          </div>
                        )}
                        {avgAdherence >= 70 && patient.appointmentRate >= 70 && patient.mood > 2 && patient.motivation > 2 && patient.symptomsCount < 3 && daysSinceLastActivity <= 7 && patient.estadoEmocional < 8 && (
                          <div className="flex items-center gap-2 text-sm text-success">
                            <span className="w-2 h-2 rounded-full bg-success" />
                            <span>Sin factores de riesgo identificados</span>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emotional State */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center">
                Estado Emocional
                <EstadoEmocionalInfoModal />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Animo</p>
                    <p className="text-lg font-bold text-foreground" style={{
                      color: patient.estadoEmocional <= 3 ? 'var(--success)' : 
                             patient.estadoEmocional <= 7 ? 'var(--warning)' : 
                             'var(--destructive)'
                    }}>
                      {patient.estadoEmocional}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Escala GHQ-12 · Mayor puntaje = mayor malestar</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <MoodBadge value={patient.motivation} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Motivacion (Readiness Ruler)</p>
                      <p className="text-sm font-medium text-foreground">{patient.motivation}/5</p>
                      <p className="text-xs text-muted-foreground mt-1 break-words">
                        {getMotivationDescription(patient.motivation)}
                      </p>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Informacion sobre la escala de motivacion</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-[250px]">
                      <p>La escala va de 1 a 5. Mientras mas cercano a 1, menor motivacion tiene el paciente para cambiar, aumentando sus probabilidades de abandono del tratamiento.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Record & Medication Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ClinicalRecordCard 
              record={clinicalRecord} 
              patient={patient}
              onImport={(externalId) => console.log("[v0] Import clinical record:", externalId)}
              onRefresh={() => console.log("[v0] Refresh clinical record")}
            />
            <MedicationPlanCard 
              plan={medicationPlan}
              patientId={patient.id}
              onUpdateMedication={(medId, updates) => console.log("Update medication:", medId, updates)}
              onAddMedication={(med) => console.log("Add medication:", med)}
              onDeleteMedication={(medId) => console.log("Delete medication:", medId)}
              onUpdateNotes={(notes) => console.log("Update notes:", notes)}
            />
          </div>



          {/* Symptoms Table */}
          <SymptomsList symptoms={symptoms} />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4 mt-4">
          {/* Adherence & Appointments */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Adherencia y Asistencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Adherencia Farmacológica</span>
                  <span className="text-sm font-medium text-foreground">{patient.adherenceFarmacologica}%</span>
                </div>
                <Progress value={patient.adherenceFarmacologica} className="h-2 bg-muted" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Adherencia al Cuidado</span>
                  <span className="text-sm font-medium text-foreground">{patient.adherenciaCuidado}%</span>
                </div>
                <Progress value={patient.adherenciaCuidado} className="h-2 bg-muted" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Persistencia</span>
                  <span className="text-sm font-medium text-foreground">{patient.persistencia}%</span>
                </div>
                <Progress value={patient.persistencia} className="h-2 bg-muted" />
              </div>
              <Separator className="bg-border" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-success">
                    <CalendarCheck className="h-4 w-4" />
                    <span className="text-lg font-bold">{patient.appointmentsAttended}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Asistidas</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-warning">
                    <CalendarX className="h-4 w-4" />
                    <span className="text-lg font-bold">{patient.cancelledEvents}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Canceladas</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-destructive">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-lg font-bold">{patient.missedEvents}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">No asistidas</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Tasa de asistencia</span>
                  <span className="text-sm font-medium text-foreground">{patient.appointmentRate}%</span>
                </div>
                <Progress value={patient.appointmentRate} className="h-2 bg-muted" />
              </div>
            </CardContent>
          </Card>

          {/* Interaction with Sarah & Medical Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Interaccion con Sarah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-primary">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-2xl font-bold">{patient.messagesCount}</span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">mensajes totales</p>
                    <p className="text-xs text-muted-foreground">
                      Ultima interaccion: {patient.lastInteraction}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  Frecuencia de Eventos Medicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-2xl font-bold text-foreground">{medicalEventFrequency.eventsPerWeek}</span>
                    <p className="text-xs text-muted-foreground">eventos/semana</p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                      <span className="text-muted-foreground">Programados: {medicalEventFrequency.scheduledEvents}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">Completados: {medicalEventFrequency.completedEvents}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Adherence Charts */}
          <AdherenceChartsContainer 
            dailyData={dailyAdherence}
            weeklyData={weeklyAdherence}
            adherenceHistoryData={adherenceHistory}
          />

          {/* Side Effects Chart */}
          <SideEffectsChart data={sideEffects} />

          {/* Weight & Mood Charts */}
          <WeightChart data={weightHistory} />
          <MoodChart data={moodHistory} />

          {/* Intents by Type */}
          <IntentsByType data={patientIntents} totalMessages={patient.messagesCount} />
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-4 mt-4">
          {/* Messaging Panel */}
          <MessagingPanel
            patient={patient}
            messages={patientMessages}
            caregivers={caregivers}
            onSendMessage={(msg) => console.log("[v0] Send message:", msg)}
          />

          {/* Interactions History */}
          <InteractionsTable interactions={interactions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
