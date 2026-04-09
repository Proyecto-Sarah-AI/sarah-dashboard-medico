export interface Patient {
  id: string
  name: string
  age: number
  gender: "M" | "F"
  weight: number
  height: number
  initialWeight: number
  bmi: number
  initialBmi: number
  bmiChange: number
  adherence: number
  mood: number
  motivation: number
  appointmentsAttended: number
  appointmentsTotal: number
  appointmentRate: number
  cancelledEvents: number
  missedEvents: number
  symptomsCount: number
  symptomsSeverity: number
  abandonmentRisk: number
  treatmentRisk: number
  lastInteraction: string
  messagesCount: number
  treatmentDays: number
  avatar: string
}

export interface WeightHistory {
  date: string
  weight: number
  bmi: number
}

export interface AdherenceHistory {
  date: string
  adherence: number
}

export interface MoodHistory {
  date: string
  mood: number
  motivation: number
}

export interface SymptomReport {
  id: string
  patientId: string
  symptom: string
  severity: 1 | 2 | 3
  date: string
}

export const patients: Patient[] = [
  {
    id: "P001",
    name: "María García",
    age: 45,
    gender: "F",
    weight: 92,
    height: 1.65,
    initialWeight: 105,
    bmi: 33.8,
    initialBmi: 38.6,
    bmiChange: -12.4,
    adherence: 87,
    mood: 4,
    motivation: 4,
    appointmentsAttended: 12,
    appointmentsTotal: 14,
    appointmentRate: 86,
    cancelledEvents: 1,
    missedEvents: 1,
    symptomsCount: 2,
    symptomsSeverity: 1.5,
    abandonmentRisk: 1,
    treatmentRisk: 2,
    lastInteraction: "2024-01-15",
    messagesCount: 156,
    treatmentDays: 90,
    avatar: "MG"
  },
  {
    id: "P002",
    name: "Carlos Rodríguez",
    age: 52,
    gender: "M",
    weight: 118,
    height: 1.78,
    initialWeight: 125,
    bmi: 37.3,
    initialBmi: 39.5,
    bmiChange: -5.6,
    adherence: 65,
    mood: 3,
    motivation: 2,
    appointmentsAttended: 8,
    appointmentsTotal: 12,
    appointmentRate: 67,
    cancelledEvents: 2,
    missedEvents: 2,
    symptomsCount: 4,
    symptomsSeverity: 2.2,
    abandonmentRisk: 4,
    treatmentRisk: 3,
    lastInteraction: "2024-01-10",
    messagesCount: 45,
    treatmentDays: 75,
    avatar: "CR"
  },
  {
    id: "P003",
    name: "Ana Martínez",
    age: 38,
    gender: "F",
    weight: 78,
    height: 1.60,
    initialWeight: 95,
    bmi: 30.5,
    initialBmi: 37.1,
    bmiChange: -17.8,
    adherence: 95,
    mood: 5,
    motivation: 5,
    appointmentsAttended: 16,
    appointmentsTotal: 16,
    appointmentRate: 100,
    cancelledEvents: 0,
    missedEvents: 0,
    symptomsCount: 0,
    symptomsSeverity: 0,
    abandonmentRisk: 1,
    treatmentRisk: 1,
    lastInteraction: "2024-01-15",
    messagesCount: 234,
    treatmentDays: 120,
    avatar: "AM"
  },
  {
    id: "P004",
    name: "Roberto Sánchez",
    age: 61,
    gender: "M",
    weight: 102,
    height: 1.72,
    initialWeight: 108,
    bmi: 34.5,
    initialBmi: 36.5,
    bmiChange: -5.5,
    adherence: 72,
    mood: 3,
    motivation: 3,
    appointmentsAttended: 9,
    appointmentsTotal: 11,
    appointmentRate: 82,
    cancelledEvents: 1,
    missedEvents: 1,
    symptomsCount: 3,
    symptomsSeverity: 2.0,
    abandonmentRisk: 3,
    treatmentRisk: 3,
    lastInteraction: "2024-01-14",
    messagesCount: 78,
    treatmentDays: 60,
    avatar: "RS"
  },
  {
    id: "P005",
    name: "Laura Fernández",
    age: 29,
    gender: "F",
    weight: 85,
    height: 1.68,
    initialWeight: 85,
    bmi: 30.1,
    initialBmi: 30.1,
    bmiChange: 0,
    adherence: 45,
    mood: 2,
    motivation: 2,
    appointmentsAttended: 3,
    appointmentsTotal: 8,
    appointmentRate: 38,
    cancelledEvents: 3,
    missedEvents: 2,
    symptomsCount: 5,
    symptomsSeverity: 2.5,
    abandonmentRisk: 5,
    treatmentRisk: 4,
    lastInteraction: "2024-01-05",
    messagesCount: 12,
    treatmentDays: 45,
    avatar: "LF"
  },
  {
    id: "P006",
    name: "Miguel Torres",
    age: 48,
    gender: "M",
    weight: 95,
    height: 1.75,
    initialWeight: 110,
    bmi: 31.0,
    initialBmi: 35.9,
    bmiChange: -13.6,
    adherence: 82,
    mood: 4,
    motivation: 4,
    appointmentsAttended: 14,
    appointmentsTotal: 15,
    appointmentRate: 93,
    cancelledEvents: 1,
    missedEvents: 0,
    symptomsCount: 1,
    symptomsSeverity: 1.0,
    abandonmentRisk: 2,
    treatmentRisk: 2,
    lastInteraction: "2024-01-15",
    messagesCount: 189,
    treatmentDays: 100,
    avatar: "MT"
  }
]

