"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function RedirectPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirecionar para o dashboard após um pequeno delay
        const timer = setTimeout(() => {
            router.push("/dashboard")
        }, 2000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-center text-lg font-medium">
                Você já está logado. Estou te redirecionando para o dashboard...
            </p>
        </div>
    )
} 