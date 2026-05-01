import { cn } from "@/lib/utils"
import { 
  AlertTriangle, 
  Users, 
  Heart,
  Sun,
  Moon,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SidebarNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
  treatmentType: string
  onTreatmentChange: (treatment: string) => void
}

const treatmentOptions = [
  { value: "obesity", label: "Obesidad" },
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hipertensión" },
  { value: "all", label: "Todos" },
]

const navItems = [
  { id: "patients", label: "Pacientes", icon: Users },
  { id: "overview", label: "Alertas", icon: AlertTriangle },
]

export function SidebarNav({ activeSection, onSectionChange, treatmentType, onTreatmentChange }: SidebarNavProps) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Avoid hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    // Clear all auth tokens
    localStorage.removeItem("doctor_token")
    localStorage.removeItem("admin_token")
    // Redirect to login
    router.push("/login")
  }

  const currentTreatmentLabel = treatmentOptions.find(t => t.value === treatmentType)?.label || "Obesidad"

  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col h-screen md:fixed md:left-0 md:top-0">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Sarah</h1>
            <p className="text-xs text-muted-foreground">Dashboards</p>
          </div>
        </div>
      </div>

      {/* Treatment Type Selector */}
      <div className="p-3 border-b border-sidebar-border">
        <p className="text-xs text-muted-foreground mb-2 px-1">Tipo de tratamiento</p>
        <Select value={treatmentType} onValueChange={onTreatmentChange}>
          <SelectTrigger className="w-full bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
            <SelectValue placeholder="Seleccionar tratamiento">
              {currentTreatmentLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {treatmentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-primary"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-sidebar-primary")} />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={toggleTheme}
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          ) : (
            <Sun className="h-4 w-4" />
          )}
          {mounted ? (theme === "dark" ? "Modo claro" : "Modo oscuro") : "Cambiar tema"}
        </Button>
        <div className="px-3 py-2 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">Dr. Juan Pérez</p>
          <p className="text-xs text-primary">Endocrinología</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
