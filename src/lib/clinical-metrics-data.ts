// Clinical metrics types and mock data

export type MetricStatus = "normal" | "warning" | "critical"
export type MetricTrend = "up" | "down" | "stable"

export interface MetricHistoryPoint {
  date: string
  value: number
}

export interface ClinicalMetric {
  name: string
  value: number
  unit: string
  trend: MetricTrend
  status: MetricStatus
  history: MetricHistoryPoint[]
  normalRange?: { min: number; max: number }
  warningRange?: { min: number; max: number }
}

export interface TransaminasasMetric {
  ast: number
  alt: number
  unit: string
  trend: MetricTrend
  status: MetricStatus
  historyAST: MetricHistoryPoint[]
  historyALT: MetricHistoryPoint[]
  normalRange: { ast: { min: number; max: number }; alt: { min: number; max: number } }
}

export interface BloodPressureMetric {
  systolic: number
  diastolic: number
  unit: string
  trend: MetricTrend
  status: MetricStatus
  history: { date: string; systolic: number; diastolic: number }[]
  normalRange: { systolic: { min: number; max: number }; diastolic: { min: number; max: number } }
}

export interface PatientClinicalMetrics {
  // Existing anthropometric (extended)
  weight: ClinicalMetric
  bmi: ClinicalMetric
  height: ClinicalMetric
  
  // Cardiovascular
  bloodPressure: BloodPressureMetric
  heartRate: ClinicalMetric
  
  // Metabolic
  hba1c: ClinicalMetric
  glucose: ClinicalMetric
  cholesterolTotal: ClinicalMetric
  hdl: ClinicalMetric
  ldl: ClinicalMetric
  triglycerides: ClinicalMetric
  
  // Anthropometric additional
  waistCircumference: ClinicalMetric
  waistToHeightRatio: ClinicalMetric
  
  // Functional
  vo2max: ClinicalMetric
  stopBang: ClinicalMetric
  
  // Hepatic
  transaminasas: TransaminasasMetric
}

// Helper to generate 6 months of history data
function generateHistory(
  baseValue: number, 
  variance: number, 
  months: number = 6,
  trendDirection: MetricTrend = "stable"
): MetricHistoryPoint[] {
  const history: MetricHistoryPoint[] = []
  const now = new Date()
  
  for (let i = months; i >= 0; i--) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)
    
    let trendAdjust = 0
    if (trendDirection === "down") {
      trendAdjust = (months - i) * (variance * 0.1)
    } else if (trendDirection === "up") {
      trendAdjust = -(months - i) * (variance * 0.1)
    }
    
    const randomVariance = (Math.random() - 0.5) * variance
    const value = Math.max(0, baseValue + randomVariance - trendAdjust)
    
    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 10) / 10
    })
  }
  
  return history
}

// Determine status based on value and ranges
function getStatus(
  value: number, 
  normalMin: number, 
  normalMax: number,
  criticalMin?: number,
  criticalMax?: number
): MetricStatus {
  if (value >= normalMin && value <= normalMax) return "normal"
  if (criticalMin !== undefined && value < criticalMin) return "critical"
  if (criticalMax !== undefined && value > criticalMax) return "critical"
  return "warning"
}

