"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { CustomRegisterForm } from "@/components/auth/custom-register-form"

export function RegisterContent() {
    const { isLoaded, isSignedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/auth/redirect")
        }
    }, [isLoaded, isSignedIn, router])

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Área de imagem lateral (visível apenas em telas médias e grandes) */}
            <div className="hidden md:flex md:w-1/2 bg-primary relative">
                <div className="absolute inset-0 flex flex-col justify-center items-center p-10 text-white">
                    <div className="max-w-md text-center">
                        <h1 className="text-3xl font-bold mb-6">Junte-se à comunidade médica</h1>
                        <p className="text-xl mb-6">Acesse videoaulas, webinars, conteúdos científicos e mantenha-se atualizado</p>
                        <div className="mt-10">
                            <Image
                                src="/logo.svg"
                                alt="Ilustração médica"
                                width={400}
                                height={400}
                                className="mx-auto"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Área de cadastro */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10">
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

                    <CustomRegisterForm />
                </div>
            </div>
        </div>
    )
} 