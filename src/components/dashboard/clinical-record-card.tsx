
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  RefreshCw,
  Droplets,
  AlertCircle,
  Stethoscope,
  Calendar as CalendarIcon,
  User,
  ExternalLink,
  Edit3,
  Save,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  Pause,
  Lock,
  FileText,
  Phone,
  MapPin,
  Cigarette,
  Wine,
  Dumbbell,
  Clock,
  History,
  CheckCircle,
  Shield
} from "lucide-react"
import type { ClinicalRecord, Patient } from "@/lib/mock-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Extended interfaces for the new data
interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  status: "active" | "suspended"
  startDate: string
  suspendedDate?: string
  suspendedReason?: string
  notes: { text: string; author: string; date: string }[]
  history: { action: string; date: string; user: string; details: string }[]
}

interface ClinicalNote {
  id: string
  content: string
  author: string
  date: string
  correctedBy?: { noteId: string; content: string; author: string; date: string }
}

interface ChangeHistoryEntry {
  id: string
  date: string
  user: string
  action: string
  fieldName: string
  oldValue: string
  newValue: string
}

interface ExtendedClinicalRecord extends ClinicalRecord {
  rut?: string
  birthDate?: string
  sex?: "M" | "F"
  healthInsurance?: "Fonasa" | "Isapre"
  phone?: string
  address?: string
  habits?: {
    tobacco: boolean
    alcohol: boolean
    physicalActivity: boolean
  }
  familyHistory?: string
  cie10Code?: string
  medications?: Medication[]
  clinicalNotes?: ClinicalNote[]
  changeHistory?: ChangeHistoryEntry[]
  responsibleProfessional?: string
  specialty?: string
  signatureStatus?: "signed" | "pending" | "draft"
}

interface ClinicalRecordCardProps {
  record: ClinicalRecord | null
  patient: Patient
  onImport?: (externalId: string) => void
  onRefresh?: () => void
}

// Mock extended data
const getExtendedRecord = (record: ClinicalRecord | null, patient: Patient): ExtendedClinicalRecord | null => {
  if (!record) return null
  
  return {
    ...record,
    rut: "12.345.678-9",
    birthDate: "1979-03-15",
    sex: patient.gender,
    healthInsurance: "Fonasa",
    phone: "+56 9 1234 5678",
    address: "Av. Principal 1234, Santiago, Chile",
    habits: {
      tobacco: false,
      alcohol: true,
      physicalActivity: true
    },
    familyHistory: "Padre con diabetes tipo 2. Madre con hipertension arterial. Hermano mayor con obesidad.",
    cie10Code: "E66.0",
    medications: [
      {
        id: "MED001",
        name: "Semaglutida",
        dosage: "0.5mg",
        frequency: "Semanal",
        status: "active",
        startDate: "2023-10-15",
        notes: [
          { text: "Buena tolerancia inicial", author: "Dr. Juan Perez", date: "2023-10-20" },
          { text: "Sin efectos adversos significativos", author: "Dr. Juan Perez", date: "2023-11-15" }
        ],
        history: [
          { action: "Creacion", date: "2023-10-15", user: "Dr. Juan Perez", details: "Inicio de tratamiento" }
        ]
      },
      {
        id: "MED002",
        name: "Metformina",
        dosage: "850mg",
        frequency: "Cada 12 horas",
        status: "active",
        startDate: "2023-10-15",
        notes: [
          { text: "Tomar con alimentos", author: "Dr. Juan Perez", date: "2023-10-15" }
        ],
        history: [
          { action: "Creacion", date: "2023-10-15", user: "Dr. Juan Perez", details: "Inicio de tratamiento" }
        ]
      },
      {
        id: "MED003",
        name: "Orlistat",
        dosage: "120mg",
        frequency: "Con cada comida principal",
        status: "suspended",
        startDate: "2023-08-01",
        suspendedDate: "2023-10-10",
        suspendedReason: "Efectos gastrointestinales severos",
        notes: [
          { text: "Suspendido por intolerancia", author: "Dr. Juan Perez", date: "2023-10-10" }
        ],
        history: [
          { action: "Creacion", date: "2023-08-01", user: "Dr. Juan Perez", details: "Inicio de tratamiento" },
          { action: "Suspension", date: "2023-10-10", user: "Dr. Juan Perez", details: "Efectos gastrointestinales severos" }
        ]
      }
    ],
    clinicalNotes: [
      {
        id: "NOTE001",
        content: "Paciente presenta buena evolucion. Perdida de 5kg en el ultimo mes. Continuar con plan actual.",
        author: "Dr. Juan Perez",
        date: "2024-01-15"
      },
      {
        id: "NOTE002",
        content: "Control de rutina. Sin sintomas nuevos. Adherencia farmacologica optima.",
        author: "Dra. Maria Lopez",
        date: "2024-01-08"
      },
      {
        id: "NOTE003",
        content: "Paciente refiere nauseas leves. Se recomienda tomar medicamento con alimentos.",
        author: "Dr. Juan Perez",
        date: "2023-12-20",
        correctedBy: {
          noteId: "NOTE003-C1",
          content: "Correccion: Las nauseas fueron leves y transitorias, no moderadas como se indico inicialmente.",
          author: "Dr. Juan Perez",
          date: "2023-12-21"
        }
      }
    ],
    changeHistory: [
      {
        id: "CH001",
        date: "2024-01-15 10:30",
        user: "Dr. Juan Perez",
        action: "Actualizacion",
        fieldName: "Peso",
        oldValue: "94 kg",
        newValue: "92 kg"
      },
      {
        id: "CH002",
        date: "2024-01-10 14:15",
        user: "Dra. Maria Lopez",
        action: "Modificacion",
        fieldName: "Telefono",
        oldValue: "+56 9 8765 4321",
        newValue: "+56 9 1234 5678"
      },
      {
        id: "CH003",
        date: "2024-01-08 09:00",
        user: "Dr. Juan Perez",
        action: "Agregado",
        fieldName: "Nota clinica",
        oldValue: "-",
        newValue: "Control de rutina..."
      },
      {
        id: "CH004",
        date: "2023-12-20 11:45",
        user: "Dr. Juan Perez",
        action: "Creacion",
        fieldName: "Ficha clinica",
        oldValue: "-",
        newValue: "Ficha creada"
      }
    ],
    responsibleProfessional: "Dr. Juan Perez",
    specialty: "Endocrinologia",
    signatureStatus: "signed"
  }
}

