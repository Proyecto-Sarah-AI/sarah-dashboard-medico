
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Pill, 
  Plus,
  Edit2,
  Clock,
  Calendar,
  AlertTriangle,
  Trash2,
  User,
  Save
} from "lucide-react"
import type { MedicationPlan, Medication } from "@/lib/mock-data"

interface MedicationPlanCardProps {
  plan: MedicationPlan | null
  patientId: string
  onUpdateMedication?: (medicationId: string, updates: Partial<Medication>) => void
  onAddMedication?: (medication: Omit<Medication, "id">) => void
  onDeleteMedication?: (medicationId: string) => void
  onUpdateNotes?: (notes: string) => void
}

const dosageOptions = ["0.25mg", "0.5mg", "1.0mg", "1.7mg", "2.4mg"]
const frequencyOptions = ["Diario", "Semanal", "Quincenal", "Mensual"]

export function MedicationPlanCard({ 
  plan, 
  patientId, 
  onUpdateMedication, 
  onAddMedication,
  onDeleteMedication,
  onUpdateNotes 
}: MedicationPlanCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [editedDosage, setEditedDosage] = useState("")
  const [editedFrequency, setEditedFrequency] = useState("")
  const [editedInstructions, setEditedInstructions] = useState("")
  
  // New medication form state
  const [newMedName, setNewMedName] = useState("")
  const [newMedDosage, setNewMedDosage] = useState("")
  const [newMedFrequency, setNewMedFrequency] = useState("")
  const [newMedSchedule, setNewMedSchedule] = useState("")
  const [newMedInstructions, setNewMedInstructions] = useState("")

  const handleEditClick = (medication: Medication) => {
    setEditingMedication(medication)
    setEditedDosage(medication.dosage)
    setEditedFrequency(medication.frequency)
    setEditedInstructions(medication.instructions)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingMedication) {
      onUpdateMedication?.(editingMedication.id, {
        dosage: editedDosage,
        frequency: editedFrequency,
        instructions: editedInstructions
      })
    }
    setIsEditDialogOpen(false)
    setEditingMedication(null)
  }

  const handleDeleteMedication = (medicationId: string) => {
    onDeleteMedication?.(medicationId)
  }

  const handleAddMedication = () => {
    const scheduleArray = newMedSchedule.split(",").map(s => s.trim()).filter(Boolean)
    onAddMedication?.({
      name: newMedName,
      dosage: newMedDosage,
      frequency: newMedFrequency,
      schedule: scheduleArray,
      startDate: new Date().toISOString().split("T")[0],
      instructions: newMedInstructions,
      isActive: true
    })
    setIsAddDialogOpen(false)
    resetNewMedForm()
  }

  const resetNewMedForm = () => {
    setNewMedName("")
    setNewMedDosage("")
    setNewMedFrequency("")
    setNewMedSchedule("")
    setNewMedInstructions("")
  }

  if (!plan) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Pill className="h-4 w-4 text-muted-foreground" />
              Plan de Medicación
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Pill className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No hay plan de medicación configurado
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Crear plan de medicación
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Agregar Medicamento</DialogTitle>
                  <DialogDescription>
                    Configure el primer medicamento del plan de tratamiento.
                  </DialogDescription>
                </DialogHeader>
                <MedicationForm
                  name={newMedName}
                  setName={setNewMedName}
                  dosage={newMedDosage}
                  setDosage={setNewMedDosage}
                  frequency={newMedFrequency}
                  setFrequency={setNewMedFrequency}
                  schedule={newMedSchedule}
                  setSchedule={setNewMedSchedule}
                  instructions={newMedInstructions}
                  setInstructions={setNewMedInstructions}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddMedication} disabled={!newMedName || !newMedDosage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeMedications = plan.medications.filter(m => m.isActive)
  const inactiveMedications = plan.medications.filter(m => !m.isActive)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Pill className="h-4 w-4 text-muted-foreground" />
            Plan de Medicación
            <Badge variant="secondary" className="ml-2">
              {activeMedications.length} activo{activeMedications.length !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <Plus className="h-3.5 w-3.5" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Agregar Medicamento</DialogTitle>
                <DialogDescription>
                  Agregue un nuevo medicamento al plan de tratamiento del paciente.
                </DialogDescription>
              </DialogHeader>
              <MedicationForm
                name={newMedName}
                setName={setNewMedName}
                dosage={newMedDosage}
                setDosage={setNewMedDosage}
                frequency={newMedFrequency}
                setFrequency={setNewMedFrequency}
                schedule={newMedSchedule}
                setSchedule={setNewMedSchedule}
                instructions={newMedInstructions}
                setInstructions={setNewMedInstructions}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddMedication} disabled={!newMedName || !newMedDosage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Active Medications */}
        {activeMedications.map((medication) => (
          <MedicationItem 
            key={medication.id}
            medication={medication}
            onEdit={() => handleEditClick(medication)}
            onDelete={() => handleDeleteMedication(medication.id)}
          />
        ))}

        {/* Inactive Medications */}
        {inactiveMedications.length > 0 && (
          <>
            <Separator className="bg-border my-3" />
            <p className="text-xs text-muted-foreground mb-2">Medicamentos suspendidos</p>
            {inactiveMedications.map((medication) => (
              <MedicationItem 
                key={medication.id}
                medication={medication}
                onEdit={() => handleEditClick(medication)}
                onDelete={() => handleDeleteMedication(medication.id)}
              />
            ))}
          </>
        )}

        {/* Plan Notes */}
        {plan.notes && (
          <>
            <Separator className="bg-border my-3" />
            <div className="p-3 rounded-md bg-warning/10 border border-warning/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-warning mb-1">Notas del médico</p>
                  <p className="text-sm text-foreground">{plan.notes}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {plan.updatedBy}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Actualizado: {plan.updatedAt}
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajustar Medicación</DialogTitle>
              <DialogDescription>
                Modifique la dosis, frecuencia o instrucciones de {editingMedication?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Dosis</Label>
                <Select value={editedDosage} onValueChange={setEditedDosage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar dosis" />
                  </SelectTrigger>
                  <SelectContent>
                    {dosageOptions.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frecuencia</Label>
                <Select value={editedFrequency} onValueChange={setEditedFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Instrucciones</Label>
                <Textarea 
                  value={editedInstructions}
                  onChange={(e) => setEditedInstructions(e.target.value)}
                  placeholder="Instrucciones para el paciente..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// Medication Item Component
function MedicationItem({ 
  medication, 
  onEdit, 
  onDelete 
}: { 
  medication: Medication
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className={`p-3 rounded-lg border ${medication.isActive ? "bg-muted/30 border-border" : "bg-muted/10 border-border/50 opacity-60"}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Pill className={`h-4 w-4 ${medication.isActive ? "text-primary" : "text-muted-foreground"}`} />
          <span className="font-medium text-foreground">{medication.name}</span>
          <Badge variant={medication.isActive ? "default" : "secondary"} className="text-xs">
            {medication.dosage}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {medication.frequency} - {medication.schedule.join(", ")}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Inicio: {medication.startDate}
        </div>
        {medication.instructions && (
          <p className="text-foreground/80 mt-1 pl-4 border-l-2 border-primary/30">
            {medication.instructions}
          </p>
        )}
      </div>
    </div>
  )
}

// Medication Form Component
function MedicationForm({
  name, setName,
  dosage, setDosage,
  frequency, setFrequency,
  schedule, setSchedule,
  instructions, setInstructions
}: {
  name: string, setName: (v: string) => void
  dosage: string, setDosage: (v: string) => void
  frequency: string, setFrequency: (v: string) => void
  schedule: string, setSchedule: (v: string) => void
  instructions: string, setInstructions: (v: string) => void
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Nombre del medicamento</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Semaglutida"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Dosis</Label>
          <Select value={dosage} onValueChange={setDosage}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {dosageOptions.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Frecuencia</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {frequencyOptions.map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Horarios (separados por coma)</Label>
        <Input
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="Ej: 08:00, 20:00"
        />
      </div>
      <div className="space-y-2">
        <Label>Instrucciones</Label>
        <Textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instrucciones especiales para el paciente..."
          rows={2}
        />
      </div>
    </div>
  )
}
