export type RiesgoCondicion = 
  | "adherencia_muy_baja"      // Adherencia < 40%
  | "adherencia_baja"          // Adherencia entre 40–60%
  | "ghq12_alto"               // GHQ-12 ≥ 7
  | "ghq12_moderado"           // GHQ-12 entre 3–6
  | "readiness_bajo"           // Readiness ≤ 2
  | "inasistencia_alta"        // Inasistencia a controles > 30%
  | "vive_solo"                // Vive solo
  | "silencio_prolongado"      // Silencio > 7 días sin respuesta
  | "caida_brusca"             // Caída brusca de nivel (≥4 a ≤2 en menos de 7 días)

export interface RiesgoAbandono {
  nivel: 1 | 2 | 3 | 4 | 5  // 1 = Muy alto, 5 = Muy bajo
  condicionesActivas: RiesgoCondicion[]
}

export interface Patient {
  id: string
  name: string
  rut: string
  age: number
  gender: "M" | "F"
  weight: number
  height: number
  initialWeight: number
  bmi: number
  initialBmi: number
  bmiChange: number
  adherenceFarmacologica: number
  adherenciaCuidado: number
  persistencia: number
  mood: number
  motivation: number
  appointmentsAttended: number
  appointmentsTotal: number
  appointmentRate: number
  cancelledEvents: number
  missedEvents: number
  symptomsCount: number
  symptomsSeverity: number
  estadoEmocional: number
  lastInteraction: string
  messagesCount: number
  treatmentDays: number
  avatar: string
  treatmentType: "obesity" | "diabetes" | "hypertension"
  riesgoAbandono: RiesgoAbandono
}

export interface WeightHistory {
  date: string
  weight: number
  bmi: number
}

export interface AdherenceHistory {
  date: string
  adherenceFarmacologica: number
  adherenciaCuidado: number
  persistencia: number
}

export interface MoodHistory {
  date: string
  mood: number
  motivation: number
}

export type SymptomCategory = 
  | "gastrointestinal"
  | "neurologico"
  | "metabolico"
  | "musculoesqueletico"
  | "psicologico"
  | "cardiovascular"

export interface SymptomReport {
  id: string
  patientId: string
  symptom: string
  category: SymptomCategory
  severity: number // 0-7 scale
  date: string
}

