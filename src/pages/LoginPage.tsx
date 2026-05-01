import { LoginForm } from "@/components/auth/login-form"

// Mock login function - replace with actual API call
async function handleLogin(username: string, password: string): Promise<string | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock credentials for demo
  if (username === "doctor" && password === "doctor123") {
    return "mock-doctor-token-" + Date.now()
  }
  if (username === "admin" && password === "admin123") {
    return "mock-admin-token-" + Date.now()
  }
  
  return null
}

export default function LoginPage() {
  return (
    <LoginForm 
      onLogin={handleLogin}
      role="doctor"
    />
  )
}
