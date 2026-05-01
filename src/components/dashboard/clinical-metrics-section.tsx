
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClinicalMetricCard, BloodPressureCard, TransaminasasCard } from "./clinical-metric-card"
import { MetricDetailModal, BloodPressureModal, TransaminasasModal } from "./metric-detail-modal"
import type { PatientClinicalMetrics, ClinicalMetric, BloodPressureMetric, TransaminasasMetric } from "@/lib/clinical-metrics-data"
import { 
  Scale, 
  Activity, 
  TrendingDown, 
  Ruler,
  Heart,
  Droplets,
  Dumbbell,
  TestTube
} from "lucide-react"

interface ClinicalMetricsSectionProps {
  metrics: PatientClinicalMetrics
  patient: {
    weight: number
    bmi: number
    bmiChange: number
    height: number
  }
}

type ModalState = {
  type: "simple" | "bloodPressure" | "transaminasas" | null
  metric?: ClinicalMetric
  bloodPressure?: BloodPressureMetric
  transaminasas?: TransaminasasMetric
}

export function ClinicalMetricsSection({ metrics, patient }: ClinicalMetricsSectionProps) {
  const [modalState, setModalState] = useState<ModalState>({ type: null })
  
  const openMetricModal = (metric: ClinicalMetric) => {
    setModalState({ type: "simple", metric })
  }
  
  const openBloodPressureModal = () => {
    setModalState({ type: "bloodPressure", bloodPressure: metrics.bloodPressure })
  }
  
  const openTransaminasasModal = () => {
    setModalState({ type: "transaminasas", transaminasas: metrics.transaminasas })
  }
  
  const closeModal = () => {
    setModalState({ type: null })
  }
  
  return (
    <div className="space-y-6">
      {/* Quick Stats - Extended existing cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ClinicalMetricCard
          name="Peso actual"
          value={patient.weight}
          unit="kg"
          trend={metrics.weight.trend}
          status={metrics.weight.status}
          history={metrics.weight.history}
          icon={<Scale className="h-4 w-4" />}
          onClick={() => openMetricModal(metrics.weight)}
        />
        <ClinicalMetricCard
          name="IMC actual"
          value={patient.bmi.toFixed(1)}
          unit="kg/m²"
          trend={metrics.bmi.trend}
          status={metrics.bmi.status}
          history={metrics.bmi.history}
          icon={<Activity className="h-4 w-4" />}
          onClick={() => openMetricModal(metrics.bmi)}
        />
        <ClinicalMetricCard
          name="Cambio IMC"
          value={`${patient.bmiChange > 0 ? '+' : ''}${patient.bmiChange}`}
          unit="%"
          trend={patient.bmiChange < 0 ? "down" : patient.bmiChange > 0 ? "up" : "stable"}
          status={patient.bmiChange <= 0 ? "normal" : "warning"}
          history={metrics.bmi.history.map((h, i, arr) => ({
            date: h.date,
            value: i === 0 ? 0 : Math.round(((h.value - arr[0].value) / arr[0].value) * 100 * 10) / 10
          }))}
          icon={<TrendingDown className="h-4 w-4" />}
          onClick={() => openMetricModal(metrics.bmi)}
        />
        <ClinicalMetricCard
          name="Estatura"
          value={patient.height}
          unit="m"
          trend="stable"
          status="normal"
          history={metrics.height.history}
          icon={<Ruler className="h-4 w-4" />}
          onClick={() => openMetricModal(metrics.height)}
        />
      </div>
      
      {/* Modals */}
      {modalState.type === "simple" && modalState.metric && (
        <MetricDetailModal
          open={true}
          onOpenChange={closeModal}
          title={modalState.metric.name}
          unit={modalState.metric.unit}
          status={modalState.metric.status}
          history={modalState.metric.history}
          normalRange={modalState.metric.normalRange}
          warningRange={modalState.metric.warningRange}
        />
      )}
      
      {modalState.type === "bloodPressure" && modalState.bloodPressure && (
        <BloodPressureModal
          open={true}
          onOpenChange={closeModal}
          history={modalState.bloodPressure.history}
          status={modalState.bloodPressure.status}
          normalRange={modalState.bloodPressure.normalRange}
        />
      )}
      
      {modalState.type === "transaminasas" && modalState.transaminasas && (
        <TransaminasasModal
          open={true}
          onOpenChange={closeModal}
          historyAST={modalState.transaminasas.historyAST}
          historyALT={modalState.transaminasas.historyALT}
          status={modalState.transaminasas.status}
          normalRange={modalState.transaminasas.normalRange}
        />
      )}
    </div>
  )
}