export const patients: Patient[] = [
  {
    id: "P001",
    name: "María García",
    rut: "12345678-9",
    age: 45,
    gender: "F",
    weight: 92,
    height: 1.65,
    initialWeight: 105,
    bmi: 33.8,
    initialBmi: 38.6,
    bmiChange: -12.4,
    adherenceFarmacologica: 90,
    adherenciaCuidado: 85,
    persistencia: 85,
    mood: 4,
    motivation: 4,
    appointmentsAttended: 12,
    appointmentsTotal: 14,
    appointmentRate: 86,
    cancelledEvents: 1,
    missedEvents: 1,
    symptomsCount: 2,
    symptomsSeverity: 1.5,
    estadoEmocional: 1,
    lastInteraction: "2024-01-15",
    messagesCount: 156,
    treatmentDays: 90,
    avatar: "MG",
    treatmentType: "obesity",
    riesgoAbandono: {
      nivel: 4,
      condicionesActivas: []
    }
  },
  {
    id: "P002",
    name: "Carlos Rodríguez",
    rut: "87654321-5",
    age: 52,
    gender: "M",
    weight: 118,
    height: 1.78,
    initialWeight: 125,
    bmi: 37.3,
    initialBmi: 39.5,
    bmiChange: -5.6,
    adherenceFarmacologica: 68,
    adherenciaCuidado: 62,
    persistencia: 65,
    mood: 3,
    motivation: 2,
    appointmentsAttended: 8,
    appointmentsTotal: 12,
    appointmentRate: 67,
    cancelledEvents: 2,
    missedEvents: 2,
    symptomsCount: 4,
    symptomsSeverity: 2.2,
    estadoEmocional: 8,
    lastInteraction: "2024-01-10",
    messagesCount: 45,
    treatmentDays: 75,
    avatar: "CR",
    treatmentType: "obesity",
    riesgoAbandono: {
      nivel: 2,
      condicionesActivas: ["adherencia_baja", "readiness_bajo", "inasistencia_alta"]
    }
  },
  {
    id: "P003",
    name: "Ana Martínez",
    rut: "11223344-6",
    age: 38,
    gender: "F",
    weight: 78,
    height: 1.60,
    initialWeight: 95,
    bmi: 30.5,
    initialBmi: 37.1,
    bmiChange: -17.8,
    adherenceFarmacologica: 97,
    adherenciaCuidado: 93,
    persistencia: 95,
    mood: 5,
    motivation: 5,
    appointmentsAttended: 16,
    appointmentsTotal: 16,
    appointmentRate: 100,
    cancelledEvents: 0,
    missedEvents: 0,
    symptomsCount: 0,
    symptomsSeverity: 0,
    estadoEmocional: 2,
    lastInteraction: "2024-01-15",
    messagesCount: 234,
    treatmentDays: 120,
    avatar: "AM",
    treatmentType: "diabetes",
    riesgoAbandono: {
      nivel: 5,
      condicionesActivas: []
    }
  },
  {
    id: "P004",
    name: "Roberto Sánchez",
    rut: "55443322-1",
    age: 61,
    gender: "M",
    weight: 102,
    height: 1.72,
    initialWeight: 108,
    bmi: 34.5,
    initialBmi: 36.5,
    bmiChange: -5.5,
    adherenceFarmacologica: 74,
    adherenciaCuidado: 70,
    persistencia: 72,
    mood: 3,
    motivation: 3,
    appointmentsAttended: 9,
    appointmentsTotal: 11,
    appointmentRate: 82,
    cancelledEvents: 1,
    missedEvents: 1,
    symptomsCount: 3,
    symptomsSeverity: 2.0,
    estadoEmocional: 6,
    lastInteraction: "2024-01-14",
    messagesCount: 78,
    treatmentDays: 60,
    avatar: "RS",
    treatmentType: "hypertension",
    riesgoAbandono: {
      nivel: 3,
      condicionesActivas: ["ghq12_moderado"]
    }
  },
  {
    id: "P005",
    name: "Laura Fernández",
    rut: "66778899-2",
    age: 29,
    gender: "F",
    weight: 85,
    height: 1.68,
    initialWeight: 85,
    bmi: 30.1,
    initialBmi: 30.1,
    bmiChange: 0,
    adherenceFarmacologica: 48,
    adherenciaCuidado: 42,
    persistencia: 45,
    mood: 2,
    motivation: 2,
    appointmentsAttended: 3,
    appointmentsTotal: 8,
    appointmentRate: 38,
    cancelledEvents: 3,
    missedEvents: 2,
    symptomsCount: 5,
    symptomsSeverity: 2.5,
    estadoEmocional: 10,
    lastInteraction: "2024-01-05",
    messagesCount: 12,
    treatmentDays: 45,
    avatar: "LF",
    treatmentType: "obesity",
    riesgoAbandono: {
      nivel: 1,
      condicionesActivas: ["adherencia_muy_baja", "ghq12_alto", "silencio_prolongado", "vive_solo"]
    }
  },
  {
    id: "P006",
    name: "Miguel Torres",
    rut: "99887766-3",
    age: 48,
    gender: "M",
    weight: 95,
    height: 1.75,
    initialWeight: 110,
    bmi: 31.0,
    initialBmi: 35.9,
    bmiChange: -13.6,
    adherenceFarmacologica: 85,
    adherenciaCuidado: 80,
    persistencia: 82,
    mood: 4,
    motivation: 4,
    appointmentsAttended: 14,
    appointmentsTotal: 15,
    appointmentRate: 93,
    cancelledEvents: 1,
    missedEvents: 0,
    symptomsCount: 1,
    symptomsSeverity: 1.0,
    estadoEmocional: 3,
    lastInteraction: "2024-01-15",
    messagesCount: 189,
    treatmentDays: 100,
    avatar: "MT",
    treatmentType: "diabetes",
    riesgoAbandono: {
      nivel: 5,
      condicionesActivas: []
    }
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

  const varianceFarm = patient.adherenceFarmacologica > 80 ? 5 : patient.adherenceFarmacologica > 60 ? 15 : 25
  const varianceCuid = patient.adherenciaCuidado > 80 ? 5 : patient.adherenciaCuidado > 60 ? 15 : 25
  const variancePers = patient.persistencia > 80 ? 5 : patient.persistencia > 60 ? 15 : 25

  return Array.from({ length: 12 }, (_, i) => ({
    date: `Sem ${i + 1}`,
    adherenceFarmacologica: Math.max(0, Math.min(100, patient.adherenceFarmacologica + (Math.random() - 0.5) * varianceFarm * 2)),
    adherenciaCuidado: Math.max(0, Math.min(100, patient.adherenciaCuidado + (Math.random() - 0.5) * varianceCuid * 2)),
    persistencia: Math.max(0, Math.min(100, patient.persistencia + (Math.random() - 0.5) * variancePers * 2))
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

  const avgAdherence = (patient.adherenceFarmacologica + patient.adherenciaCuidado + patient.persistencia) / 3
  const variance = avgAdherence > 80 ? 10 : avgAdherence > 60 ? 20 : 30

  return Array.from({ length: 30 }, (_, i) => {
    const day = 30 - i
    const adherenceValue = Math.max(0, Math.min(100, avgAdherence + (Math.random() - 0.5) * variance))
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

  const avgAdherence = (patient.adherenceFarmacologica + patient.adherenciaCuidado + patient.persistencia) / 3
  const variance = avgAdherence > 80 ? 8 : avgAdherence > 60 ? 15 : 25

  return Array.from({ length: 8 }, (_, i) => ({
    week: `Sem ${i + 1}`,
    adherence: Math.round(Math.max(0, Math.min(100, avgAdherence + (Math.random() - 0.5) * variance))),
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

  // Map 0-7 scale to mild/moderate/severe: 0-2 = mild, 3-5 = moderate, 6-7 = severe
  return Object.entries(grouped).map(([name, data]) => ({
    name,
    count: data.count,
    severity: data.maxSeverity <= 2 ? "mild" : data.maxSeverity <= 5 ? "moderate" : "severe"
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

export type EstadoEmocionalLevel = "sin_malestar" | "malestar_moderado" | "malestar_elevado"

// Riesgo de abandono helpers
export const getRiesgoLabel = (nivel: number): string => {
  switch (nivel) {
    case 1: return "Muy alto"
    case 2: return "Alto"
    case 3: return "Moderado"
    case 4: return "Bajo"
    case 5: return "Muy bajo"
    default: return ""
  }
}

export const getRiesgoColor = (nivel: number): string => {
  switch (nivel) {
    case 1: return "bg-destructive/20 text-destructive"
    case 2: return "bg-chart-4/20 text-chart-4"
    case 3: return "bg-warning/20 text-warning"
    case 4: return "bg-chart-2/20 text-chart-2"
    case 5: return "bg-success/20 text-success"
    default: return "bg-muted/20 text-muted-foreground"
  }
}

export const getCondicionLabel = (condicion: RiesgoCondicion): string => {
  switch (condicion) {
    case "adherencia_muy_baja": return "Adherencia < 40%"
    case "adherencia_baja": return "Adherencia entre 40–60%"
    case "ghq12_alto": return "GHQ-12 ≥ 7"
    case "ghq12_moderado": return "GHQ-12 entre 3–6"
    case "readiness_bajo": return "Readiness ≤ 2"
    case "inasistencia_alta": return "Inasistencia a controles > 30%"
    case "vive_solo": return "Vive solo/a"
    case "silencio_prolongado": return "Silencio > 7 días sin respuesta"
    case "caida_brusca": return "Caída brusca de nivel"
    default: return ""
  }
}

export const getAccionRecomendada = (nivel: number): string => {
  switch (nivel) {
    case 1: return "Escalada inmediata. Contacto telefónico. Alerta ROJA."
    case 2: return "Re-engagement. Contacto diario. Alerta NARANJA."
    case 3: return "Educar y ofrecer estrategias. Contacto cada 2–3 días. Alerta AMARILLA."
    case 4: return "Seguimiento normal cada 3–5 días. Refuerzo positivo."
    case 5: return "Reducir frecuencia de contacto. Seguimiento semanal."
    default: return ""
  }
}

export const getEstadoEmocionalLevel = (score: number): { level: EstadoEmocionalLevel; label: string; color: string } => {
  if (score <= 3) {
    return { level: "sin_malestar", label: "Sin malestar", color: "success" }
  } else if (score <= 7) {
    return { level: "malestar_moderado", label: "Malestar moderado", color: "warning" }
  } else {
    return { level: "malestar_elevado", label: "Malestar elevado", color: "destructive" }
  }
}

export const symptoms: SymptomReport[] = [
  // Patient P001 - Multiple reports with severity evolution
  { id: "S001", patientId: "P001", symptom: "Náuseas", category: "gastrointestinal", severity: 2, date: "2024-01-14" },
  { id: "S001b", patientId: "P001", symptom: "Náuseas", category: "gastrointestinal", severity: 3, date: "2024-01-10" },
  { id: "S001c", patientId: "P001", symptom: "Náuseas", category: "gastrointestinal", severity: 4, date: "2024-01-05" },
  { id: "S001d", patientId: "P001", symptom: "Náuseas", category: "gastrointestinal", severity: 5, date: "2024-01-01" },
  { id: "S002", patientId: "P001", symptom: "Fatiga", category: "metabolico", severity: 3, date: "2024-01-12" },
  { id: "S002b", patientId: "P001", symptom: "Fatiga", category: "metabolico", severity: 4, date: "2024-01-08" },
  { id: "S002c", patientId: "P001", symptom: "Fatiga", category: "metabolico", severity: 3, date: "2024-01-03" },
  { id: "S017", patientId: "P001", symptom: "Dolor de cabeza", category: "neurologico", severity: 2, date: "2024-01-11" },
  { id: "S017b", patientId: "P001", symptom: "Dolor de cabeza", category: "neurologico", severity: 3, date: "2024-01-06" },
  
  // Patient P002 - More diverse symptoms
  { id: "S003", patientId: "P002", symptom: "Mareos", category: "neurologico", severity: 4, date: "2024-01-13" },
  { id: "S003b", patientId: "P002", symptom: "Mareos", category: "neurologico", severity: 5, date: "2024-01-08" },
  { id: "S003c", patientId: "P002", symptom: "Mareos", category: "neurologico", severity: 4, date: "2024-01-03" },
  { id: "S004", patientId: "P002", symptom: "Dolor de cabeza", category: "neurologico", severity: 3, date: "2024-01-11" },
  { id: "S004b", patientId: "P002", symptom: "Dolor de cabeza", category: "neurologico", severity: 4, date: "2024-01-07" },
  { id: "S005", patientId: "P002", symptom: "Estreñimiento", category: "gastrointestinal", severity: 4, date: "2024-01-10" },
  { id: "S005b", patientId: "P002", symptom: "Estreñimiento", category: "gastrointestinal", severity: 3, date: "2024-01-04" },
  { id: "S006", patientId: "P002", symptom: "Insomnio", category: "psicologico", severity: 6, date: "2024-01-09" },
  { id: "S006b", patientId: "P002", symptom: "Insomnio", category: "psicologico", severity: 5, date: "2024-01-05" },
  { id: "S006c", patientId: "P002", symptom: "Insomnio", category: "psicologico", severity: 4, date: "2024-01-01" },
  { id: "S018", patientId: "P002", symptom: "Ansiedad", category: "psicologico", severity: 3, date: "2024-01-12" },
  { id: "S019", patientId: "P002", symptom: "Dolor muscular", category: "musculoesqueletico", severity: 2, date: "2024-01-10" },
  
  // Patient P004
  { id: "S007", patientId: "P004", symptom: "Náuseas", category: "gastrointestinal", severity: 4, date: "2024-01-14" },
  { id: "S007b", patientId: "P004", symptom: "Náuseas", category: "gastrointestinal", severity: 5, date: "2024-01-10" },
  { id: "S007c", patientId: "P004", symptom: "Náuseas", category: "gastrointestinal", severity: 6, date: "2024-01-05" },
  { id: "S008", patientId: "P004", symptom: "Fatiga", category: "metabolico", severity: 4, date: "2024-01-13" },
  { id: "S008b", patientId: "P004", symptom: "Fatiga", category: "metabolico", severity: 3, date: "2024-01-09" },
  { id: "S009", patientId: "P004", symptom: "Diarrea", category: "gastrointestinal", severity: 3, date: "2024-01-11" },
  { id: "S009b", patientId: "P004", symptom: "Diarrea", category: "gastrointestinal", severity: 4, date: "2024-01-07" },
  { id: "S020", patientId: "P004", symptom: "Palpitaciones", category: "cardiovascular", severity: 2, date: "2024-01-12" },
  
  // Patient P005 - Severe symptoms
  { id: "S010", patientId: "P005", symptom: "Náuseas", category: "gastrointestinal", severity: 7, date: "2024-01-05" },
  { id: "S010b", patientId: "P005", symptom: "Náuseas", category: "gastrointestinal", severity: 6, date: "2024-01-02" },
  { id: "S011", patientId: "P005", symptom: "Vómitos", category: "gastrointestinal", severity: 6, date: "2024-01-04" },
  { id: "S011b", patientId: "P005", symptom: "Vómitos", category: "gastrointestinal", severity: 7, date: "2024-01-01" },
  { id: "S012", patientId: "P005", symptom: "Fatiga", category: "metabolico", severity: 6, date: "2024-01-03" },
  { id: "S012b", patientId: "P005", symptom: "Fatiga", category: "metabolico", severity: 5, date: "2023-12-28" },
  { id: "S013", patientId: "P005", symptom: "Dolor abdominal", category: "gastrointestinal", severity: 5, date: "2024-01-02" },
  { id: "S013b", patientId: "P005", symptom: "Dolor abdominal", category: "gastrointestinal", severity: 4, date: "2023-12-30" },
  { id: "S014", patientId: "P005", symptom: "Mareos", category: "neurologico", severity: 4, date: "2024-01-01" },
  { id: "S014b", patientId: "P005", symptom: "Mareos", category: "neurologico", severity: 5, date: "2023-12-27" },
  { id: "S021", patientId: "P005", symptom: "Depresión", category: "psicologico", severity: 5, date: "2024-01-03" },
  
  // Patient P006 - Mild symptoms
  { id: "S015", patientId: "P006", symptom: "Fatiga", category: "metabolico", severity: 1, date: "2024-01-10" },
  { id: "S015b", patientId: "P006", symptom: "Fatiga", category: "metabolico", severity: 2, date: "2024-01-05" },
  { id: "S016", patientId: "P006", symptom: "Náuseas", category: "gastrointestinal", severity: 1, date: "2024-01-08" },
]

export const getPatientSymptoms = (patientId: string) => 
  symptoms.filter(s => s.patientId === patientId)

export interface ChatMessage {
  id: string
  sender: "patient" | "sarah"
  content: string
  timestamp: string
}

export interface PatientInteraction {
  id: string
  patientId: string
  summary: string
  date: string
  type: "medication_report" | "symptom_report" | "appointment" | "chat" | "weight_log" | "mood_log"
  result: "completed" | "skipped" | "error" | "pending"
  chatMessages?: ChatMessage[]
  isReviewed?: boolean
}

const interactionTypes = {
  medication_report: "Reporte de medicamento",
  symptom_report: "Reporte de síntomas",
  appointment: "Cita médica",
  chat: "Conversación",
  weight_log: "Registro de peso",
  mood_log: "Registro de ánimo"
}

const interactionResults = {
  completed: "Completado",
  skipped: "Omitido",
  error: "Error",
  pending: "Pendiente"
}

export const patientInteractions: PatientInteraction[] = [
  { 
    id: "I001", 
    patientId: "P001", 
    summary: "Tomé mi dosis de la mañana sin problemas", 
    date: "2024-01-15", 
    type: "medication_report", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM001", sender: "sarah", content: "Buenos dias Maria! Como te fue con tu medicamento de hoy?", timestamp: "2024-01-15T08:00:00" },
      { id: "CM002", sender: "patient", content: "Hola Sarah! Muy bien, lo tome a las 7am como siempre", timestamp: "2024-01-15T08:02:00" },
      { id: "CM003", sender: "sarah", content: "Excelente! Alguna molestia o efecto secundario?", timestamp: "2024-01-15T08:02:30" },
      { id: "CM004", sender: "patient", content: "No, todo normal. Me siento bien", timestamp: "2024-01-15T08:03:00" },
      { id: "CM005", sender: "sarah", content: "Me alegra escuchar eso! Recuerda tomar tu segunda dosis a las 8pm. Cualquier cosa aqui estoy.", timestamp: "2024-01-15T08:03:30" }
    ]
  },
  { 
    id: "I002", 
    patientId: "P001", 
    summary: "Me siento con más energía hoy", 
    date: "2024-01-15", 
    type: "mood_log", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM006", sender: "sarah", content: "Como te sientes hoy Maria?", timestamp: "2024-01-15T10:00:00" },
      { id: "CM007", sender: "patient", content: "Muy bien! Tengo mucha mas energia que antes", timestamp: "2024-01-15T10:01:00" },
      { id: "CM008", sender: "sarah", content: "Que bueno! Es normal sentir mas energia conforme avanza el tratamiento. Sigue asi!", timestamp: "2024-01-15T10:01:30" }
    ]
  },
  { 
    id: "I003", 
    patientId: "P001", 
    summary: "Registré mi peso: 92kg", 
    date: "2024-01-14", 
    type: "weight_log", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM009", sender: "sarah", content: "Hola Maria! Es momento de registrar tu peso semanal.", timestamp: "2024-01-14T09:00:00" },
      { id: "CM010", sender: "patient", content: "Claro! Hoy estoy en 92kg", timestamp: "2024-01-14T09:05:00" },
      { id: "CM011", sender: "sarah", content: "Perfecto! Eso es una reduccion de 13kg desde que empezaste. Vas muy bien!", timestamp: "2024-01-14T09:05:30" },
      { id: "CM012", sender: "patient", content: "Si! Estoy muy contenta con el progreso", timestamp: "2024-01-14T09:06:00" }
    ]
  },
  { 
    id: "I004", 
    patientId: "P001", 
    summary: "Consulta de seguimiento con Dr. Pérez", 
    date: "2024-01-12", 
    type: "appointment", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM013", sender: "sarah", content: "Recuerda que hoy tienes tu cita de seguimiento con el Dr. Perez a las 10:00 AM.", timestamp: "2024-01-12T07:00:00" },
      { id: "CM014", sender: "patient", content: "Si, ya estoy lista!", timestamp: "2024-01-12T07:30:00" },
      { id: "CM015", sender: "sarah", content: "Como te fue en la consulta?", timestamp: "2024-01-12T12:00:00" },
      { id: "CM016", sender: "patient", content: "Muy bien! El doctor esta contento con mi progreso", timestamp: "2024-01-12T12:15:00" },
      { id: "CM017", sender: "sarah", content: "Me alegra mucho! Registrare que asististe a tu cita.", timestamp: "2024-01-12T12:15:30" }
    ]
  },
  { 
    id: "I005", 
    patientId: "P002", 
    summary: "Olvidé tomar la dosis de la noche", 
    date: "2024-01-10", 
    type: "medication_report", 
    result: "skipped",
    isReviewed: false,
    chatMessages: [
      { id: "CM018", sender: "sarah", content: "Hola Carlos! Recuerda tomar tu medicamento de la noche.", timestamp: "2024-01-10T20:00:00" },
      { id: "CM019", sender: "sarah", content: "Carlos, aun no registro tu dosis de la noche. Esta todo bien?", timestamp: "2024-01-10T21:00:00" },
      { id: "CM020", sender: "patient", content: "Perdon Sarah, lo olvide completamente. Ya es muy tarde?", timestamp: "2024-01-10T22:30:00" },
      { id: "CM021", sender: "sarah", content: "Entiendo que a veces pasa. Por la hora, es mejor esperar a manana y retomar tu horario normal. No tomes dosis doble.", timestamp: "2024-01-10T22:31:00" },
      { id: "CM022", sender: "patient", content: "Ok, gracias por el consejo", timestamp: "2024-01-10T22:32:00" }
    ]
  },
  { 
    id: "I006", 
    patientId: "P002", 
    summary: "Reporté mareos después del almuerzo", 
    date: "2024-01-10", 
    type: "symptom_report", 
    result: "completed",
    isReviewed: false,
    chatMessages: [
      { id: "CM023", sender: "patient", content: "Sarah, me siento mareado despues de comer", timestamp: "2024-01-10T14:00:00" },
      { id: "CM024", sender: "sarah", content: "Lamento escuchar eso Carlos. Cuanto tiempo llevas con los mareos?", timestamp: "2024-01-10T14:01:00" },
      { id: "CM025", sender: "patient", content: "Como una hora ya", timestamp: "2024-01-10T14:02:00" },
      { id: "CM026", sender: "sarah", content: "Te recomiendo descansar un poco y tomar agua. Los mareos pueden ser un efecto secundario. Si persisten mas de 2 horas o empeoran, contacta al Dr. Perez.", timestamp: "2024-01-10T14:02:30" },
      { id: "CM027", sender: "patient", content: "Ok, voy a recostarme un rato", timestamp: "2024-01-10T14:03:00" },
      { id: "CM028", sender: "sarah", content: "Perfecto. Te escribo mas tarde para ver como sigues.", timestamp: "2024-01-10T14:03:30" }
    ]
  },
  { 
    id: "I007", 
    patientId: "P002", 
    summary: "No pude asistir a la cita", 
    date: "2024-01-08", 
    type: "appointment", 
    result: "skipped",
    isReviewed: true,
    chatMessages: [
      { id: "CM029", sender: "sarah", content: "Carlos, recuerda tu cita de hoy a las 3:00 PM.", timestamp: "2024-01-08T10:00:00" },
      { id: "CM030", sender: "patient", content: "Sarah, no voy a poder ir. Surgio algo en el trabajo", timestamp: "2024-01-08T14:00:00" },
      { id: "CM031", sender: "sarah", content: "Entiendo. Es importante reprogramar lo antes posible. Quieres que te ayude a buscar disponibilidad?", timestamp: "2024-01-08T14:01:00" },
      { id: "CM032", sender: "patient", content: "Si, por favor. La proxima semana si puedo", timestamp: "2024-01-08T14:02:00" }
    ]
  },
  { 
    id: "I008", 
    patientId: "P002", 
    summary: "Pregunté sobre efectos secundarios", 
    date: "2024-01-07", 
    type: "chat", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM033", sender: "patient", content: "Hola Sarah, tengo una pregunta sobre el medicamento", timestamp: "2024-01-07T15:00:00" },
      { id: "CM034", sender: "sarah", content: "Claro Carlos, dime en que puedo ayudarte", timestamp: "2024-01-07T15:00:30" },
      { id: "CM035", sender: "patient", content: "He tenido algunos mareos y me pregunto si es normal", timestamp: "2024-01-07T15:01:00" },
      { id: "CM036", sender: "sarah", content: "Los mareos son un efecto secundario comun al inicio del tratamiento. Suelen mejorar con el tiempo. Algunos consejos: levantate despacio, mantente hidratado, y evita movimientos bruscos.", timestamp: "2024-01-07T15:02:00" },
      { id: "CM037", sender: "patient", content: "Cuanto tiempo suelen durar?", timestamp: "2024-01-07T15:03:00" },
      { id: "CM038", sender: "sarah", content: "Generalmente mejoran en 2-4 semanas. Si son muy intensos o no mejoran, el medico puede ajustar la dosis. Quieres que lo anote para tu proxima cita?", timestamp: "2024-01-07T15:03:30" },
      { id: "CM039", sender: "patient", content: "Si, por favor. Gracias por la informacion", timestamp: "2024-01-07T15:04:00" }
    ]
  },
  { 
    id: "I009", 
    patientId: "P003", 
    summary: "Completé mi rutina de ejercicios", 
    date: "2024-01-15", 
    type: "chat", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM040", sender: "patient", content: "Sarah! Acabo de terminar mi rutina de ejercicio!", timestamp: "2024-01-15T07:30:00" },
      { id: "CM041", sender: "sarah", content: "Felicidades Ana! Que hiciste hoy?", timestamp: "2024-01-15T07:31:00" },
      { id: "CM042", sender: "patient", content: "30 minutos de caminata rapida y 15 de ejercicios de fuerza", timestamp: "2024-01-15T07:32:00" },
      { id: "CM043", sender: "sarah", content: "Excelente! Tu consistencia es admirable. Llevas 16 dias seguidos de ejercicio!", timestamp: "2024-01-15T07:32:30" }
    ]
  },
  { 
    id: "I010", 
    patientId: "P003", 
    summary: "Peso actual: 78kg, muy contenta", 
    date: "2024-01-15", 
    type: "weight_log", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM044", sender: "sarah", content: "Buenos dias Ana! Listo para el registro de peso semanal?", timestamp: "2024-01-15T08:00:00" },
      { id: "CM045", sender: "patient", content: "Si! Estoy en 78kg!!", timestamp: "2024-01-15T08:05:00" },
      { id: "CM046", sender: "sarah", content: "WOW! Eso es increible Ana! Has perdido 17kg desde el inicio. Tu esfuerzo esta dando resultados!", timestamp: "2024-01-15T08:05:30" },
      { id: "CM047", sender: "patient", content: "Estoy super feliz! Gracias por todo el apoyo", timestamp: "2024-01-15T08:06:00" }
    ]
  },
  { 
    id: "I011", 
    patientId: "P003", 
    summary: "Todas las dosis completadas esta semana", 
    date: "2024-01-14", 
    type: "medication_report", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM048", sender: "sarah", content: "Ana, completaste todas tus dosis esta semana! Perfecta adherencia.", timestamp: "2024-01-14T20:00:00" },
      { id: "CM049", sender: "patient", content: "Si! No falle ninguna", timestamp: "2024-01-14T20:01:00" },
      { id: "CM050", sender: "sarah", content: "Tu compromiso es ejemplar. Sigue asi!", timestamp: "2024-01-14T20:01:30" }
    ]
  },
  { 
    id: "I012", 
    patientId: "P003", 
    summary: "Cita de control nutricional", 
    date: "2024-01-13", 
    type: "appointment", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM051", sender: "sarah", content: "Hola Ana! Recuerda tu cita de nutricion hoy a las 11:00 AM.", timestamp: "2024-01-13T08:00:00" },
      { id: "CM052", sender: "patient", content: "Ya estoy lista! Tengo varias preguntas para la nutriologa", timestamp: "2024-01-13T08:30:00" },
      { id: "CM053", sender: "sarah", content: "Excelente! Como te fue?", timestamp: "2024-01-13T13:00:00" },
      { id: "CM054", sender: "patient", content: "Muy bien! Me dieron un nuevo plan alimenticio para esta etapa", timestamp: "2024-01-13T13:30:00" }
    ]
  },
  { 
    id: "I013", 
    patientId: "P004", 
    summary: "Tuve náuseas pero tomé el medicamento", 
    date: "2024-01-14", 
    type: "medication_report", 
    result: "completed",
    isReviewed: false,
    chatMessages: [
      { id: "CM055", sender: "sarah", content: "Roberto, como te fue con la dosis de hoy?", timestamp: "2024-01-14T09:00:00" },
      { id: "CM056", sender: "patient", content: "Lo tome pero me dieron nauseas", timestamp: "2024-01-14T09:30:00" },
      { id: "CM057", sender: "sarah", content: "Lamento escuchar eso. Las nauseas pueden aliviarse tomando el medicamento con algo de comida. Lo tomaste en ayunas?", timestamp: "2024-01-14T09:31:00" },
      { id: "CM058", sender: "patient", content: "Si, lo tome antes del desayuno", timestamp: "2024-01-14T09:32:00" },
      { id: "CM059", sender: "sarah", content: "Te recomiendo tomarlo durante o despues de una comida ligera. Eso suele ayudar mucho.", timestamp: "2024-01-14T09:32:30" }
    ]
  },
  { 
    id: "I014", 
    patientId: "P004", 
    summary: "Error al sincronizar datos de peso", 
    date: "2024-01-13", 
    type: "weight_log", 
    result: "error",
    isReviewed: false,
    chatMessages: [
      { id: "CM060", sender: "sarah", content: "Roberto, es momento de registrar tu peso.", timestamp: "2024-01-13T09:00:00" },
      { id: "CM061", sender: "patient", content: "Hoy estoy en 102kg", timestamp: "2024-01-13T09:15:00" },
      { id: "CM062", sender: "sarah", content: "Hubo un problema al guardar tu registro. Puedes intentarlo de nuevo?", timestamp: "2024-01-13T09:15:30" },
      { id: "CM063", sender: "patient", content: "Ya lo intente 3 veces y no funciona", timestamp: "2024-01-13T09:20:00" },
      { id: "CM064", sender: "sarah", content: "Disculpa las molestias. He reportado el problema tecnico. Tu peso ha sido anotado manualmente.", timestamp: "2024-01-13T09:21:00" }
    ]
  },
  { 
    id: "I015", 
    patientId: "P004", 
    summary: "Reporté fatiga durante el día", 
    date: "2024-01-12", 
    type: "symptom_report", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM065", sender: "patient", content: "Me siento muy cansado hoy", timestamp: "2024-01-12T16:00:00" },
      { id: "CM066", sender: "sarah", content: "Cuanto tiempo llevas sintiendote asi?", timestamp: "2024-01-12T16:01:00" },
      { id: "CM067", sender: "patient", content: "Desde la manana, pero empeoro despues del almuerzo", timestamp: "2024-01-12T16:02:00" },
      { id: "CM068", sender: "sarah", content: "La fatiga puede ser un efecto secundario. Dormiste bien anoche?", timestamp: "2024-01-12T16:02:30" },
      { id: "CM069", sender: "patient", content: "No muy bien, me desperte varias veces", timestamp: "2024-01-12T16:03:00" },
      { id: "CM070", sender: "sarah", content: "El descanso es importante para tu tratamiento. Te envio algunos consejos para mejorar el sueno.", timestamp: "2024-01-12T16:03:30" }
    ]
  },
  { 
    id: "I016", 
    patientId: "P005", 
    summary: "No me sentí bien para registrar", 
    date: "2024-01-05", 
    type: "medication_report", 
    result: "skipped",
    isReviewed: false,
    chatMessages: [
      { id: "CM071", sender: "sarah", content: "Laura, recuerda tomar tu medicamento.", timestamp: "2024-01-05T08:00:00" },
      { id: "CM072", sender: "sarah", content: "Laura, no he recibido tu registro. Esta todo bien?", timestamp: "2024-01-05T12:00:00" },
      { id: "CM073", sender: "patient", content: "No me siento bien para nada", timestamp: "2024-01-05T14:00:00" },
      { id: "CM074", sender: "sarah", content: "Que sientes exactamente? Estoy aqui para ayudarte.", timestamp: "2024-01-05T14:01:00" },
      { id: "CM075", sender: "patient", content: "Nauseas, me duele la cabeza, no tengo ganas de nada", timestamp: "2024-01-05T14:05:00" },
      { id: "CM076", sender: "sarah", content: "Entiendo. Es importante que hables con el medico sobre estos sintomas. Puedo ayudarte a contactarlo?", timestamp: "2024-01-05T14:05:30" }
    ]
  },
  { 
    id: "I017", 
    patientId: "P005", 
    summary: "Vómitos severos reportados", 
    date: "2024-01-04", 
    type: "symptom_report", 
    result: "completed",
    isReviewed: false,
    chatMessages: [
      { id: "CM077", sender: "patient", content: "Sarah no puedo mas, he vomitado 3 veces hoy", timestamp: "2024-01-04T11:00:00" },
      { id: "CM078", sender: "sarah", content: "Lo siento mucho Laura. Esto es importante. Has podido tomar liquidos?", timestamp: "2024-01-04T11:01:00" },
      { id: "CM079", sender: "patient", content: "Muy poco, todo me da asco", timestamp: "2024-01-04T11:02:00" },
      { id: "CM080", sender: "sarah", content: "Necesitas hablar con el medico hoy. Te recomiendo ir a urgencias si los vomitos continuan. Quieres que contacte a tu red de apoyo?", timestamp: "2024-01-04T11:02:30" },
      { id: "CM081", sender: "patient", content: "Si, avisa a mis papas por favor", timestamp: "2024-01-04T11:03:00" }
    ]
  },
  { 
    id: "I018", 
    patientId: "P005", 
    summary: "Cancelé mi cita por malestar", 
    date: "2024-01-03", 
    type: "appointment", 
    result: "skipped",
    isReviewed: true,
    chatMessages: [
      { id: "CM082", sender: "sarah", content: "Laura, recuerda tu cita de hoy a las 4:00 PM.", timestamp: "2024-01-03T10:00:00" },
      { id: "CM083", sender: "patient", content: "No voy a poder ir, me siento muy mal", timestamp: "2024-01-03T12:00:00" },
      { id: "CM084", sender: "sarah", content: "Entiendo Laura. Es importante reprogramar pronto dado como te has sentido. El medico necesita evaluarte.", timestamp: "2024-01-03T12:01:00" },
      { id: "CM085", sender: "patient", content: "Ok, pero no se si pueda pronto", timestamp: "2024-01-03T12:05:00" }
    ]
  },
  { 
    id: "I019", 
    patientId: "P005", 
    summary: "Solicité hablar con un médico", 
    date: "2024-01-02", 
    type: "chat", 
    result: "pending",
    isReviewed: false,
    chatMessages: [
      { id: "CM086", sender: "patient", content: "Necesito hablar con el doctor urgente", timestamp: "2024-01-02T09:00:00" },
      { id: "CM087", sender: "sarah", content: "Entiendo Laura. Que esta pasando?", timestamp: "2024-01-02T09:01:00" },
      { id: "CM088", sender: "patient", content: "No aguanto los efectos del medicamento. Quiero dejarlo", timestamp: "2024-01-02T09:02:00" },
      { id: "CM089", sender: "sarah", content: "Comprendo tu frustracion. Es muy importante que no dejes el medicamento sin supervision medica. Voy a solicitar una llamada urgente con el Dr. Perez.", timestamp: "2024-01-02T09:02:30" },
      { id: "CM090", sender: "patient", content: "Gracias, necesito que me llame hoy", timestamp: "2024-01-02T09:03:00" },
      { id: "CM091", sender: "sarah", content: "He enviado la solicitud marcada como urgente. El equipo medico te contactara lo antes posible.", timestamp: "2024-01-02T09:03:30" }
    ]
  },
  { 
    id: "I020", 
    patientId: "P006", 
    summary: "Todo bien con la medicación", 
    date: "2024-01-15", 
    type: "medication_report", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM092", sender: "sarah", content: "Buenos dias Miguel! Como te fue con tu medicamento?", timestamp: "2024-01-15T08:30:00" },
      { id: "CM093", sender: "patient", content: "Todo perfecto, sin problemas", timestamp: "2024-01-15T08:35:00" },
      { id: "CM094", sender: "sarah", content: "Excelente! Tu consistencia es admirable.", timestamp: "2024-01-15T08:35:30" }
    ]
  },
  { 
    id: "I021", 
    patientId: "P006", 
    summary: "Mi ánimo está muy positivo", 
    date: "2024-01-15", 
    type: "mood_log", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM095", sender: "sarah", content: "Miguel, como te sientes hoy emocionalmente?", timestamp: "2024-01-15T12:00:00" },
      { id: "CM096", sender: "patient", content: "Muy bien! Me siento positivo y motivado", timestamp: "2024-01-15T12:05:00" },
      { id: "CM097", sender: "sarah", content: "Me alegra mucho escuchar eso! Tu actitud positiva es clave en tu progreso.", timestamp: "2024-01-15T12:05:30" }
    ]
  },
  { 
    id: "I022", 
    patientId: "P006", 
    summary: "Registré 95kg, sigo bajando", 
    date: "2024-01-14", 
    type: "weight_log", 
    result: "completed",
    isReviewed: true,
    chatMessages: [
      { id: "CM098", sender: "sarah", content: "Hola Miguel! Listo para registrar tu peso?", timestamp: "2024-01-14T09:00:00" },
      { id: "CM099", sender: "patient", content: "Si! Estoy en 95kg", timestamp: "2024-01-14T09:10:00" },
      { id: "CM100", sender: "sarah", content: "Fantastico! Has bajado 15kg desde el inicio. Tu progreso es excelente!", timestamp: "2024-01-14T09:10:30" },
      { id: "CM101", sender: "patient", content: "Gracias! Me siento cada vez mejor", timestamp: "2024-01-14T09:11:00" }
    ]
  },
]

export const getPatientInteractions = (patientId: string): PatientInteraction[] => {
  return patientInteractions
    .filter(i => i.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getInteractionTypeLabel = (type: PatientInteraction["type"]) => interactionTypes[type]
export const getInteractionResultLabel = (result: PatientInteraction["result"]) => interactionResults[result]

export const markInteractionAsReviewed = (interactionId: string): boolean => {
  const interaction = patientInteractions.find(i => i.id === interactionId)
  if (interaction) {
    interaction.isReviewed = true
    return true
  }
  return false
}

// Patient Intent Types
export type PatientIntentType = 
  | "report_adherence"
  | "report_non_adherence"
  | "report_symptom"
  | "negative_emotion"
  | "positive_emotion"
  | "show_resistance"
  | "request_help"
  | "express_doubt"
  | "confirm"
  | "partial_response"

export interface PatientIntentData {
  intent: PatientIntentType
  label: string
  count: number
  percentage: number
}

const intentLabels: Record<PatientIntentType, string> = {
  report_adherence: "Reportar adherencia",
  report_non_adherence: "Reportar no adherencia",
  report_symptom: "Reportar síntoma",
  negative_emotion: "Expresar emoción negativa",
  positive_emotion: "Expresar emoción positiva",
  show_resistance: "Mostrar resistencia",
  request_help: "Solicitar ayuda",
  express_doubt: "Expresar duda",
  confirm: "Confirmar",
  partial_response: "Responder parcialmente"
}

export const getPatientIntents = (patientId: string): PatientIntentData[] => {
  const patient = patients.find(p => p.id === patientId)
  if (!patient) return []

  // Generate intent distribution based on patient profile
  const totalMessages = patient.messagesCount
  const isHighAdherence = patient.adherence >= 80
  const isPositiveMood = patient.mood >= 4

  // Base distribution varies by patient profile
  const baseDistribution: Record<PatientIntentType, number> = {
    report_adherence: isHighAdherence ? 0.25 : 0.10,
    report_non_adherence: isHighAdherence ? 0.05 : 0.15,
    report_symptom: patient.symptomsCount > 2 ? 0.15 : 0.08,
    negative_emotion: isPositiveMood ? 0.05 : 0.15,
    positive_emotion: isPositiveMood ? 0.15 : 0.05,
    show_resistance: patient.estadoEmocional >= 20 ? 0.10 : 0.03,
    request_help: 0.10,
    express_doubt: isHighAdherence ? 0.05 : 0.12,
    confirm: 0.15,
    partial_response: 0.07
  }

  // Normalize to 100%
  const total = Object.values(baseDistribution).reduce((a, b) => a + b, 0)
  
  return Object.entries(baseDistribution).map(([intent, ratio]) => {
    const normalizedRatio = ratio / total
    const count = Math.round(totalMessages * normalizedRatio)
    return {
      intent: intent as PatientIntentType,
      label: intentLabels[intent as PatientIntentType],
      count,
      percentage: Math.round(normalizedRatio * 100)
    }
  }).sort((a, b) => b.count - a.count)
}

export const getIntentLabel = (intent: PatientIntentType) => intentLabels[intent]

// Medical Events Frequency
export interface MedicalEventFrequency {
  eventsPerWeek: number
  scheduledEvents: number
  completedEvents: number
}

export const getMedicalEventFrequency = (patientId: string): MedicalEventFrequency => {
  const patient = patients.find(p => p.id === patientId)
  if (!patient) return { eventsPerWeek: 0, scheduledEvents: 0, completedEvents: 0 }

  const weeksInTreatment = Math.ceil(patient.treatmentDays / 7)
  const totalEvents = patient.appointmentsTotal + Math.floor(patient.treatmentDays / 7) * 2 // appointments + weekly check-ins
  
  return {
    eventsPerWeek: Math.round((totalEvents / weeksInTreatment) * 10) / 10,
    scheduledEvents: totalEvents,
    completedEvents: patient.appointmentsAttended + Math.floor(patient.adherence / 100 * patient.treatmentDays / 7) * 2
  }
}

// ============================================
// NEW ENTITIES: Clinical Records, Medication Plans, Messages, Caregivers
// ============================================

// Caregiver (Red de Apoyo)
export interface Caregiver {
  id: string
  patientId: string
  name: string
  relationship: "spouse" | "parent" | "child" | "sibling" | "friend" | "other"
  phone: string
  email: string
  isPrimary: boolean
}

export const caregivers: Caregiver[] = [
  { id: "CG001", patientId: "P001", name: "Juan García", relationship: "spouse", phone: "+52 555 123 4567", email: "juan.garcia@email.com", isPrimary: true },
  { id: "CG002", patientId: "P001", name: "Sofia García", relationship: "child", phone: "+52 555 234 5678", email: "sofia.garcia@email.com", isPrimary: false },
  { id: "CG003", patientId: "P002", name: "Elena Rodríguez", relationship: "spouse", phone: "+52 555 345 6789", email: "elena.rodriguez@email.com", isPrimary: true },
  { id: "CG004", patientId: "P003", name: "Pedro Martínez", relationship: "parent", phone: "+52 555 456 7890", email: "pedro.martinez@email.com", isPrimary: true },
  { id: "CG005", patientId: "P004", name: "Carmen Sánchez", relationship: "spouse", phone: "+52 555 567 8901", email: "carmen.sanchez@email.com", isPrimary: true },
  { id: "CG006", patientId: "P005", name: "Roberto Fernández", relationship: "parent", phone: "+52 555 678 9012", email: "roberto.fernandez@email.com", isPrimary: true },
  { id: "CG007", patientId: "P005", name: "María Fernández", relationship: "parent", phone: "+52 555 789 0123", email: "maria.fernandez@email.com", isPrimary: false },
  { id: "CG008", patientId: "P006", name: "Laura Torres", relationship: "spouse", phone: "+52 555 890 1234", email: "laura.torres@email.com", isPrimary: true },
]

export const getPatientCaregivers = (patientId: string): Caregiver[] => 
  caregivers.filter(c => c.patientId === patientId)

export const getRelationshipLabel = (rel: Caregiver["relationship"]): string => {
  const labels = {
    spouse: "Cónyuge",
    parent: "Padre/Madre",
    child: "Hijo/a",
    sibling: "Hermano/a",
    friend: "Amigo/a",
    other: "Otro"
  }
  return labels[rel]
}

// Clinical Note (Nota Clínica)
export interface ClinicalNote {
  id: string
  author: string
  date: string
  content: string
}

// Clinical Record (Ficha Clínica)
export interface ClinicalRecord {
  id: string
  patientId: string
  recordDate: string
  diagnosis: string
  comorbidities: string[]
  allergies: string[]
  bloodType: string
  notes: ClinicalNote[]
  externalSystemId?: string
  importedAt?: string
  lastUpdated: string
  physician: string
}

export const clinicalRecords: ClinicalRecord[] = [
  {
    id: "CR001",
    patientId: "P001",
    recordDate: "2023-10-15",
    diagnosis: "Obesidad grado I (IMC 30-34.9)",
    comorbidities: ["Prediabetes"],
    allergies: ["Penicilina"],
    bloodType: "O+",
    notes: [
      {
        id: "N001",
        author: "Dr. Juan Pérez",
        date: "2024-01-15",
        content: "Control de seguimiento. Paciente refiere buena tolerancia al tratamiento con Semaglutida 0.5mg semanal. HbA1c descendió de 6.2% a 5.8%, saliendo del rango prediabético. Peso actual 92kg (-13kg desde inicio). Continuar dosis actual y mantener plan nutricional hipocalórico."
      },
      {
        id: "N002",
        author: "Dr. Juan Pérez",
        date: "2023-12-18",
        content: "Paciente reporta náuseas leves los primeros 2 días post-inyección que ceden espontáneamente. Glicemia en ayunas 102 mg/dL. Se observa mejoría en patrón alimentario con reducción de ingesta compulsiva. Peso 95kg. Solicito panel metabólico de control."
      },
      {
        id: "N003",
        author: "Dr. Juan Pérez",
        date: "2023-10-15",
        content: "Primera consulta. Mujer de 45 años con obesidad grado I (IMC 33.8) y prediabetes (HbA1c 6.2%). Antecedentes familiares de DM2 (madre y hermano). Se inicia tratamiento con Semaglutida 0.25mg semanal con titulación progresiva. Se deriva a nutrición para plan alimentario personalizado."
      }
    ],
    externalSystemId: "EXT-2023-45678",
    importedAt: "2023-10-15T10:30:00",
    lastUpdated: "2024-01-15",
    physician: "Dr. Juan Pérez"
  },
  {
    id: "CR002",
    patientId: "P002",
    recordDate: "2023-11-01",
    diagnosis: "Obesidad grado II (IMC 35-39.9)",
    comorbidities: ["Diabetes tipo 2", "Apnea del sueño", "Artrosis de rodilla"],
    allergies: [],
    bloodType: "A+",
    notes: [
      {
        id: "N004",
        author: "Dr. Juan Pérez",
        date: "2024-01-10",
        content: "Paciente con múltiples comorbilidades. Requiere monitoreo frecuente de glucosa. Considerar cirugía bariátrica si no hay respuesta al tratamiento en 6 meses."
      }
    ],
    externalSystemId: "EXT-2023-56789",
    importedAt: "2023-11-01T14:15:00",
    lastUpdated: "2024-01-10",
    physician: "Dr. Juan Pérez"
  },
  {
    id: "CR003",
    patientId: "P003",
    recordDate: "2023-09-20",
    diagnosis: "Obesidad grado I (IMC 30-34.9)",
    comorbidities: [],
    allergies: ["Sulfas"],
    bloodType: "B+",
    notes: [
      {
        id: "N005",
        author: "Dr. Juan Pérez",
        date: "2024-01-15",
        content: "Excelente respuesta al tratamiento. Paciente muy motivada y comprometida con cambios de estilo de vida."
      }
    ],
    externalSystemId: "EXT-2023-34567",
    importedAt: "2023-09-20T09:00:00",
    lastUpdated: "2024-01-15",
    physician: "Dr. Juan Pérez"
  },
  {
    id: "CR004",
    patientId: "P004",
    recordDate: "2023-11-15",
    diagnosis: "Obesidad grado I (IMC 30-34.9)",
    comorbidities: ["Hipertensión arterial", "Hipotiroidismo"],
    allergies: ["Ibuprofeno"],
    bloodType: "AB+",
    notes: [
      {
        id: "N006",
        author: "Dr. Juan Pérez",
        date: "2024-01-14",
        content: "Paciente de edad avanzada, requiere ajustes de dosis más conservadores. Monitorear función tiroidea."
      }
    ],
    lastUpdated: "2024-01-14",
    physician: "Dr. Juan Pérez"
  },
  {
    id: "CR005",
    patientId: "P005",
    recordDate: "2023-12-01",
    diagnosis: "Obesidad grado I (IMC 30-34.9)",
    comorbidities: ["Ansiedad", "Depresión leve"],
    allergies: [],
    bloodType: "O-",
    notes: [
      {
        id: "N007",
        author: "Dr. Juan Pérez",
        date: "2024-01-05",
        content: "Paciente con componente emocional importante. Derivada a psicología para manejo conjunto. Alta incidencia de efectos secundarios."
      }
    ],
    lastUpdated: "2024-01-05",
    physician: "Dr. Juan Pérez"
  },
  {
    id: "CR006",
    patientId: "P006",
    recordDate: "2023-10-01",
    diagnosis: "Obesidad grado I (IMC 30-34.9)",
    comorbidities: ["Dislipidemia"],
    allergies: [],
    bloodType: "A-",
    notes: [
      {
        id: "N008",
        author: "Dr. Juan Pérez",
        date: "2024-01-15",
        content: "Buena evolución. Lípidos mejorando con la pérdida de peso. Continuar con plan actual."
      }
    ],
    externalSystemId: "EXT-2023-23456",
    importedAt: "2023-10-01T11:45:00",
    lastUpdated: "2024-01-15",
    physician: "Dr. Juan Pérez"
  }
]

export const getPatientClinicalRecord = (patientId: string): ClinicalRecord | null => 
  clinicalRecords.find(r => r.patientId === patientId) || null

// Medication Plan
export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  schedule: string[]
  startDate: string
  endDate?: string
  instructions: string
  isActive: boolean
}

export interface MedicationPlan {
  id: string
  patientId: string
  medications: Medication[]
  createdAt: string
  updatedAt: string
  updatedBy: string
  notes: string
}

export const medicationPlans: MedicationPlan[] = [
  {
    id: "MP001",
    patientId: "P001",
    medications: [
      { id: "M001", name: "Semaglutida", dosage: "0.5mg", frequency: "Semanal", schedule: ["Lunes 08:00"], startDate: "2023-10-15", instructions: "Inyección subcutánea. Aplicar en abdomen, muslo o brazo.", isActive: true },
      { id: "M002", name: "Metformina", dosage: "850mg", frequency: "Diario", schedule: ["08:00", "20:00"], startDate: "2023-10-15", instructions: "Tomar con alimentos.", isActive: true }
    ],
    createdAt: "2023-10-15",
    updatedAt: "2024-01-10",
    updatedBy: "Dr. Juan Pérez",
    notes: "Paciente tolera bien la medicación. Considerar aumentar semaglutida a 1mg en próxima visita."
  },
  {
    id: "MP002",
    patientId: "P002",
    medications: [
      { id: "M003", name: "Semaglutida", dosage: "1.0mg", frequency: "Semanal", schedule: ["Miércoles 09:00"], startDate: "2023-11-01", instructions: "Inyección subcutánea.", isActive: true },
      { id: "M004", name: "Metformina", dosage: "1000mg", frequency: "Diario", schedule: ["07:00", "13:00", "20:00"], startDate: "2023-11-01", instructions: "Tomar con alimentos principales.", isActive: true },
      { id: "M005", name: "Atorvastatina", dosage: "20mg", frequency: "Diario", schedule: ["22:00"], startDate: "2023-11-01", instructions: "Tomar antes de dormir.", isActive: true }
    ],
    createdAt: "2023-11-01",
    updatedAt: "2024-01-08",
    updatedBy: "Dr. Juan Pérez",
    notes: "Paciente reporta mareos. Monitorear y considerar reducir dosis si persisten."
  },
  {
    id: "MP003",
    patientId: "P003",
    medications: [
      { id: "M006", name: "Semaglutida", dosage: "1.7mg", frequency: "Semanal", schedule: ["Viernes 07:00"], startDate: "2023-09-20", instructions: "Inyección subcutánea.", isActive: true }
    ],
    createdAt: "2023-09-20",
    updatedAt: "2024-01-12",
    updatedBy: "Dr. Juan Pérez",
    notes: "Excelente tolerancia. Dosis máxima alcanzada con muy buenos resultados."
  },
  {
    id: "MP004",
    patientId: "P004",
    medications: [
      { id: "M007", name: "Semaglutida", dosage: "0.5mg", frequency: "Semanal", schedule: ["Sábado 08:00"], startDate: "2023-11-15", instructions: "Inyección subcutánea. Iniciar con dosis baja por edad.", isActive: true },
      { id: "M008", name: "Levotiroxina", dosage: "75mcg", frequency: "Diario", schedule: ["06:00"], startDate: "2023-06-01", instructions: "Tomar en ayunas, 30 min antes del desayuno.", isActive: true },
      { id: "M009", name: "Losartán", dosage: "50mg", frequency: "Diario", schedule: ["08:00"], startDate: "2023-03-15", instructions: "Tomar con o sin alimentos.", isActive: true }
    ],
    createdAt: "2023-11-15",
    updatedAt: "2024-01-14",
    updatedBy: "Dr. Juan Pérez",
    notes: "Mantener dosis conservadora de semaglutida. Buen control de tiroides y presión arterial."
  },
  {
    id: "MP005",
    patientId: "P005",
    medications: [
      { id: "M010", name: "Semaglutida", dosage: "0.25mg", frequency: "Semanal", schedule: ["Domingo 09:00"], startDate: "2023-12-01", instructions: "Dosis mínima por intolerancia.", isActive: true },
      { id: "M011", name: "Omeprazol", dosage: "20mg", frequency: "Diario", schedule: ["07:00"], startDate: "2023-12-15", instructions: "Tomar en ayunas para protección gástrica.", isActive: true }
    ],
    createdAt: "2023-12-01",
    updatedAt: "2024-01-05",
    updatedBy: "Dr. Juan Pérez",
    notes: "PRECAUCIÓN: Paciente con múltiples efectos secundarios. No aumentar dosis sin evaluación presencial."
  },
  {
    id: "MP006",
    patientId: "P006",
    medications: [
      { id: "M012", name: "Semaglutida", dosage: "1.0mg", frequency: "Semanal", schedule: ["Martes 08:00"], startDate: "2023-10-01", instructions: "Inyección subcutánea.", isActive: true },
      { id: "M013", name: "Rosuvastatina", dosage: "10mg", frequency: "Diario", schedule: ["22:00"], startDate: "2023-10-01", instructions: "Tomar antes de dormir.", isActive: true }
    ],
    createdAt: "2023-10-01",
    updatedAt: "2024-01-15",
    updatedBy: "Dr. Juan Pérez",
    notes: "Buena evolución. Lípidos controlados. Considerar aumentar a 1.7mg si estanca pérdida de peso."
  }
]

export const getPatientMedicationPlan = (patientId: string): MedicationPlan | null =>
  medicationPlans.find(p => p.patientId === patientId) || null

// Messages
export type MessageRecipientType = "patient" | "caregiver"
export type MessageStatus = "sent" | "delivered" | "read" | "failed"
export type MessageChannel = "app" | "sms" | "email"

export interface Message {
  id: string
  patientId: string
  recipientType: MessageRecipientType
  recipientId: string
  recipientName: string
  channel: MessageChannel
  subject: string
  content: string
  sentAt: string
  status: MessageStatus
  sentBy: string
}

export const messages: Message[] = [
  { id: "MSG001", patientId: "P001", recipientType: "patient", recipientId: "P001", recipientName: "María García", channel: "app", subject: "Recordatorio de cita", content: "Recuerde su cita de seguimiento mañana a las 10:00 AM.", sentAt: "2024-01-14T08:00:00", status: "read", sentBy: "Dr. Juan Pérez" },
  { id: "MSG002", patientId: "P001", recipientType: "caregiver", recipientId: "CG001", recipientName: "Juan García", channel: "sms", subject: "Actualización de progreso", content: "María está mostrando excelente progreso en su tratamiento. Continúen apoyándola.", sentAt: "2024-01-10T15:30:00", status: "delivered", sentBy: "Dr. Juan Pérez" },
  { id: "MSG003", patientId: "P002", recipientType: "patient", recipientId: "P002", recipientName: "Carlos Rodríguez", channel: "app", subject: "Seguimiento de síntomas", content: "Hemos notado reportes de mareos. Por favor agende una consulta lo antes posible.", sentAt: "2024-01-11T09:15:00", status: "read", sentBy: "Dr. Juan Pérez" },
  { id: "MSG004", patientId: "P002", recipientType: "caregiver", recipientId: "CG003", recipientName: "Elena Rodríguez", channel: "email", subject: "Alerta de adherencia", content: "Carlos ha tenido dificultades con la adherencia al tratamiento. Su apoyo es fundamental.", sentAt: "2024-01-09T11:00:00", status: "read", sentBy: "Dr. Juan Pérez" },
  { id: "MSG005", patientId: "P003", recipientType: "patient", recipientId: "P003", recipientName: "Ana Martínez", channel: "app", subject: "Felicitaciones", content: "Excelente progreso! Ha alcanzado su meta de peso del mes.", sentAt: "2024-01-13T14:00:00", status: "read", sentBy: "Dr. Juan Pérez" },
  { id: "MSG006", patientId: "P005", recipientType: "patient", recipientId: "P005", recipientName: "Laura Fernández", channel: "app", subject: "Preocupación por síntomas", content: "Hemos notado síntomas severos. Es importante que nos contacte para ajustar el tratamiento.", sentAt: "2024-01-06T10:00:00", status: "delivered", sentBy: "Dr. Juan Pérez" },
  { id: "MSG007", patientId: "P005", recipientType: "caregiver", recipientId: "CG006", recipientName: "Roberto Fernández", channel: "sms", subject: "Alerta importante", content: "Laura necesita apoyo adicional. Por favor contacten a la clínica.", sentAt: "2024-01-05T16:30:00", status: "delivered", sentBy: "Dr. Juan Pérez" },
]

export const getPatientMessages = (patientId: string): Message[] =>
  messages.filter(m => m.patientId === patientId).sort((a, b) => 
    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  )

export const getMessageStatusLabel = (status: MessageStatus): string => {
  const labels = { sent: "Enviado", delivered: "Entregado", read: "Leído", failed: "Fallido" }
  return labels[status]
}

export const getMessageChannelLabel = (channel: MessageChannel): string => {
  const labels = { app: "Aplicación", sms: "SMS", email: "Email" }
  return labels[channel]
}

export const aggregateMetrics = () => {
  const total = patients.length
  const avgAdherence = patients.reduce((sum, p) => sum + (p.adherenceFarmacologica + p.adherenciaCuidado + p.persistencia) / 3, 0) / total
  const avgBmiChange = patients.reduce((sum, p) => sum + p.bmiChange, 0) / total
  const criticalPatients = patients.filter(p => p.estadoEmocional >= 20).length
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
