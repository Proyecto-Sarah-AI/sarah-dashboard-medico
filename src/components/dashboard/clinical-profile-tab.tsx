
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClinicalMetricCard, BloodPressureCard, TransaminasasCard } from "./clinical-metric-card"
import { MetricDetailModal, BloodPressureModal, TransaminasasModal } from "./metric-detail-modal"
import type { PatientClinicalMetrics, ClinicalMetric, BloodPressureMetric, TransaminasasMetric } from "@/lib/clinical-metrics-data"
import { 
  Heart,
  Droplets,
  Ruler,
  Dumbbell,
  TestTube
} from "lucide-react"

interface ClinicalProfileTabProps {
  metrics: PatientClinicalMetrics
}

type ModalState = {
  type: "simple" | "bloodPressure" | "transaminasas" | null
  metric?: ClinicalMetric
  bloodPressure?: BloodPressureMetric
  transaminasas?: TransaminasasMetric
}

export function ClinicalProfileTab({ metrics }: ClinicalProfileTabProps) {
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
      {/* Cardiovascular Metrics */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Heart className="h-4 w-4 text-destructive" />
            Cardiovasculares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BloodPressureCard
              systolic={metrics.bloodPressure.systolic}
              diastolic={metrics.bloodPressure.diastolic}
              unit={metrics.bloodPressure.unit}
              trend={metrics.bloodPressure.trend}
              status={metrics.bloodPressure.status}
              history={metrics.bloodPressure.history}
              icon={<Heart className="h-4 w-4" />}
              onClick={openBloodPressureModal}
            />
            <ClinicalMetricCard
              name={metrics.heartRate.name}
              value={metrics.heartRate.value}
              unit={metrics.heartRate.unit}
              trend={metrics.heartRate.trend}
              status={metrics.heartRate.status}
              history={metrics.heartRate.history}
              icon={<Heart className="h-4 w-4" />}
              onClick={() => openMetricModal(metrics.heartRate)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Metabolic Metrics */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Droplets className="h-4 w-4 text-chart-1" />
            Metabólicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <ClinicalMetricCard
              name={metrics.hba1c.name}
              value={metrics.hba1c.value}
              unit={metrics.hba1c.unit}
              trend={metrics.hba1c.trend}
              status={metrics.hba1c.status}
              history={metrics.hba1c.history}
              onClick={() => openMetricModal(metrics.hba1c)}
            />
            <ClinicalMetricCard
              name={metrics.glucose.name}
              value={metrics.glucose.value}
              unit={metrics.glucose.unit}
              trend={metrics.glucose.trend}
              status={metrics.glucose.status}
              history={metrics.glucose.history}
              onClick={() => openMetricModal(metrics.glucose)}
            />
            <ClinicalMetricCard
              name={metrics.cholesterolTotal.name}
              value={metrics.cholesterolTotal.value}
              unit={metrics.cholesterolTotal.unit}
              trend={metrics.cholesterolTotal.trend}
              status={metrics.cholesterolTotal.status}
              history={metrics.cholesterolTotal.history}
              onClick={() => openMetricModal(metrics.cholesterolTotal)}
            />
            <ClinicalMetricCard
              name={metrics.hdl.name}
              value={metrics.hdl.value}
              unit={metrics.hdl.unit}
              trend={metrics.hdl.trend}
              status={metrics.hdl.status}
              history={metrics.hdl.history}
              onClick={() => openMetricModal(metrics.hdl)}
            />
            <ClinicalMetricCard
              name={metrics.ldl.name}
              value={metrics.ldl.value}
              unit={metrics.ldl.unit}
              trend={metrics.ldl.trend}
              status={metrics.ldl.status}
              history={metrics.ldl.history}
              onClick={() => openMetricModal(metrics.ldl)}
            />
            <ClinicalMetricCard
              name={metrics.triglycerides.name}
              value={metrics.triglycerides.value}
              unit={metrics.triglycerides.unit}
              trend={metrics.triglycerides.trend}
              status={metrics.triglycerides.status}
              history={metrics.triglycerides.history}
              onClick={() => openMetricModal(metrics.triglycerides)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Anthropometric Metrics */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            Antropomédicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ClinicalMetricCard
              name={metrics.waistCircumference.name}
              value={metrics.waistCircumference.value}
              unit={metrics.waistCircumference.unit}
              trend={metrics.waistCircumference.trend}
              status={metrics.waistCircumference.status}
              history={metrics.waistCircumference.history}
              onClick={() => openMetricModal(metrics.waistCircumference)}
            />
            <ClinicalMetricCard
              name={metrics.waistToHeightRatio.name}
              value={metrics.waistToHeightRatio.value}
              unit={metrics.waistToHeightRatio.unit}
              trend={metrics.waistToHeightRatio.trend}
              status={metrics.waistToHeightRatio.status}
              history={metrics.waistToHeightRatio.history}
              onClick={() => openMetricModal(metrics.waistToHeightRatio)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Functional Metrics */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-chart-3" />
            Funcionales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ClinicalMetricCard
              name={metrics.vo2max.name}
              value={metrics.vo2max.value}
              unit={metrics.vo2max.unit}
              trend={metrics.vo2max.trend}
              status={metrics.vo2max.status}
              history={metrics.vo2max.history}
              onClick={() => openMetricModal(metrics.vo2max)}
            />
            <ClinicalMetricCard
              name={metrics.stopBang.name}
              value={metrics.stopBang.value}
              unit={metrics.stopBang.unit}
              trend={metrics.stopBang.trend}
              status={metrics.stopBang.status}
              history={metrics.stopBang.history}
              onClick={() => openMetricModal(metrics.stopBang)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Hepatic Metrics */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <TestTube className="h-4 w-4 text-warning" />
            Hepáticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TransaminasasCard
              ast={metrics.transaminasas.ast}
              alt={metrics.transaminasas.alt}
              unit={metrics.transaminasas.unit}
              trend={metrics.transaminasas.trend}
              status={metrics.transaminasas.status}
              historyAST={metrics.transaminasas.historyAST}
              historyALT={metrics.transaminasas.historyALT}
              icon={<TestTube className="h-4 w-4" />}
              onClick={openTransaminasasModal}
            />
          </div>
        </CardContent>
      </Card>
      
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
