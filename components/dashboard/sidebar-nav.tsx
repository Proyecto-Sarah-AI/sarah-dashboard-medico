"use client"

import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  AlertTriangle,
  Calendar,
  MessageSquare,
  Heart,
  Sun,
  Moon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

interface SidebarNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navItems = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard },
  { id: "patients", label: "Pacientes", icon: Users },
  { id: "alerts", label: "Alertas", icon: AlertTriangle },
  { id: "metrics", label: "Métricas", icon: Activity },
  { id: "appointments", label: "Citas", icon: Calendar },
  { id: "interactions", label: "Interacciones", icon: MessageSquare },
]

export function SidebarNav({ activeSection, onSectionChange }: SidebarNavProps) {
  const { theme, toggleTheme } = useTheme()

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
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </Button>
        <div className="mt-3 px-3 py-2 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">Dr. Juan Pérez</p>
          <p className="text-xs text-primary">Endocrinología</p>
        </div>
      </div>
    </aside>
  )
}
