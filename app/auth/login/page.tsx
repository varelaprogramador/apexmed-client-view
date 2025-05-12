import { LoginContent } from "@/components/auth/login-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Plataforma Médica",
  description: "Faça login na plataforma de streaming médica",
}

// Página principal - componente servidor
export default function LoginPage() {
  return <LoginContent />
}
