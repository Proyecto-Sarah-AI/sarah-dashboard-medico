"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  FileText, 
  Download, 
  Upload, 
  RefreshCw,
  Droplets,
  AlertCircle,
  Stethoscope,
  Calendar,
  User,
  ExternalLink,
  Pencil,
  X,
  Check,
  Plus,
  Trash2,
  Activity
} from "lucide-react"
import type { ClinicalRecord, ClinicalNote, Patient } from "@/lib/mock-data"

interface ClinicalRecordCardProps {
  record: ClinicalRecord | null
  patient: Patient
  onImport?: (externalId: string) => void
  onRefresh?: () => void
  onSave?: (record: ClinicalRecord) => void
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const

// Conditions catalog with priorities and categories
type Priority = "Alta" | "Media"

interface ConditionInfo {
  name: string
  priority: Priority
  category: string
  mechanism: string
}

const CONDITIONS_CATALOG: ConditionInfo[] = [
  // Cardiovascular (Alta)
  { name: "Hipertensión arterial", priority: "Alta", category: "Cardiovascular", mechanism: "La obesidad aumenta la resistencia vascular y activa el sistema renina-angiotensina, elevando la presión arterial." },
  { name: "Enfermedad coronaria", priority: "Alta", category: "Cardiovascular", mechanism: "La obesidad aumenta la resistencia vascular y activa el sistema renina-angiotensina, elevando la presión arterial." },
  { name: "Insuficiencia cardíaca", priority: "Alta", category: "Cardiovascular", mechanism: "La obesidad aumenta la resistencia vascular y activa el sistema renina-angiotensina, elevando la presión arterial." },
  { name: "ACV", priority: "Alta", category: "Cardiovascular", mechanism: "La obesidad aumenta la resistencia vascular y activa el sistema renina-angiotensina, elevando la presión arterial." },
  { name: "Fibrilación auricular", priority: "Alta", category: "Cardiovascular", mechanism: "La obesidad aumenta la resistencia vascular y activa el sistema renina-angiotensina, elevando la presión arterial." },
  
  // Metabólico (Alta)
  { name: "Diabetes mellitus tipo 2", priority: "Alta", category: "Metabólico", mechanism: "El exceso de tejido adiposo genera resistencia a la insulina y disfunción de células beta pancreáticas." },
  { name: "Síndrome metabólico", priority: "Alta", category: "Metabólico", mechanism: "El exceso de tejido adiposo genera resistencia a la insulina y disfunción de células beta pancreáticas." },
  { name: "Dislipidemia", priority: "Alta", category: "Metabólico", mechanism: "El exceso de tejido adiposo genera resistencia a la insulina y disfunción de células beta pancreáticas." },
  { name: "Hígado graso NASH", priority: "Alta", category: "Metabólico", mechanism: "El exceso de tejido adiposo genera resistencia a la insulina y disfunción de células beta pancreáticas." },
  { name: "Gota", priority: "Alta", category: "Metabólico", mechanism: "El exceso de tejido adiposo genera resistencia a la insulina y disfunción de células beta pancreáticas." },
  { name: "Prediabetes", priority: "Alta", category: "Metabólico", mechanism: "El exceso de tejido adiposo genera resistencia a la insulina y disfunción de células beta pancreáticas." },
  
  // Respiratorio (Alta)
  { name: "Apnea obstructiva del sueño", priority: "Alta", category: "Respiratorio", mechanism: "El depósito de grasa en vías aéreas superiores y tórax compromete la ventilación y oxigenación." },
  { name: "Hipoventilación por obesidad", priority: "Alta", category: "Respiratorio", mechanism: "El depósito de grasa en vías aéreas superiores y tórax compromete la ventilación y oxigenación." },
  { name: "Asma", priority: "Alta", category: "Respiratorio", mechanism: "El depósito de grasa en vías aéreas superiores y tórax compromete la ventilación y oxigenación." },
  
  // Psicosocial (Alta)
  { name: "Depresión", priority: "Alta", category: "Psicosocial", mechanism: "La obesidad se asocia a inflamación crónica, alteraciones neuroendocrinas y estigma social que afectan la salud mental." },
  { name: "Ansiedad", priority: "Alta", category: "Psicosocial", mechanism: "La obesidad se asocia a inflamación crónica, alteraciones neuroendocrinas y estigma social que afectan la salud mental." },
  { name: "Trastorno por atracón", priority: "Alta", category: "Psicosocial", mechanism: "La obesidad se asocia a inflamación crónica, alteraciones neuroendocrinas y estigma social que afectan la salud mental." },
  { name: "Baja autoestima", priority: "Alta", category: "Psicosocial", mechanism: "La obesidad se asocia a inflamación crónica, alteraciones neuroendocrinas y estigma social que afectan la salud mental." },
  { name: "Estigmatización", priority: "Alta", category: "Psicosocial", mechanism: "La obesidad se asocia a inflamación crónica, alteraciones neuroendocrinas y estigma social que afectan la salud mental." },
  
  // Mecánico/Osteoarticular (Media)
  { name: "Artrosis de rodillas", priority: "Media", category: "Mecánico/Osteoarticular", mechanism: "La sobrecarga mecánica y la inflamación sistémica dañan el cartílago y estructuras articulares." },
  { name: "Artrosis de cadera", priority: "Media", category: "Mecánico/Osteoarticular", mechanism: "La sobrecarga mecánica y la inflamación sistémica dañan el cartílago y estructuras articulares." },
  { name: "Lumbalgia crónica", priority: "Media", category: "Mecánico/Osteoarticular", mechanism: "La sobrecarga mecánica y la inflamación sistémica dañan el cartílago y estructuras articulares." },
  { name: "Túnel carpiano", priority: "Media", category: "Mecánico/Osteoarticular", mechanism: "La sobrecarga mecánica y la inflamación sistémica dañan el cartílago y estructuras articulares." },
  { name: "Hernias", priority: "Media", category: "Mecánico/Osteoarticular", mechanism: "La sobrecarga mecánica y la inflamación sistémica dañan el cartílago y estructuras articulares." },
  
  // Oncológico (Media)
  { name: "Cáncer de endometrio", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de mama", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de colon", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de recto", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de riñón", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de hígado", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de páncreas", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de esófago", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de ovario", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de tiroides", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  { name: "Cáncer de vesícula biliar", priority: "Media", category: "Oncológico", mechanism: "La obesidad promueve un ambiente proinflamatorio y hormonal que favorece la carcinogénesis." },
  
  // Renal (Media)
  { name: "Enfermedad renal crónica", priority: "Media", category: "Renal", mechanism: "La obesidad induce hiperfiltración glomerular y daño renal progresivo." },
  { name: "Glomerulopatía asociada a obesidad", priority: "Media", category: "Renal", mechanism: "La obesidad induce hiperfiltración glomerular y daño renal progresivo." },
  
  // Reproductivo (Media)
  { name: "Infertilidad", priority: "Media", category: "Reproductivo", mechanism: "El exceso de tejido adiposo altera el eje hormonal reproductivo y la función ovárica/testicular." },
  { name: "SOP", priority: "Media", category: "Reproductivo", mechanism: "El exceso de tejido adiposo altera el eje hormonal reproductivo y la función ovárica/testicular." },
  { name: "Diabetes gestacional", priority: "Media", category: "Reproductivo", mechanism: "El exceso de tejido adiposo altera el eje hormonal reproductivo y la función ovárica/testicular." },
  { name: "Preeclampsia", priority: "Media", category: "Reproductivo", mechanism: "El exceso de tejido adiposo altera el eje hormonal reproductivo y la función ovárica/testicular." },
]

// Get condition info by name
function getConditionInfo(name: string): ConditionInfo | undefined {
  return CONDITIONS_CATALOG.find(c => c.name === name)
}

// Get unique categories from conditions
function getCategoriesFromConditions(conditions: string[]): Map<string, { priority: Priority; mechanism: string; conditions: string[] }> {
  const categories = new Map<string, { priority: Priority; mechanism: string; conditions: string[] }>()
  
  conditions.forEach(condName => {
    const info = getConditionInfo(condName)
    if (info) {
      if (!categories.has(info.category)) {
        categories.set(info.category, {
          priority: info.priority,
          mechanism: info.mechanism,
          conditions: []
        })
      }
      categories.get(info.category)!.conditions.push(condName)
    }
  })
  
  return categories
}

// Group conditions by category for the selector
function getGroupedConditions(): Map<string, ConditionInfo[]> {
  const grouped = new Map<string, ConditionInfo[]>()
  
  CONDITIONS_CATALOG.forEach(cond => {
    if (!grouped.has(cond.category)) {
      grouped.set(cond.category, [])
    }
    grouped.get(cond.category)!.push(cond)
  })
  
  return grouped
}

export function ClinicalRecordCard({ record, patient, onImport, onRefresh, onSave }: ClinicalRecordCardProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [externalId, setExternalId] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isRiskAnalysisOpen, setIsRiskAnalysisOpen] = useState(false)
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editedRecord, setEditedRecord] = useState<ClinicalRecord | null>(null)
  
