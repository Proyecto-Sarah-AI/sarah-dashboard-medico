"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { OverviewSection } from "@/components/dashboard/overview-section"
import { PatientsTable } from "@/components/dashboard/patients-table"
import { PatientDetail } from "@/components/dashboard/patient-detail"
import { KPICard } from "@/components/dashboard/kpi-card"
import { patients, aggregateMetrics } from "@/lib/mock-data"
import type { Patient } from "@/lib/mock-data"
import { 
  AlertTriangle, 
  Users, 
  Calendar, 
  MessageSquare,
  Activity,
  Menu,
  X,
  Heart
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const metrics = aggregateMetrics()

  const criticalPatients = patients.filter(p => p.abandonmentRisk >= 4 || p.treatmentRisk >= 4)
  const recentMessages = patients.sort((a, b) => b.messagesCount - a.messagesCount).slice(0, 5)

  const renderContent = () => {
    if (selectedPatient) {
      return (
        <PatientDetail 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )
    }

    switch (activeSection) {
      case "overview":
        return <OverviewSection />
      
      case "patients":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
              <p className="text-sm text-muted-foreground">
                Gestión y seguimiento de todos los pacientes
              </p>
            </div>
            <PatientsTable 
              patients={patients} 
              onSelectPatient={setSelectedPatient}
            />
          </div>
        )
      
      case "alerts":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
              <p className="text-sm text-muted-foreground">
                Pacientes que requieren atención inmediata
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <KPICard
                title="Riesgo de Abandono Alto"
                value={patients.filter(p => p.abandonmentRisk >= 4).length}
                subtitle="Pacientes con riesgo alto o crítico"
                icon={<AlertTriangle className="h-4 w-4" />}
                variant="danger"
              />
              <KPICard
                title="Riesgo de Tratamiento Alto"
                value={patients.filter(p => p.treatmentRisk >= 4).length}
                subtitle="Pacientes con complicaciones"
                icon={<Activity className="h-4 w-4" />}
                variant="warning"
              />
            </div>
            {criticalPatients.length > 0 ? (
              <PatientsTable 
                patients={criticalPatients} 
                onSelectPatient={setSelectedPatient}
              />
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <div className="rounded-full bg-success/10 p-4 w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Sin alertas críticas</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Todos los pacientes están dentro de parámetros normales
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )
      
      case "metrics":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Métricas</h1>
              <p className="text-sm text-muted-foreground">
                Indicadores de rendimiento del programa
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard
                title="Adherencia Promedio"
                value={`${metrics.avgAdherence}%`}
                trend={Number(metrics.avgAdherence) >= 80 ? "up" : "down"}
                trendValue="Meta: 80%"
              />
              <KPICard
                title="Cambio IMC Promedio"
                value={`${metrics.avgBmiChange}%`}
                trend="down"
                trendValue="Reducción"
                variant="success"
                invertTrendColor
              />
              <KPICard
                title="Ánimo Promedio"
                value={`${metrics.avgMood}/5`}
              />
              <KPICard
                title="Motivación Promedio"
                value={`${metrics.avgMotivation}/5`}
              />
            </div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Progreso de Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map(patient => (
                    <div 
                      key={patient.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                          {patient.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            IMC: {patient.bmi.toFixed(1)} → {patient.initialBmi.toFixed(1)} inicial
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-mono text-sm",
                          patient.bmiChange < 0 ? "text-success" : "text-destructive"
                        )}>
                          {patient.bmiChange > 0 ? "+" : ""}{patient.bmiChange}%
                        </p>
                        <p className="text-xs text-muted-foreground">Cambio IMC</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      case "appointments":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Citas Médicas</h1>
              <p className="text-sm text-muted-foreground">
                Gestión de eventos y citas programadas
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <KPICard
                title="Citas Totales"
                value={patients.reduce((sum, p) => sum + p.appointmentsTotal, 0)}
                icon={<Calendar className="h-4 w-4" />}
              />
              <KPICard
                title="Asistencia Promedio"
                value={`${Math.round(patients.reduce((sum, p) => sum + p.appointmentRate, 0) / patients.length)}%`}
                trend="up"
                trendValue="Buen cumplimiento"
                variant="success"
              />
              <KPICard
                title="Citas Perdidas"
                value={patients.reduce((sum, p) => sum + p.missedEvents + p.cancelledEvents, 0)}
                variant="warning"
              />
            </div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Asistencia por Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patients.map(patient => (
                    <div 
                      key={patient.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                          {patient.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {patient.appointmentsAttended}/{patient.appointmentsTotal} citas asistidas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={cn(
                            "font-mono text-sm",
                            patient.appointmentRate >= 80 ? "text-success" : 
                            patient.appointmentRate >= 60 ? "text-warning" : "text-destructive"
                          )}>
                            {patient.appointmentRate}%
                          </p>
                          <p className="text-xs text-muted-foreground">Asistencia</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      case "interactions":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Interacciones con Sarah</h1>
              <p className="text-sm text-muted-foreground">
                Actividad de los pacientes con el asistente conversacional
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <KPICard
                title="Total Mensajes"
                value={patients.reduce((sum, p) => sum + p.messagesCount, 0)}
                icon={<MessageSquare className="h-4 w-4" />}
              />
              <KPICard
                title="Promedio por Paciente"
                value={Math.round(patients.reduce((sum, p) => sum + p.messagesCount, 0) / patients.length)}
                subtitle="mensajes"
              />
              <KPICard
                title="Pacientes Activos"
                value={patients.filter(p => p.messagesCount > 50).length}
                subtitle="más de 50 mensajes"
                variant="success"
              />
            </div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Actividad de Mensajes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMessages.map(patient => (
                    <div 
                      key={patient.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                          {patient.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Última interacción: {patient.lastInteraction}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-mono text-lg font-bold">{patient.messagesCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarNav 
          activeSection={activeSection} 
          onSectionChange={(section) => {
            setActiveSection(section)
            setSelectedPatient(null)
          }} 
        />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground">Sarah</span>
              <p className="text-xs text-muted-foreground">Dashboards</p>
            </div>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar border-sidebar-border p-0">
              <SidebarNav 
                activeSection={activeSection} 
                onSectionChange={(section) => {
                  setActiveSection(section)
                  setSelectedPatient(null)
                  setMobileMenuOpen(false)
                }} 
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-56 pt-16 md:pt-0">
        <div className="p-4 md:p-6 max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
