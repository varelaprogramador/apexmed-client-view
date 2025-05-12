import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CustomResetPasswordForm } from "@/components/auth/custom-reset-password-form"

export const metadata: Metadata = {
  title: "Recuperar Senha | Plataforma Médica",
  description: "Recupere sua senha da plataforma de streaming médica",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <Image
              src="/logo.svg?height=50&width=200"
              alt="Logo"
              width={200}
              height={50}
              className="mx-auto"
              priority
            />
          </Link>
        </div>

        <CustomResetPasswordForm />
      </div>
    </div>
  )
}