export function ClinicalRecordCard({ record, patient, onImport, onRefresh }: ClinicalRecordCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [expandedMedications, setExpandedMedications] = useState<string[]>([])
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false)
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [selectedMedicationForSuspend, setSelectedMedicationForSuspend] = useState<Medication | null>(null)
  const [suspendReason, setSuspendReason] = useState("")
  const [birthDateOpen, setBirthDateOpen] = useState(false)
  
  const extendedRecord = getExtendedRecord(record, patient)
  
  // Form state for editing
  const [formData, setFormData] = useState({
    rut: extendedRecord?.rut || "",
    birthDate: extendedRecord?.birthDate || "",
    sex: extendedRecord?.sex || "M",
    healthInsurance: extendedRecord?.healthInsurance || "Fonasa",
    phone: extendedRecord?.phone || "",
    address: extendedRecord?.address || "",
    tobacco: extendedRecord?.habits?.tobacco || false,
    alcohol: extendedRecord?.habits?.alcohol || false,
    physicalActivity: extendedRecord?.habits?.physicalActivity || true,
    familyHistory: extendedRecord?.familyHistory || "",
    diagnosis: extendedRecord?.diagnosis || "",
    cie10Code: extendedRecord?.cie10Code || ""
  })

  const toggleMedicationExpand = (medId: string) => {
    setExpandedMedications(prev => 
      prev.includes(medId) 
        ? prev.filter(id => id !== medId)
        : [...prev, medId]
    )
  }

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      rut: extendedRecord?.rut || "",
      birthDate: extendedRecord?.birthDate || "",
      sex: extendedRecord?.sex || "M",
      healthInsurance: extendedRecord?.healthInsurance || "Fonasa",
      phone: extendedRecord?.phone || "",
      address: extendedRecord?.address || "",
      tobacco: extendedRecord?.habits?.tobacco || false,
      alcohol: extendedRecord?.habits?.alcohol || false,
      physicalActivity: extendedRecord?.habits?.physicalActivity || true,
      familyHistory: extendedRecord?.familyHistory || "",
      diagnosis: extendedRecord?.diagnosis || "",
      cie10Code: extendedRecord?.cie10Code || ""
    })
    setIsEditing(false)
  }

  const handleSuspendMedication = () => {
    // Handle suspend logic here
    setIsSuspendDialogOpen(false)
    setSelectedMedicationForSuspend(null)
    setSuspendReason("")
  }

  if (!extendedRecord) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No hay ficha clinica registrada para este paciente
            </p>
            <Button variant="outline" className="gap-2" onClick={() => onImport?.("")}>
              <Plus className="h-4 w-4" />
              Crear ficha clinica
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Ficha Clinica
              </CardTitle>
              {extendedRecord.externalSystemId && (
                <Badge variant="outline" className="text-xs gap-1 font-mono">
                  <ExternalLink className="h-3 w-3" />
                  {extendedRecord.externalSystemId}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={onRefresh}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4" />
                  Editar ficha
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Main Content - 2 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* S1 - Identificacion */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Identificacion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">RUT</Label>
                  {isEditing ? (
                    <Input 
                      value={formData.rut}
                      onChange={(e) => setFormData({...formData, rut: e.target.value})}
                      className="h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium">{extendedRecord.rut}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Fecha de Nacimiento</Label>
                  {isEditing ? (
                    <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-8 justify-start text-sm font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.birthDate ? format(new Date(formData.birthDate), "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.birthDate ? new Date(formData.birthDate) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              setFormData({...formData, birthDate: format(date, "yyyy-MM-dd")})
                            }
                            setBirthDateOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className="text-sm font-medium">
                      {extendedRecord.birthDate ? format(new Date(extendedRecord.birthDate), "dd/MM/yyyy", { locale: es }) : "-"}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Sexo</Label>
                  {isEditing ? (
                    <Select value={formData.sex} onValueChange={(v) => setFormData({...formData, sex: v as "M" | "F"})}>
                      <SelectTrigger className="h-8 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium">{extendedRecord.sex === "M" ? "Masculino" : "Femenino"}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Prevision</Label>
                  {isEditing ? (
                    <Select value={formData.healthInsurance} onValueChange={(v) => setFormData({...formData, healthInsurance: v as "Fonasa" | "Isapre"})}>
                      <SelectTrigger className="h-8 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fonasa">Fonasa</SelectItem>
                        <SelectItem value="Isapre">Isapre</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium">{extendedRecord.healthInsurance}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Telefono
                </Label>
                {isEditing ? (
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium">{extendedRecord.phone}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Direccion
                </Label>
                {isEditing ? (
                  <Input 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium">{extendedRecord.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* S2 - Antecedentes */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                Antecedentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Alergias */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Alergias</Label>
                <div className="flex flex-wrap gap-1.5">
                  {extendedRecord.allergies.length > 0 ? (
                    extendedRecord.allergies.map((allergy, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Sin alergias conocidas</span>
                  )}
                </div>
              </div>
              
              {/* Tipo de Sangre */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  Tipo de Sangre
                </Label>
                <Badge variant="outline" className="font-mono font-bold">
                  {extendedRecord.bloodType}
                </Badge>
              </div>

              {/* Habitos */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Habitos</Label>
                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <Cigarette className="h-4 w-4" />
                        <span className="text-xs">Tabaco</span>
                        <Switch 
                          checked={formData.tobacco}
                          onCheckedChange={(checked) => setFormData({...formData, tobacco: checked})}
                        />
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <Wine className="h-4 w-4" />
                        <span className="text-xs">Alcohol</span>
                        <Switch 
                          checked={formData.alcohol}
                          onCheckedChange={(checked) => setFormData({...formData, alcohol: checked})}
                        />
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <Dumbbell className="h-4 w-4" />
                        <span className="text-xs">Act. Fisica</span>
                        <Switch 
                          checked={formData.physicalActivity}
                          onCheckedChange={(checked) => setFormData({...formData, physicalActivity: checked})}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Badge variant={extendedRecord.habits?.tobacco ? "destructive" : "secondary"} className="text-xs gap-1">
                        <Cigarette className="h-3 w-3" />
                        {extendedRecord.habits?.tobacco ? "Fumador" : "No fuma"}
                      </Badge>
                      <Badge variant={extendedRecord.habits?.alcohol ? "secondary" : "secondary"} className="text-xs gap-1">
                        <Wine className="h-3 w-3" />
                        {extendedRecord.habits?.alcohol ? "Consume alcohol" : "No consume"}
                      </Badge>
                      <Badge variant={extendedRecord.habits?.physicalActivity ? "default" : "secondary"} className="text-xs gap-1">
                        <Dumbbell className="h-3 w-3" />
                        {extendedRecord.habits?.physicalActivity ? "Activo" : "Sedentario"}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Antecedentes Familiares */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Antecedentes Familiares</Label>
                {isEditing ? (
                  <Textarea 
                    value={formData.familyHistory}
                    onChange={(e) => setFormData({...formData, familyHistory: e.target.value})}
                    className="text-sm min-h-[80px]"
                  />
                ) : (
                  <p className="text-sm text-foreground p-2 rounded-md bg-muted/50">
                    {extendedRecord.familyHistory || "Sin antecedentes familiares registrados"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* S3 - Diagnostico */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                Diagnostico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Diagnostico Principal</Label>
                <div className="flex items-start gap-2 flex-wrap">
                  {isEditing ? (
                    <div className="flex gap-2 w-full flex-wrap">
                      <Input 
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        className="h-8 text-sm flex-1 min-w-[200px]"
                        placeholder="Diagnostico"
                      />
                      <Input 
                        value={formData.cie10Code}
                        onChange={(e) => setFormData({...formData, cie10Code: e.target.value})}
                        className="h-8 text-sm w-24"
                        placeholder="CIE-10"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium">{extendedRecord.diagnosis}</p>
                      <Badge variant="outline" className="text-xs font-mono">
                        CIE-10: {extendedRecord.cie10Code}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Condiciones Asociadas - NO EDITABLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Condiciones Asociadas</Label>
                  <Badge variant="outline" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Solo lectura
                  </Badge>
                </div>
                {extendedRecord.comorbidities.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {extendedRecord.comorbidities.map((c, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {c}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                      <Shield className="h-3 w-3" />
                      Ver analisis de riesgos
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Sin comorbilidades</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* S4 - Tratamiento Actual */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-chart-adherence" />
                  Tratamiento Actual
                </CardTitle>
                <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar medicamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Medicamento</DialogTitle>
                      <DialogDescription>
                        Complete los datos del nuevo medicamento para el paciente.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Medicamento</Label>
                        <Input placeholder="Nombre del medicamento" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Dosis</Label>
                          <Input placeholder="Ej: 500mg" />
                        </div>
                        <div className="space-y-2">
                          <Label>Frecuencia</Label>
                          <Input placeholder="Ej: Cada 8 horas" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notas</Label>
                        <Textarea placeholder="Instrucciones especiales..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddMedicationOpen(false)}>Cancelar</Button>
                      <Button onClick={() => setIsAddMedicationOpen(false)}>Agregar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Dosis</TableHead>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extendedRecord.medications?.map((med) => (
                      <React.Fragment key={med.id}>
                        <TableRow className="group">
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => toggleMedicationExpand(med.id)}
                            >
                              {expandedMedications.includes(med.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>
                            <Badge variant={med.status === "active" ? "default" : "secondary"} className="text-xs">
                              {med.status === "active" ? "Activo" : "Suspendido"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {med.status === "active" && (
                                <>
                                  <Button variant="ghost" size="sm" className="h-7 gap-1">
                                    <Edit3 className="h-3 w-3" />
                                    Editar
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 gap-1 text-warning hover:text-warning"
                                    onClick={() => {
                                      setSelectedMedicationForSuspend(med)
                                      setIsSuspendDialogOpen(true)
                                    }}
                                  >
                                    <Pause className="h-3 w-3" />
                                    Suspender
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedMedications.includes(med.id) && (
                          <TableRow key={`${med.id}-details`} className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={6} className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    Inicio: {format(new Date(med.startDate), "dd/MM/yyyy", { locale: es })}
                                  </span>
                                  {med.suspendedDate && (
                                    <span className="flex items-center gap-1 text-warning">
                                      <Pause className="h-3 w-3" />
                                      Suspendido: {format(new Date(med.suspendedDate), "dd/MM/yyyy", { locale: es })}
                                    </span>
                                  )}
                                </div>
                                {med.suspendedReason && (
                                  <div className="p-2 rounded-md bg-warning/10 border border-warning/20">
                                    <p className="text-xs text-warning">Motivo de suspension: {med.suspendedReason}</p>
                                  </div>
                                )}
                                {med.notes.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">Notas medicas:</p>
                                    {med.notes.map((note, i) => (
                                      <div key={i} className="p-2 rounded-md bg-muted/50 text-xs">
                                        <p>{note.text}</p>
                                        <p className="text-muted-foreground mt-1">{note.author} - {format(new Date(note.date), "dd/MM/yyyy", { locale: es })}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {med.history.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">Historial de cambios:</p>
                                    <div className="space-y-1">
                                      {med.history.map((h, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <History className="h-3 w-3" />
                                          <span>{h.action}</span>
                                          <span>-</span>
                                          <span>{format(new Date(h.date), "dd/MM/yyyy", { locale: es })}</span>
                                          <span>-</span>
                                          <span>{h.user}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* S5 - Evolucion / Notas Clinicas */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Notas Clinicas
                </CardTitle>
                <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Nueva nota
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nueva Nota Clinica</DialogTitle>
                      <DialogDescription>
                        Agregue una nueva nota al historial del paciente.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Contenido</Label>
                        <Textarea placeholder="Escriba la nota clinica..." className="min-h-[120px]" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>Cancelar</Button>
                      <Button onClick={() => setIsAddNoteOpen(false)}>Agregar nota</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {extendedRecord.clinicalNotes?.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">{note.content}</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0">
                        Corregir
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{note.author}</span>
                      <span>-</span>
                      <CalendarIcon className="h-3 w-3" />
                      <span>{format(new Date(note.date), "dd/MM/yyyy", { locale: es })}</span>
                    </div>
                    {note.correctedBy && (
                      <div className="mt-2 p-2 rounded-md bg-warning/10 border border-warning/20">
                        <p className="text-xs text-warning-foreground">{note.correctedBy.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {note.correctedBy.author} - {format(new Date(note.correctedBy.date), "dd/MM/yyyy", { locale: es })}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* S6 - Historial de Cambios */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                Historial de Cambios
                <Badge variant="outline" className="text-xs gap-1 ml-2">
                  <Lock className="h-3 w-3" />
                  Inmutable
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-3 pl-6">
                {/* Timeline line */}
                <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                
                {extendedRecord.changeHistory?.map((entry) => (
                  <div key={entry.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-muted-foreground" />
                    
                    <div className="p-3 rounded-lg border bg-muted/20">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        <span>{entry.date}</span>
                        <span>-</span>
                        <User className="h-3 w-3" />
                        <span>{entry.user}</span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">{entry.action}:</span> {entry.fieldName}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-muted-foreground">Antes:</span>
                        <span className="line-through text-muted-foreground">{entry.oldValue}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-foreground font-medium">{entry.newValue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Profesional:</span>
                  <span className="font-medium">{extendedRecord.responsibleProfessional}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Especialidad:</span>
                  <span className="font-medium">{extendedRecord.specialty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ultima actualizacion:</span>
                  <span className="font-medium">{extendedRecord.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2">
                  {extendedRecord.signatureStatus === "signed" ? (
                    <Badge variant="default" className="text-xs gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Firmado electronicamente
                    </Badge>
                  ) : extendedRecord.signatureStatus === "pending" ? (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Clock className="h-3 w-3" />
                      Pendiente de firma
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs gap-1">
                      <FileText className="h-3 w-3" />
                      Borrador
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
      {/* Fixed Footer for Edit Mode */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-end gap-3 z-50">
          <Button variant="outline" onClick={handleCancel} className="gap-2">
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Guardar cambios
          </Button>
        </div>
      )}

      {/* Suspend Medication Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspender Medicamento</DialogTitle>
            <DialogDescription>
              {selectedMedicationForSuspend && (
                <>Esta a punto de suspender <strong>{selectedMedicationForSuspend.name}</strong>. Esta accion no elimina el medicamento, solo lo marca como suspendido.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Motivo de suspension</Label>
              <Textarea 
                placeholder="Indique el motivo de la suspension..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleSuspendMedication} disabled={!suspendReason.trim()}>
              <Pause className="h-4 w-4 mr-2" />
              Suspender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
   </Card>  
  )
}
