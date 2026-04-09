"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AlertBadge, MoodBadge } from "./alert-badge"
import { WeightChart } from "./weight-chart"
import { AdherenceChart } from "./adherence-chart"
import { MoodChart } from "./mood-chart"
import { DailyAdherenceChart } from "./daily-adherence-chart"
import { WeeklyAdherenceChart } from "./weekly-adherence-chart"
import { SideEffectsChart } from "./side-effects-chart"
import { SymptomsList } from "./symptoms-list"
import type { Patient } from "@/lib/mock-data"
import { 
  getWeightHistory, 
  getAdherenceHistory, 
  getMoodHistory, 
  getPatientSymptoms,
  getDailyAdherenceHistory,
  getWeeklyAdherenceHistory,
  getSideEffectsReport
} from "@/lib/mock-data"
import { 
  Scale, 
  Ruler, 
  Calendar, 
  MessageSquare, 
  TrendingDown,
  Activity,
  CalendarCheck,
  CalendarX,
  ArrowLeft,
  Clock,
  AlertTriangle,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface PatientDetailProps {
  patient: Patient
  onClose?: () => void
}

export function PatientDetail({ patient, onClose }: PatientDetailProps) {
  const weightHistory = getWeightHistory(patient.id)
  const adherenceHistory = getAdherenceHistory(patient.id)
  const moodHistory = getMoodHistory(patient.id)
  const symptoms = getPatientSymptoms(patient.id)
  const dailyAdherence = getDailyAdherenceHistory(patient.id)
  const weeklyAdherence = getWeeklyAdherenceHistory(patient.id)
  const sideEffects = getSideEffectsReport(patient.id)

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
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {patient.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {patient.age} años · {patient.gender === "M" ? "Masculino" : "Femenino"} · ID: {patient.id}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {patient.treatmentDays} días en tratamiento
                  </Badge>
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Última actividad: {patient.lastInteraction}
                  </Badge>
                  {daysSinceLastActivity > 7 && (
                    <Badge variant="destructive" className="text-xs">
                      {daysSinceLastActivity} días sin registrar
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Peso actual</p>
                <p className="text-lg font-bold text-foreground">{patient.weight} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-chart-3" />
              <div>
                <p className="text-xs text-muted-foreground">IMC actual</p>
                <p className="text-lg font-bold text-foreground">{patient.bmi.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Cambio IMC</p>
                <p className="text-lg font-bold text-success">{patient.bmiChange}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Estatura</p>
                <p className="text-lg font-bold text-foreground">{patient.height} m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts & Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Niveles de Alerta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Riesgo de Abandono</p>
                <AlertBadge level={patient.abandonmentRisk} type="abandonment" size="md" />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Riesgo de Tratamiento</p>
                <AlertBadge level={patient.treatmentRisk} type="treatment" size="md" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              Factores de Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {patient.adherence < 70 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Baja adherencia al tratamiento ({patient.adherence}%)</span>
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
                  <span className="text-muted-foreground">Estado de ánimo bajo</span>
                </div>
              )}
              {patient.motivation <= 2 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">Motivación baja</span>
                </div>
              )}
              {patient.symptomsCount >= 3 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Múltiples síntomas reportados ({patient.symptomsCount})</span>
                </div>
              )}
              {daysSinceLastActivity > 7 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Sin actividad reciente ({daysSinceLastActivity} días)</span>
                </div>
              )}
              {patient.adherence >= 70 && patient.appointmentRate >= 70 && patient.mood > 2 && patient.motivation > 2 && patient.symptomsCount < 3 && daysSinceLastActivity <= 7 && (
                <div className="flex items-center gap-2 text-sm text-success">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span>Sin factores de riesgo identificados</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adherence & Appointments */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Adherencia y Asistencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Adherencia al tratamiento</span>
              <span className="text-sm font-medium text-foreground">{patient.adherence}%</span>
            </div>
            <Progress value={patient.adherence} className="h-2 bg-muted" />
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
                <Calendar className="h-4 w-4" />
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

      {/* Emotional State */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Estado Emocional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MoodBadge value={patient.mood} />
              <div>
                <p className="text-xs text-muted-foreground">Ánimo</p>
                <p className="text-sm font-medium text-foreground">{patient.mood}/5</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MoodBadge value={patient.motivation} />
              <div>
                <p className="text-xs text-muted-foreground">Motivación</p>
                <p className="text-sm font-medium text-foreground">{patient.motivation}/5</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interaction with Sarah */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Interacción con Sarah</CardTitle>
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
                Última interacción: {patient.lastInteraction}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adherence Charts */}
      <DailyAdherenceChart data={dailyAdherence} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeeklyAdherenceChart data={weeklyAdherence} />
        <AdherenceChart data={adherenceHistory} title="Tendencia de Adherencia" />
      </div>

      {/* Side Effects Chart */}
      <SideEffectsChart data={sideEffects} />

      {/* Weight & Mood Charts */}
      <WeightChart data={weightHistory} />
      <MoodChart data={moodHistory} />

      {/* Symptoms Table */}
      <SymptomsList symptoms={symptoms} />
    </div>
  )
}
