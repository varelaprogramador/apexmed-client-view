"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

// Função para traduzir os erros do Clerk
const traduzirErrosClerk = (mensagem: string): string => {
  const traducoesErros: Record<string, string> = {
    "Invalid email or password": "Email ou senha inválidos",
    "Email not verified": "Email não verificado",
    "User not found": "Usuário não encontrado",
    "Invalid verification code": "Código de verificação inválido",
    "Password does not meet requirements": "A senha não atende aos requisitos",
    "Something went wrong": "Algo deu errado",
    "Access denied": "Acesso negado",
    "Authentication required": "Autenticação necessária",
    "Verification required": "Verificação necessária"
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

export function CustomLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { isLoaded, signIn, setActive } = useSignIn()

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
      // Inicia o processo de login com email e senha
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        // Define a sessão ativa
        await setActive({ session: result.createdSessionId })

        // Redireciona para dashboard diretamente, sem usar métodos do router que podem adicionar parâmetros
        window.location.href = "/dashboard"
      } else {
        // Para fluxos que precisam de verificação adicional
        if (result.status === "needs_second_factor") {
          // Usa navegação direta em vez do router
          window.location.href = "/auth/verification"
        } else if (result.status === "needs_first_factor") {
          setError("Credenciais inválidas. Verifique seu e-mail e senha.")
        } else {
          console.log("Status não tratado:", result)
          setError("Ocorreu um erro durante o login. Tente novamente.")
        }
      }
    } catch (err: unknown) {
      console.error("Erro ao fazer login:", err)
      if (err && typeof err === 'object' && 'errors' in err) {
        const clerkError = err as ClerkError
        const mensagemErro = clerkError.errors?.[0]?.message || "Falha ao fazer login. Verifique suas credenciais."
        setError(traduzirErrosClerk(mensagemErro))
      } else {
        setError("Ocorreu um erro durante o login. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 bg-card border rounded-lg shadow-sm p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">Login</h1>
        <p className="text-sm text-muted-foreground mt-1">Entre com suas credenciais para acessar sua conta</p>
      </div>

      {error && (
        <Alert variant="destructive" className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground">Senha</Label>
            <Link href="/auth/reset-password" className="text-sm text-primary hover:underline font-medium">
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="focus-visible:ring-primary"
          />
        </div>

        <Button type="submit" className="w-full font-medium" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-medium" prefetch={false}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