// Generate clinical metrics for a patient
export function getPatientClinicalMetrics(patientId: string): PatientClinicalMetrics {
  // Use patientId to seed some variation
  const seed = parseInt(patientId.replace(/\D/g, ''), 10) || 1
  const variation = (seed % 5) / 5 // 0-1 variation factor
  
  // Weight (already exists in patient data, extend with history)
  const baseWeight = 85 + variation * 30
  const weightHistory = generateHistory(baseWeight, 5, 6, "down")
  const currentWeight = weightHistory[weightHistory.length - 1].value
  const prevWeight = weightHistory[weightHistory.length - 2].value
  
  // BMI
  const height = 1.65 + variation * 0.15
  const bmiBase = currentWeight / (height * height)
  const bmiHistory = weightHistory.map(h => ({
    date: h.date,
    value: Math.round((h.value / (height * height)) * 10) / 10
  }))
  
  // Blood Pressure
  const systolicBase = 120 + variation * 30
  const diastolicBase = 80 + variation * 15
  const bpHistory = generateHistory(systolicBase, 15, 6).map((h, i) => ({
    date: h.date,
    systolic: h.value,
    diastolic: Math.round(diastolicBase + (Math.random() - 0.5) * 10)
  }))
  
  // Heart Rate
  const hrBase = 72 + variation * 20
  const hrHistory = generateHistory(hrBase, 10, 6)
  
  // HbA1c (glycated hemoglobin)
  const hba1cBase = 5.5 + variation * 2.5
  const hba1cHistory = generateHistory(hba1cBase, 0.5, 6, variation > 0.5 ? "up" : "down")
  
  // Fasting Glucose
  const glucoseBase = 95 + variation * 40
  const glucoseHistory = generateHistory(glucoseBase, 15, 6)
  
  // Cholesterol
  const cholesterolBase = 180 + variation * 60
  const cholesterolHistory = generateHistory(cholesterolBase, 20, 6, "down")
  
  // HDL
  const hdlBase = 55 + variation * 20
  const hdlHistory = generateHistory(hdlBase, 8, 6, "up")
  
  // LDL
  const ldlBase = 100 + variation * 40
  const ldlHistory = generateHistory(ldlBase, 15, 6, "down")
  
  // Triglycerides
  const triglyceridesBase = 140 + variation * 80
  const triglyceridesHistory = generateHistory(triglyceridesBase, 30, 6)
  
  // Waist Circumference
  const waistBase = 85 + variation * 25
  const waistHistory = generateHistory(waistBase, 3, 6, "down")
  
  // Waist to Height Ratio
  const whrBase = waistBase / (height * 100)
  const whrHistory = waistHistory.map(h => ({
    date: h.date,
    value: Math.round((h.value / (height * 100)) * 100) / 100
  }))
  
  // VO2 max
  const vo2Base = 35 + (1 - variation) * 15
  const vo2History = generateHistory(vo2Base, 3, 6, "up")
  
  // STOP-BANG score
  const stopBangBase = Math.floor(variation * 6)
  const stopBangHistory = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (6 - i))
    return {
      date: date.toISOString().split('T')[0],
      value: Math.max(0, Math.min(8, stopBangBase + Math.floor((Math.random() - 0.3) * 2)))
    }
  })
  
  // Transaminases
  const astBase = 25 + variation * 25
  const altBase = 28 + variation * 30
  const astHistory = generateHistory(astBase, 8, 6)
  const altHistory = generateHistory(altBase, 10, 6)
  
  return {
    weight: {
      name: "Peso",
      value: currentWeight,
      unit: "kg",
      trend: currentWeight < prevWeight ? "down" : currentWeight > prevWeight ? "up" : "stable",
      status: getStatus(bmiBase, 18.5, 24.9, 16, 40),
      history: weightHistory,
      normalRange: { min: 50, max: 100 }
    },
    bmi: {
      name: "IMC",
      value: Math.round(bmiBase * 10) / 10,
      unit: "kg/m²",
      trend: bmiHistory[bmiHistory.length - 1].value < bmiHistory[bmiHistory.length - 2].value ? "down" : "stable",
      status: getStatus(bmiBase, 18.5, 24.9, 16, 40),
      history: bmiHistory,
      normalRange: { min: 18.5, max: 24.9 },
      warningRange: { min: 25, max: 29.9 }
    },
    height: {
      name: "Estatura",
      value: Math.round(height * 100) / 100,
      unit: "m",
      trend: "stable",
      status: "normal",
      history: Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (6 - i))
        return { date: date.toISOString().split('T')[0], value: Math.round(height * 100) / 100 }
      }),
      normalRange: { min: 1.5, max: 2.0 }
    },
    bloodPressure: {
      systolic: Math.round(bpHistory[bpHistory.length - 1].systolic),
      diastolic: Math.round(bpHistory[bpHistory.length - 1].diastolic),
      unit: "mmHg",
      trend: bpHistory[bpHistory.length - 1].systolic < bpHistory[bpHistory.length - 2].systolic ? "down" : "stable",
      status: getStatus(bpHistory[bpHistory.length - 1].systolic, 90, 120, 70, 180),
      history: bpHistory,
      normalRange: {
        systolic: { min: 90, max: 120 },
        diastolic: { min: 60, max: 80 }
      }
    },
    heartRate: {
      name: "Frecuencia cardíaca",
      value: Math.round(hrHistory[hrHistory.length - 1].value),
      unit: "bpm",
      trend: hrHistory[hrHistory.length - 1].value < hrHistory[hrHistory.length - 2].value ? "down" : "stable",
      status: getStatus(hrHistory[hrHistory.length - 1].value, 60, 100, 40, 120),
      history: hrHistory,
      normalRange: { min: 60, max: 100 }
    },
    hba1c: {
      name: "HbA1c",
      value: Math.round(hba1cHistory[hba1cHistory.length - 1].value * 10) / 10,
      unit: "%",
      trend: hba1cHistory[hba1cHistory.length - 1].value > hba1cHistory[hba1cHistory.length - 2].value ? "up" : "down",
      status: getStatus(hba1cHistory[hba1cHistory.length - 1].value, 4, 5.6, 3, 9),
      history: hba1cHistory,
      normalRange: { min: 4, max: 5.6 },
      warningRange: { min: 5.7, max: 6.4 }
    },
    glucose: {
      name: "Glucosa",
      value: Math.round(glucoseHistory[glucoseHistory.length - 1].value),
      unit: "mg/dL",
      trend: glucoseHistory[glucoseHistory.length - 1].value < glucoseHistory[glucoseHistory.length - 2].value ? "down" : "stable",
      status: getStatus(glucoseHistory[glucoseHistory.length - 1].value, 70, 100, 50, 200),
      history: glucoseHistory,
      normalRange: { min: 70, max: 100 },
      warningRange: { min: 100, max: 125 }
    },
    cholesterolTotal: {
      name: "Colesterol total",
      value: Math.round(cholesterolHistory[cholesterolHistory.length - 1].value),
      unit: "mg/dL",
      trend: cholesterolHistory[cholesterolHistory.length - 1].value < cholesterolHistory[cholesterolHistory.length - 2].value ? "down" : "stable",
      status: getStatus(cholesterolHistory[cholesterolHistory.length - 1].value, 0, 200, 0, 280),
      history: cholesterolHistory,
      normalRange: { min: 0, max: 200 },
      warningRange: { min: 200, max: 239 }
    },
    hdl: {
      name: "HDL",
      value: Math.round(hdlHistory[hdlHistory.length - 1].value),
      unit: "mg/dL",
      trend: hdlHistory[hdlHistory.length - 1].value > hdlHistory[hdlHistory.length - 2].value ? "up" : "stable",
      status: hdlHistory[hdlHistory.length - 1].value >= 40 ? "normal" : "warning",
      history: hdlHistory,
      normalRange: { min: 40, max: 100 }
    },
    ldl: {
      name: "LDL",
      value: Math.round(ldlHistory[ldlHistory.length - 1].value),
      unit: "mg/dL",
      trend: ldlHistory[ldlHistory.length - 1].value < ldlHistory[ldlHistory.length - 2].value ? "down" : "stable",
      status: getStatus(ldlHistory[ldlHistory.length - 1].value, 0, 100, 0, 190),
      history: ldlHistory,
      normalRange: { min: 0, max: 100 },
      warningRange: { min: 100, max: 159 }
    },
    triglycerides: {
      name: "Triglicéridos",
      value: Math.round(triglyceridesHistory[triglyceridesHistory.length - 1].value),
      unit: "mg/dL",
      trend: triglyceridesHistory[triglyceridesHistory.length - 1].value < triglyceridesHistory[triglyceridesHistory.length - 2].value ? "down" : "stable",
      status: getStatus(triglyceridesHistory[triglyceridesHistory.length - 1].value, 0, 150, 0, 500),
      history: triglyceridesHistory,
      normalRange: { min: 0, max: 150 },
      warningRange: { min: 150, max: 199 }
    },
    waistCircumference: {
      name: "Perímetro abdominal",
      value: Math.round(waistHistory[waistHistory.length - 1].value),
      unit: "cm",
      trend: waistHistory[waistHistory.length - 1].value < waistHistory[waistHistory.length - 2].value ? "down" : "stable",
      status: getStatus(waistHistory[waistHistory.length - 1].value, 0, 94, 0, 120), // Men threshold
      history: waistHistory,
      normalRange: { min: 0, max: 94 },
      warningRange: { min: 94, max: 102 }
    },
    waistToHeightRatio: {
      name: "Relación cintura-altura",
      value: Math.round(whrHistory[whrHistory.length - 1].value * 100) / 100,
      unit: "",
      trend: whrHistory[whrHistory.length - 1].value < whrHistory[whrHistory.length - 2].value ? "down" : "stable",
      status: getStatus(whrHistory[whrHistory.length - 1].value, 0, 0.5, 0, 0.63),
      history: whrHistory,
      normalRange: { min: 0, max: 0.5 },
      warningRange: { min: 0.5, max: 0.6 }
    },
    vo2max: {
      name: "VO2 máx",
      value: Math.round(vo2History[vo2History.length - 1].value * 10) / 10,
      unit: "mL/kg/min",
      trend: vo2History[vo2History.length - 1].value > vo2History[vo2History.length - 2].value ? "up" : "stable",
      status: vo2History[vo2History.length - 1].value >= 35 ? "normal" : vo2History[vo2History.length - 1].value >= 25 ? "warning" : "critical",
      history: vo2History,
      normalRange: { min: 35, max: 60 },
      warningRange: { min: 25, max: 35 }
    },
    stopBang: {
      name: "STOP-BANG",
      value: stopBangHistory[stopBangHistory.length - 1].value,
      unit: "/8",
      trend: stopBangHistory[stopBangHistory.length - 1].value < stopBangHistory[stopBangHistory.length - 2].value ? "down" : "stable",
      status: stopBangHistory[stopBangHistory.length - 1].value <= 2 ? "normal" : stopBangHistory[stopBangHistory.length - 1].value <= 4 ? "warning" : "critical",
      history: stopBangHistory,
      normalRange: { min: 0, max: 2 },
      warningRange: { min: 3, max: 4 }
    },
    transaminasas: {
      ast: Math.round(astHistory[astHistory.length - 1].value),
      alt: Math.round(altHistory[altHistory.length - 1].value),
      unit: "U/L",
      trend: (astHistory[astHistory.length - 1].value + altHistory[altHistory.length - 1].value) / 2 < 
             (astHistory[astHistory.length - 2].value + altHistory[altHistory.length - 2].value) / 2 ? "down" : "stable",
      status: getStatus(Math.max(astHistory[astHistory.length - 1].value, altHistory[altHistory.length - 1].value), 0, 40, 0, 120),
      historyAST: astHistory,
      historyALT: altHistory,
      normalRange: {
        ast: { min: 10, max: 40 },
        alt: { min: 7, max: 56 }
      }
    }
  }
}
