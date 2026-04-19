"use client"


import { PatientsTable } from "./patients-table"
import { PatientDetail } from "./patient-detail"
import { DateRangePicker } from "./date-range-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Patient } from "@/lib/mock-data"
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert
} from "lucide-react"
import { useState, useMemo } from "react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts"

interface OverviewSectionProps {
  patients: Patient[]
  treatmentLabel: string
}

export function OverviewSection({ patients: filteredPatients, treatmentLabel }: OverviewSectionProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  })

  // Calculate days in range for display
  const daysInRange = dateRange?.from && dateRange?.to 
    ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 30

  // Filter critical patients (abandonment risk >= 4 OR treatment risk >= 4)
  const criticalPatients = filteredPatients
    .filter(p => p.abandonmentRisk >= 4 || p.treatmentRisk >= 4)
    .sort((a, b) => {
      // Sort by highest risk (abandonment or treatment) descending
      const aMaxRisk = Math.max(a.abandonmentRisk, a.treatmentRisk)
      const bMaxRisk = Math.max(b.abandonmentRisk, b.treatmentRisk)
      return bMaxRisk - aMaxRisk
    })

  const highAbandonmentRisk = filteredPatients.filter(p => p.abandonmentRisk >= 4).length
  const highTreatmentRisk = filteredPatients.filter(p => p.treatmentRisk >= 4).length

  // Generate alert evolution data based on date range
  const alertEvolutionData = useMemo(() => {
    const days = daysInRange
    const dataPoints = Math.min(days, 12) // Max 12 data points
    const interval = Math.floor(days / dataPoints)
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const dayLabel = days <= 14 ? `Dia ${(i + 1) * interval}` : `Sem ${i + 1}`
      // Simulate historical data with some variance
      const abandonmentBase = highAbandonmentRisk
      const treatmentBase = highTreatmentRisk
      const variance = Math.floor(Math.random() * 2)
      
      return {
        period: dayLabel,
        abandonmentRisk: Math.max(0, abandonmentBase + (i < dataPoints / 2 ? variance : -variance)),
        treatmentRisk: Math.max(0, treatmentBase + (i < dataPoints / 2 ? -variance : variance))
      }
    })
  }, [daysInRange, highAbandonmentRisk, highTreatmentRisk])

  if (selectedPatient) {
    return (
      <div className="space-y-4">
        <PatientDetail 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas y Riesgos</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">
              Monitoreo de pacientes en riesgo
            </p>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <Activity className="h-3 w-3" />
              {treatmentLabel}
            </span>
          </div>
        </div>
        
        {/* Date Range Filter */}
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={setDateRange}
        />
      </div>

      {/* Alert/Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-destructive/30 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Riesgo de Abandono Alto</p>
                <p className="text-3xl font-bold text-foreground mt-1">{highAbandonmentRisk}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {highAbandonmentRisk === 1 ? "paciente en riesgo" : "pacientes en riesgo"}
                </p>
              </div>
              {highAbandonmentRisk > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                  Atención
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-warning/30 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <ShieldAlert className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Riesgo de Tratamiento Alto</p>
                <p className="text-3xl font-bold text-foreground mt-1">{highTreatmentRisk}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {highTreatmentRisk === 1 ? "paciente con complicaciones" : "pacientes con complicaciones"}
                </p>
              </div>
              {highTreatmentRisk > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning text-warning-foreground">
                  Revisar
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Evolution Chart */}
      <Card className="border-border" style={{ backgroundColor: "var(--chart-panel-bg)" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Evolucion de Alertas - Ultimos {daysInRange} dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertEvolutionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="var(--chart-grid)" 
                  strokeOpacity={0.3}
                  vertical={true} 
                />
                <XAxis 
                  dataKey="period" 
                  tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--chart-grid)", strokeOpacity: 0.5 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "var(--chart-grid)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)"
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "10px" }}
                  formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: "12px" }}>{value}</span>}
                />
                <Line 
                  type="monotone" 
                  dataKey="abandonmentRisk" 
                  name="Riesgo Abandono Alto"
                  stroke="var(--destructive)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--destructive)", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "var(--destructive)" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="treatmentRisk" 
                  name="Riesgo Tratamiento Alto"
                  stroke="var(--warning)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--warning)", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "var(--warning)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Critical Patients Table */}
      <div>
        <div className="flex flex-col gap-1 mb-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Pacientes Críticos o en Alto Riesgo
          </h2>
          <p className="text-sm text-muted-foreground">
            Ordenados por nivel de riesgo (mayor a menor)
          </p>
        </div>
        {criticalPatients.length > 0 ? (
          <PatientsTable 
            patients={criticalPatients} 
            onSelectPatient={setSelectedPatient}
            selectedPatientId={selectedPatient?.id}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <div className="rounded-full bg-success/10 p-4 w-fit mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Sin pacientes críticos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Todos los pacientes están dentro de parámetros seguros
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
