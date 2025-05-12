import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Verificação | Plataforma Médica",
  description: "Verifique seu email para completar o cadastro",
}

export default function VerificationPage() {
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

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Verifique seu email</CardTitle>
            <CardDescription>Enviamos um link de verificação para o seu email</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Para completar seu cadastro, clique no link de verificação que enviamos para o seu email. Se não encontrar
              o email na caixa de entrada, verifique a pasta de spam.
            </p>
            <Button className="w-full" variant="outline">
              Reenviar email de verificação
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Já verificou?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
