"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { CustomLoginForm } from "@/components/auth/custom-login-form"

export function LoginContent() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/auth/redirect")
        }
    }, [isLoaded, isSignedIn, router])

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Área de imagem lateral (visível apenas em telas médias e grandes) */}
            <div className="hidden md:flex md:w-1/2 bg-[#00A894] relative">
                <div className="absolute inset-0 flex flex-col justify-center items-center p-10 text-white">
                    <div className="max-w-md text-center">
                        <h1 className="text-3xl font-bold mb-6">Plataforma de Streaming Médica</h1>
                        <p className="text-xl mb-6">Acesse conteúdo exclusivo e especializado para profissionais da saúde</p>
                        <div className="mt-10">

                        </div>
                    </div>
                </div>
            </div>

            {/* Área de login */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">

                    </div>

                    <CustomLoginForm />
                </div>
            </div>
        </div>
    )
} 