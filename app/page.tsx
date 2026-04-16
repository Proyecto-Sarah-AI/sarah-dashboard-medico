"use client"

import { useState, useMemo } from "react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { OverviewSection } from "@/components/dashboard/overview-section"
import { PatientsTable } from "@/components/dashboard/patients-table"
import { PatientDetail } from "@/components/dashboard/patient-detail"

import { patients, aggregateMetrics } from "@/lib/mock-data"
import type { Patient } from "@/lib/mock-data"
import { 
  Menu,
  Heart,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"


// Patients Section with Search
function PatientsSection({ onSelectPatient }: { onSelectPatient: (patient: Patient) => void }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients
    const query = searchQuery.toLowerCase().trim()
    return patients.filter(p => p.name.toLowerCase().includes(query))
  }, [searchQuery])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            Gestión y seguimiento de todos los pacientes
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre..."
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
            No se encontraron pacientes con el nombre &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const metrics = aggregateMetrics()

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
        return <OverviewSection />
      
      case "patients":
        return <PatientsSection onSelectPatient={setSelectedPatient} />
      
      
      default:
        return <OverviewSection />
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
