"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSignUp } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

// Função para traduzir os erros do Clerk
const traduzirErrosClerk = (mensagem: string): string => {
  const traducoesErros: Record<string, string> = {
    "Invalid email address": "Endereço de email inválido",
    "Email address already in use": "Este email já está sendo utilizado",
    "Password is too weak": "A senha é muito fraca",
    "Password is too short": "A senha é muito curta",
    "Invalid verification code": "Código de verificação inválido",
    "Verification code expired": "Código de verificação expirado",
    "First name is required": "O primeiro nome é obrigatório",
    "Last name is required": "O sobrenome é obrigatório",
    "Password is required": "A senha é obrigatória",
    "Something went wrong": "Algo deu errado",
    "First name must contain only letters": "O nome deve conter apenas letras"
  }

  // Verifica se a mensagem existe no dicionário
  for (const [ingles, portugues] of Object.entries(traducoesErros)) {
    if (mensagem.includes(ingles)) {
      return portugues
    }
  }

  return mensagem
}

interface ClerkError {
  errors?: Array<{ message: string }>;
}

export function CustomRegisterForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState("")
  const { isLoaded, signUp, setActive } = useSignUp()

  // Limpar parâmetros de URL indesejados ao carregar o componente
  useEffect(() => {
    if (window.location.href.includes('redirect_url')) {
      // Substitui a URL atual sem os parâmetros de redirecionamento
      window.history.replaceState(
        {},
        '',
        window.location.pathname
      )
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Inicia o processo de registro
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      })

      // Envia o código de verificação por email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      // Muda para o modo de verificação
      setVerifying(true)
    } catch (err: unknown) {
      console.error("Erro ao criar conta:", err)
      if (err && typeof err === 'object' && 'errors' in err) {
        const clerkError = err as ClerkError
        const mensagemErro = clerkError.errors?.[0]?.message || "Falha ao criar conta. Tente novamente."
        setError(traduzirErrosClerk(mensagemErro))
      } else {
        setError("Ocorreu um erro durante o registro. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Verifica o código de email
      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (result.status === "complete") {
        // Define a sessão ativa
        await setActive({ session: result.createdSessionId })

        // Redireciona para dashboard usando navegação direta
        window.location.href = "/dashboard"
      } else {
        console.log("Verificação não concluída:", result)
        setError("Verificação não concluída. Tente novamente.")
      }
    } catch (err: unknown) {
      console.error("Erro ao verificar email:", err)
      if (err && typeof err === 'object' && 'errors' in err) {
        const clerkError = err as ClerkError
        const mensagemErro = clerkError.errors?.[0]?.message || "Falha ao verificar email. Tente novamente."
        setError(traduzirErrosClerk(mensagemErro))
      } else {
        setError("Ocorreu um erro durante a verificação. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="space-y-6 bg-card border rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Verificar Email</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enviamos um código para <span className="font-medium">{email}</span>. Por favor, insira o código abaixo.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground">Código de Verificação</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={isLoading}
              className="focus-visible:ring-primary text-center text-lg tracking-widest font-medium"
            />
          </div>

          <Button type="submit" className="w-full font-medium" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Email"
            )}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-card border rounded-lg shadow-sm p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">Criar Conta</h1>
        <p className="text-sm text-muted-foreground mt-1">Preencha os dados abaixo para criar sua conta</p>
      </div>

      {error && (
        <Alert variant="destructive" className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">Nome</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="João"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isLoading}
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground">Sobrenome</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Silva"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isLoading}
              className="focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={8}
            className="focus-visible:ring-primary"
          />
          <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres</p>
        </div>

        <Button type="submit" className="w-full font-medium" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium" prefetch={false}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
