"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { OverviewSection } from "@/components/dashboard/overview-section"
import { PatientsTable } from "@/components/dashboard/patients-table"
import { PatientDetail } from "@/components/dashboard/patient-detail"

import { patients } from "@/lib/mock-data"
import type { Patient } from "@/lib/mock-data"
import { 
  Menu,
  Heart,
  Search,
  Activity,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Patients Section with Search
function PatientsSection({ 
  onSelectPatient, 
  patients: patientsList,
  treatmentType,
  treatmentLabel
}: { 
  onSelectPatient: (patient: Patient) => void
  patients: Patient[]
  treatmentType: string
  treatmentLabel: string
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patientsList
    const query = searchQuery.toLowerCase().trim()
    return patientsList.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.rut.toLowerCase().includes(query)
    )
  }, [searchQuery, patientsList])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">
              Gestion y seguimiento de pacientes
            </p>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <Activity className="h-3 w-3" />
              {treatmentLabel}
            </span>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre o RUT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      {filteredPatients.length > 0 ? (
        <PatientsTable 
          patients={filteredPatients} 
          onSelectPatient={onSelectPatient}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Search className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Sin resultados</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No se encontraron pacientes con el nombre o RUT &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  )
}

const treatmentLabels: Record<string, string> = {
  obesity: "Obesidad",
  diabetes: "Diabetes",
  hypertension: "Hipertension",
  all: "Todos los tratamientos"
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [activeSection, setActiveSection] = useState("patients")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [treatmentType, setTreatmentType] = useState(() => {
    return searchParams.get("treatment") || "obesity"
  })

  // Sync treatment type with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("treatment", treatmentType)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [treatmentType, router, searchParams])

  // Handle treatment change with navigation logic
  const handleTreatmentChange = (newTreatment: string) => {
    setTreatmentType(newTreatment)
    // If on Alerts view, redirect to Patients
    if (activeSection === "overview") {
      setActiveSection("patients")
      setSelectedPatient(null)
    }
  }

  // Filter patients by treatment type
  const filteredPatients = useMemo(() => {
    if (treatmentType === "all") return patients
    return patients.filter(p => p.treatmentType === treatmentType)
  }, [treatmentType])

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
        return <OverviewSection patients={filteredPatients} treatmentLabel={treatmentLabels[treatmentType]} />
      
      case "patients":
        return (
          <PatientsSection 
            onSelectPatient={setSelectedPatient} 
            patients={filteredPatients}
            treatmentType={treatmentType}
            treatmentLabel={treatmentLabels[treatmentType]}
          />
        )
      
      
      default:
        return <OverviewSection patients={filteredPatients} treatmentLabel={treatmentLabels[treatmentType]} />
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
          treatmentType={treatmentType}
          onTreatmentChange={handleTreatmentChange}
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
                treatmentType={treatmentType}
                onTreatmentChange={(treatment) => {
                  handleTreatmentChange(treatment)
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

// Loading fallback component
function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando dashboard...</p>
      </div>
    </div>
  )
}

// Main exported component with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