export const getWeightHistory = (patientId: string): WeightHistory[] => {
  const baseData = [
    { weeks: 0, weightDiff: 0, bmiDiff: 0 },
    { weeks: 2, weightDiff: -1.5, bmiDiff: -0.5 },
    { weeks: 4, weightDiff: -3, bmiDiff: -1.0 },
    { weeks: 6, weightDiff: -4.5, bmiDiff: -1.5 },
    { weeks: 8, weightDiff: -6, bmiDiff: -2.0 },
    { weeks: 10, weightDiff: -8, bmiDiff: -2.7 },
    { weeks: 12, weightDiff: -10, bmiDiff: -3.4 },
  ]

  const patient = patients.find(p => p.id === patientId)
  if (!patient) return []

  const multiplier = patientId === "P005" ? 0 : patientId === "P002" ? 0.5 : 1

  return baseData.map((d, i) => ({
    date: `Sem ${d.weeks}`,
    weight: patient.initialWeight + (d.weightDiff * multiplier),
    bmi: patient.initialBmi + (d.bmiDiff * multiplier)
  }))
}

export const getAdherenceHistory = (patientId: string): AdherenceHistory[] => {
  const patient = patients.find(p => p.id === patientId)
  if (!patient) return []

  const variance = patient.adherence > 80 ? 5 : patient.adherence > 60 ? 15 : 25

  return Array.from({ length: 12 }, (_, i) => ({
    date: `Sem ${i + 1}`,
    adherence: Math.max(0, Math.min(100, patient.adherence + (Math.random() - 0.5) * variance * 2))
  }))
}

export interface DailyAdherence {
  date: string
  adherence: number
  completed: boolean
}

export const getDailyAdherenceHistory = (patientId: string): DailyAdherence[] => {
  const patient = patients.find(p => p.id === patientId)
  if (!patient) return []

  const baseAdherence = patient.adherence
  const variance = patient.adherence > 80 ? 10 : patient.adherence > 60 ? 20 : 30

  return Array.from({ length: 30 }, (_, i) => {
    const day = 30 - i
    const adherenceValue = Math.max(0, Math.min(100, baseAdherence + (Math.random() - 0.5) * variance))
    return {
      date: `Día ${day}`,
      adherence: Math.round(adherenceValue),
      completed: adherenceValue >= 50
    }
  }).reverse()
}

export interface WeeklyAdherence {
  week: string
  adherence: number
  target: number
}

export const getWeeklyAdherenceHistory = (patientId: string): WeeklyAdherence[] => {
  const patient = patients.find(p => p.id === patientId)
  if (!patient) return []

  const baseAdherence = patient.adherence
  const variance = patient.adherence > 80 ? 8 : patient.adherence > 60 ? 15 : 25

  return Array.from({ length: 8 }, (_, i) => ({
    week: `Sem ${i + 1}`,
    adherence: Math.round(Math.max(0, Math.min(100, baseAdherence + (Math.random() - 0.5) * variance))),
    target: 80
  }))
}