  // New allergy input state
  const [newAllergy, setNewAllergy] = useState("")
  
  // New note state
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNoteContent, setEditingNoteContent] = useState("")

  const handleImport = async () => {
    if (!externalId.trim()) return
    setIsImporting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    onImport?.(externalId)
    setIsImporting(false)
    setIsImportDialogOpen(false)
    setExternalId("")
  }

  const handleStartEdit = () => {
    if (record) {
      setEditedRecord({ ...record, notes: [...record.notes], comorbidities: [...record.comorbidities], allergies: [...record.allergies] })
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedRecord(null)
    setNewAllergy("")
    setIsAddingNote(false)
    setNewNoteContent("")
    setEditingNoteId(null)
    setEditingNoteContent("")
  }

  const handleSaveEdit = () => {
    if (editedRecord) {
      onSave?.(editedRecord)
      setIsEditing(false)
      setEditedRecord(null)
    }
  }

  const handleAddCondition = (conditionName: string) => {
    if (conditionName && editedRecord && !editedRecord.comorbidities.includes(conditionName)) {
      setEditedRecord({
        ...editedRecord,
        comorbidities: [...editedRecord.comorbidities, conditionName]
      })
    }
  }

  const handleRemoveCondition = (index: number) => {
    if (editedRecord) {
      setEditedRecord({
        ...editedRecord,
        comorbidities: editedRecord.comorbidities.filter((_, i) => i !== index)
      })
    }
  }

  const handleAddAllergy = () => {
    if (newAllergy.trim() && editedRecord) {
      setEditedRecord({
        ...editedRecord,
        allergies: [...editedRecord.allergies, newAllergy.trim()]
      })
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (index: number) => {
    if (editedRecord) {
      setEditedRecord({
        ...editedRecord,
        allergies: editedRecord.allergies.filter((_, i) => i !== index)
      })
    }
  }

  const handleAddNote = () => {
    if (newNoteContent.trim() && editedRecord) {
      const newNote: ClinicalNote = {
        id: `N${Date.now()}`,
        author: record?.physician || "Dr. Juan Pérez",
        date: new Date().toISOString().split('T')[0],
        content: newNoteContent.trim()
      }
      setEditedRecord({
        ...editedRecord,
        notes: [newNote, ...editedRecord.notes]
      })
      setNewNoteContent("")
      setIsAddingNote(false)
    }
  }

  const handleEditNote = (noteId: string) => {
    const note = editedRecord?.notes.find(n => n.id === noteId)
    if (note) {
      setEditingNoteId(noteId)
      setEditingNoteContent(note.content)
    }
  }

  const handleSaveNoteEdit = () => {
    if (editingNoteId && editedRecord) {
      setEditedRecord({
        ...editedRecord,
        notes: editedRecord.notes.map(note => 
          note.id === editingNoteId 
            ? { ...note, content: editingNoteContent } 
            : note
        )
      })
      setEditingNoteId(null)
      setEditingNoteContent("")
    }
  }

  const handleDeleteNote = (noteId: string) => {
    if (editedRecord) {
      setEditedRecord({
        ...editedRecord,
        notes: editedRecord.notes.filter(note => note.id !== noteId)
      })
    }
  }

  // Use edited record when editing, otherwise use original
  const displayRecord = isEditing ? editedRecord : record
  
  // Get grouped conditions for selector
  const groupedConditions = getGroupedConditions()
  
  // Get risk analysis categories for modal
  const riskCategories = displayRecord ? getCategoriesFromConditions(displayRecord.comorbidities) : new Map()

  if (!record) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Ficha Clínica
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No hay ficha clínica registrada para este paciente
            </p>
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importar desde sistema externo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Importar Ficha Clínica</DialogTitle>
                  <DialogDescription>
                    Ingrese el ID del expediente en el sistema externo para importar los datos clínicos del paciente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="externalId">ID de Sistema Externo</Label>
                    <Input
                      id="externalId"
                      placeholder="Ej: EXT-2024-12345"
                      value={externalId}
                      onChange={(e) => setExternalId(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Se conectará al sistema HIS/EMR configurado para obtener los datos del paciente.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleImport} disabled={!externalId.trim() || isImporting}>
                    {isImporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Importando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Importar
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Ficha Clínica
          </CardTitle>
          <div className="flex items-center gap-2">
            {displayRecord?.externalSystemId && !isEditing && (
              <Badge variant="outline" className="text-xs gap-1">
                <ExternalLink className="h-3 w-3" />
                {displayRecord.externalSystemId}
              </Badge>
            )}
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 gap-1"
                  onClick={handleCancelEdit}
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 px-2 gap-1"
                  onClick={handleSaveEdit}
                >
                  <Check className="h-3.5 w-3.5" />
                  Guardar
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 gap-1"
                  onClick={handleStartEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar ficha
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={onRefresh}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Diagnosis */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Diagnóstico Principal</span>
          </div>
          {isEditing && editedRecord ? (
            <Input
              value={editedRecord.diagnosis}
              onChange={(e) => setEditedRecord({ ...editedRecord, diagnosis: e.target.value })}
              className="text-sm"
            />
          ) : (
            <p className="text-sm font-medium text-foreground">{displayRecord?.diagnosis}</p>
          )}
        </div>

        <Separator className="bg-border" />

        {/* Conditions (formerly Comorbidities) - Grouped by Category */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-muted-foreground">Condiciones asociadas</span>
          </div>
          
          {/* Grouped conditions display */}
          {(displayRecord?.comorbidities || []).length > 0 ? (
            <div className="space-y-3">
              {Array.from(riskCategories.entries()).map(([category, data]) => (
                <div key={category} className="rounded-md border border-border/60 bg-muted/20 p-3">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className={`w-2 h-2 rounded-full ${data.priority === 'Alta' ? 'bg-red-500' : 'bg-amber-400'}`}
                      />
                      <span className="text-xs font-medium text-foreground">{category}</span>
                      <Badge 
                        variant={data.priority === 'Alta' ? 'destructive' : 'secondary'}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {data.priority}
                      </Badge>
                    </div>
                    {/* Add button for this category in edit mode */}
                    {isEditing && (
                      <Select onValueChange={handleAddCondition}>
                        <SelectTrigger className="w-7 h-7 p-0 border-none bg-transparent hover:bg-accent">
                          <Plus className="h-3.5 w-3.5 mx-auto" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupedConditions.get(category)
                            ?.filter(c => !editedRecord?.comorbidities.includes(c.name))
                            .map(cond => (
                              <SelectItem key={cond.name} value={cond.name}>
                                {cond.name}
                              </SelectItem>
                            ))
                          }
                          {groupedConditions.get(category)
                            ?.filter(c => !editedRecord?.comorbidities.includes(c.name)).length === 0 && (
                            <div className="px-2 py-1.5 text-xs text-muted-foreground">
                              Todas las condiciones agregadas
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {/* Conditions tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {data.conditions.map((condName) => {
                      const condIndex = displayRecord?.comorbidities.indexOf(condName) ?? -1
                      return (
                        <Badge 
                          key={condName} 
                          variant="secondary" 
                          className="text-xs gap-1"
                        >
                          {condName}
                          {isEditing && condIndex >= 0 && (
                            <button 
                              onClick={() => handleRemoveCondition(condIndex)}
                              className="ml-0.5 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Sin condiciones asociadas</span>
          )}

          {/* Add new category in edit mode */}
          {isEditing && (
            <div className="mt-3">
              <Select onValueChange={handleAddCondition}>
                <SelectTrigger className="text-sm h-8">
                  <SelectValue placeholder="Agregar condición de otra categoría..." />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {Array.from(groupedConditions.entries())
                    .filter(([category]) => !riskCategories.has(category))
                    .map(([category, conditions]) => (
                      <SelectGroup key={category}>
                        <SelectLabel className="flex items-center gap-2">
                          <span 
                            className={`w-2 h-2 rounded-full ${conditions[0].priority === 'Alta' ? 'bg-red-500' : 'bg-amber-400'}`}
                          />
                          {category}
                        </SelectLabel>
                        {conditions
                          .filter(c => !editedRecord?.comorbidities.includes(c.name))
                          .map(cond => (
                            <SelectItem key={cond.name} value={cond.name}>
                              {cond.name}
                            </SelectItem>
                          ))
                        }
                      </SelectGroup>
                    ))}
                  {Array.from(groupedConditions.entries())
                    .filter(([category]) => !riskCategories.has(category)).length === 0 && (
                    <div className="px-2 py-2 text-xs text-muted-foreground text-center">
                      Todas las categorías ya tienen condiciones
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Risk Analysis Link */}
          {(displayRecord?.comorbidities || []).length > 0 && !isEditing && (
            <Dialog open={isRiskAnalysisOpen} onOpenChange={setIsRiskAnalysisOpen}>
              <DialogTrigger asChild>
                <button className="mt-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  <Activity className="h-3 w-3" />
                  Ver análisis de riesgos
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Análisis de Riesgos
                  </DialogTitle>
                  <DialogDescription>
                    Este análisis refleja únicamente las condiciones registradas para este paciente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {Array.from(riskCategories.entries()).map(([category, data]) => (
                    <div key={category} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className={`w-2.5 h-2.5 rounded-full ${data.priority === 'Alta' ? 'bg-red-500' : 'bg-amber-400'}`}
                        />
                        <h4 className="font-medium text-sm">{category}</h4>
                        <Badge 
                          variant={data.priority === 'Alta' ? 'destructive' : 'secondary'}
                          className="text-xs ml-auto"
                        >
                          {data.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {data.mechanism}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {data.conditions.map((cond, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {cond}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {riskCategories.size === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay condiciones asociadas registradas.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Allergies */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-xs font-medium text-muted-foreground">Alergias</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(displayRecord?.allergies || []).map((a, i) => (
              <Badge key={i} variant="destructive" className="text-xs gap-1">
                {a}
                {isEditing && (
                  <button 
                    onClick={() => handleRemoveAllergy(i)}
                    className="ml-1 hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {(displayRecord?.allergies || []).length === 0 && !isEditing && (
              <span className="text-sm text-muted-foreground">Sin alergias conocidas</span>
            )}
          </div>
          {isEditing && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Nueva alergia..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
                className="text-sm h-8"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2"
                onClick={handleAddAllergy}
                disabled={!newAllergy.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Blood Type */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">Tipo de Sangre</span>
            </div>
            {isEditing && editedRecord ? (
              <Select
                value={editedRecord.bloodType}
                onValueChange={(value) => setEditedRecord({ ...editedRecord, bloodType: value })}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="font-mono font-bold">
                {displayRecord?.bloodType}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Clinical Notes - Redesigned */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">Notas Clínicas</span>
            {isEditing && !isAddingNote && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2 gap-1"
                onClick={() => setIsAddingNote(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Nueva nota
              </Button>
            )}
          </div>

          {/* New note form */}
          {isEditing && isAddingNote && (
            <div className="mb-3 p-3 rounded-md border border-border bg-muted/30">
              <Textarea
                placeholder="Escribir nueva nota clínica..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="text-sm min-h-20 mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAddingNote(false)
                    setNewNoteContent("")
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddNote}
                  disabled={!newNoteContent.trim()}
                >
                  Agregar
                </Button>
              </div>
            </div>
          )}

          {/* Notes list */}
          <div className="space-y-3">
            {(displayRecord?.notes || []).map((note) => (
              <div 
                key={note.id} 
                className="p-3 rounded-md bg-muted/50 border border-border/50"
              >
                {editingNoteId === note.id ? (
                  <>
                    <Textarea
                      value={editingNoteContent}
                      onChange={(e) => setEditingNoteContent(e.target.value)}
                      className="text-sm min-h-20 mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditingNoteId(null)
                          setEditingNoteContent("")
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveNoteEdit}
                      >
                        Guardar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {note.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {note.date}
                        </span>
                      </div>
                      {isEditing && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleEditNote(note.id)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                  </>
                )}
              </div>
            ))}
            {(displayRecord?.notes || []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay notas clínicas registradas
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
