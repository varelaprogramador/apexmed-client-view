"use client"

import { useState, useEffect } from "react"
import { useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

// Função para traduzir os erros do Clerk
const traduzirErrosClerk = (mensagem: string): string => {
    const traducoesErros: Record<string, string> = {
        "Invalid email address": "Endereço de email inválido",
        "User not found": "Usuário não encontrado",
        "Invalid verification code": "Código de verificação inválido",
        "Verification code expired": "Código de verificação expirado",
        "Password is too weak": "A senha é muito fraca",
        "Password is too short": "A senha é muito curta",
        "Something went wrong": "Algo deu errado",
        "Too many attempts": "Muitas tentativas, tente novamente mais tarde",
        "Reset password flow not found": "Processo de redefinição de senha não encontrado",
        "Email does not exist": "Este email não está registrado"
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

export function CustomResetPasswordForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const { isLoaded, signIn } = useSignIn()

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
        setSuccessMessage("")

        try {
            // Iniciar o processo de redefinição de senha
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            })

            setVerifying(true)
            setSuccessMessage("Email enviado com sucesso! Verifique sua caixa de entrada para o código de verificação.")
        } catch (err: unknown) {
            console.error("Erro ao solicitar recuperação de senha:", err)
            if (err && typeof err === 'object' && 'errors' in err) {
                const clerkError = err as ClerkError
                const mensagemErro = clerkError.errors?.[0]?.message || "Falha ao processar a solicitação. Tente novamente."
                setError(traduzirErrosClerk(mensagemErro))
            } else {
                setError("Ocorreu um erro ao solicitar recuperação de senha. Tente novamente.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isLoaded) {
            return
        }

        setIsLoading(true)
        setError("")

        try {
            // Tenta redefinir a senha com o código e a nova senha
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code,
                password,
            })

            if (result.status === "complete") {
                setSuccessMessage("Senha redefinida com sucesso!")
                // Redireciona para a página de login após 2 segundos usando navegação direta
                setTimeout(() => {
                    window.location.href = "/auth/login"
                }, 2000)
            }
        } catch (err: unknown) {
            console.error("Erro ao redefinir senha:", err)
            if (err && typeof err === 'object' && 'errors' in err) {
                const clerkError = err as ClerkError
                const mensagemErro = clerkError.errors?.[0]?.message || "Falha ao redefinir a senha. Tente novamente."
                setError(traduzirErrosClerk(mensagemErro))
            } else {
                setError("Ocorreu um erro ao redefinir a senha. Tente novamente.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (verifying) {
        return (
            <div className="space-y-6 bg-card border rounded-lg shadow-sm p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-primary">Redefinir Senha</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Digite o código de verificação e sua nova senha
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {successMessage && (
                    <Alert variant="default" className="border-green-500 bg-green-50 text-green-700 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-foreground">Código de Verificação</Label>
                        <Input
                            id="code"
                            type="text"
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            disabled={isLoading || !!successMessage}
                            className="focus-visible:ring-primary text-center text-lg tracking-widest font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground">Nova Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading || !!successMessage}
                            minLength={8}
                            className="focus-visible:ring-primary"
                        />
                        <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres</p>
                    </div>

                    <Button type="submit" className="w-full font-medium" disabled={isLoading || !!successMessage}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Redefinindo...
                            </>
                        ) : (
                            "Redefinir Senha"
                        )}
                    </Button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                        <Link href="/auth/login" className="text-primary hover:underline font-medium" prefetch={false}>
                            Voltar para o login
                        </Link>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 bg-card border rounded-lg shadow-sm p-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-primary">Recuperar Senha</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Informe seu email para receber um código de recuperação
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {successMessage && (
                <Alert variant="default" className="border-green-500 bg-green-50 text-green-700 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <AlertDescription>{successMessage}</AlertDescription>
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
                        disabled={isLoading || !!successMessage}
                        className="focus-visible:ring-primary"
                    />
                </div>

                <Button type="submit" className="w-full font-medium" disabled={isLoading || !!successMessage}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        "Enviar código de recuperação"
                    )}
                </Button>
            </form>

            <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                    Lembrou sua senha?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline font-medium" prefetch={false}>
                        Voltar para o login
                    </Link>
                </p>
            </div>
        </div>
    )
} 