export interface SideEffectReport {
  name: string
  count: number
  severity: "mild" | "moderate" | "severe"
}

export const getSideEffectsReport = (patientId: string): SideEffectReport[] => {
  const patientSymptoms = getPatientSymptoms(patientId)
  
  const grouped = patientSymptoms.reduce((acc, s) => {
    if (!acc[s.symptom]) {
      acc[s.symptom] = { count: 0, maxSeverity: s.severity }
    }
    acc[s.symptom].count++
    if (s.severity > acc[s.symptom].maxSeverity) {
      acc[s.symptom].maxSeverity = s.severity
    }
    return acc
  }, {} as Record<string, { count: number; maxSeverity: number }>)

  return Object.entries(grouped).map(([name, data]) => ({
    name,
    count: data.count,
    severity: data.maxSeverity === 1 ? "mild" : data.maxSeverity === 2 ? "moderate" : "severe"
  })).sort((a, b) => b.count - a.count)
}

export const getMoodHistory = (patientId: string): MoodHistory[] => {
  const patient = patients.find(p => p.id === patientId)
  if (!patient) return []

  return Array.from({ length: 14 }, (_, i) => ({
    date: `Día ${i + 1}`,
    mood: Math.max(1, Math.min(5, patient.mood + (Math.random() - 0.5) * 2)),
    motivation: Math.max(1, Math.min(5, patient.motivation + (Math.random() - 0.5) * 2))
  }))
}

export const symptoms: SymptomReport[] = [
  { id: "S001", patientId: "P001", symptom: "Náuseas leves", severity: 1, date: "2024-01-14" },
  { id: "S002", patientId: "P001", symptom: "Fatiga", severity: 2, date: "2024-01-12" },
  { id: "S003", patientId: "P002", symptom: "Mareos", severity: 2, date: "2024-01-13" },
  { id: "S004", patientId: "P002", symptom: "Dolor de cabeza", severity: 2, date: "2024-01-11" },
  { id: "S005", patientId: "P002", symptom: "Estreñimiento", severity: 2, date: "2024-01-10" },
  { id: "S006", patientId: "P002", symptom: "Insomnio", severity: 3, date: "2024-01-09" },
  { id: "S007", patientId: "P004", symptom: "Náuseas", severity: 2, date: "2024-01-14" },
  { id: "S008", patientId: "P004", symptom: "Fatiga", severity: 2, date: "2024-01-13" },
  { id: "S009", patientId: "P004", symptom: "Diarrea", severity: 2, date: "2024-01-11" },
  { id: "S010", patientId: "P005", symptom: "Náuseas severas", severity: 3, date: "2024-01-05" },
  { id: "S011", patientId: "P005", symptom: "Vómitos", severity: 3, date: "2024-01-04" },
  { id: "S012", patientId: "P005", symptom: "Fatiga extrema", severity: 3, date: "2024-01-03" },
  { id: "S013", patientId: "P005", symptom: "Dolor abdominal", severity: 2, date: "2024-01-02" },
  { id: "S014", patientId: "P005", symptom: "Mareos", severity: 2, date: "2024-01-01" },
  { id: "S015", patientId: "P006", symptom: "Fatiga leve", severity: 1, date: "2024-01-10" },
]

export const getPatientSymptoms = (patientId: string) => 
  symptoms.filter(s => s.patientId === patientId)

export const aggregateMetrics = () => {
  const total = patients.length
  const avgAdherence = patients.reduce((sum, p) => sum + p.adherence, 0) / total
  const avgBmiChange = patients.reduce((sum, p) => sum + p.bmiChange, 0) / total
  const criticalPatients = patients.filter(p => p.abandonmentRisk >= 4 || p.treatmentRisk >= 4).length
  const totalSymptoms = patients.reduce((sum, p) => sum + p.symptomsCount, 0)
  const avgMood = patients.reduce((sum, p) => sum + p.mood, 0) / total
  const avgMotivation = patients.reduce((sum, p) => sum + p.motivation, 0) / total

  return {
    totalPatients: total,
    avgAdherence: Math.round(avgAdherence),
    avgBmiChange: avgBmiChange.toFixed(1),
    criticalPatients,
    totalSymptoms,
    avgMood: avgMood.toFixed(1),
    avgMotivation: avgMotivation.toFixed(1)
  }
}
