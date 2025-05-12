import type { Metadata } from "next"
import { RegisterContent } from "@/components/auth/register-content"

export const metadata: Metadata = {
  title: "Cadastro | Plataforma Médica",
  description: "Crie sua conta na plataforma de streaming médica",
}

export default function RegisterPage() {
  return <RegisterContent />
}
