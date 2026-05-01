import { useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<string | null>
  role: "admin" | "doctor"
}

export function LoginForm({ onLogin, role }: LoginFormProps) {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const token = await onLogin(username, password)
      
      if (token) {
        localStorage.setItem(`${role}_token`, token)
        navigate("/dashboard")
      } else {
        setError("Credenciales inválidas. Por favor, intente nuevamente.")
      }
    } catch {
      setError("Error al iniciar sesión. Por favor, intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 border-b border-border px-8 py-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sarah</h1>
                <p className="text-sm text-muted-foreground">Dashboard Médico</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Iniciar Sesión</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Ingrese sus credenciales para acceder
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                className="bg-background"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !username || !password}
              className={cn(
                "w-full font-semibold",
                isLoading && "cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            {/* Role indicator */}
            <p className="text-xs text-center text-muted-foreground">
              Acceso como: <span className="font-medium text-primary capitalize">{role === "doctor" ? "Médico" : "Administrador"}</span>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Sistema de monitoreo de pacientes con obesidad
        </p>
      </div>
    </div>
  )
}
