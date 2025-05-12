"use client"

import { useState } from "react"
import Image from "next/image"
import { Info, Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ClientHero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative w-full h-[70vh] min-h-[500px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem de fundo */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/online-course-thumbnail-red-black.png"
          alt="Desenvolvimento Web Completo"
          fill
          className={`object-cover transition-transform duration-700 ${isHovered ? "scale-105" : "scale-100"}`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Conteúdo do hero */}
      <div className="relative h-full container mx-auto px-4 md:px-8 flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-2xl">
          <Badge className="mb-4 bg-red-600 hover:bg-red-700 text-white border-none">Mais Popular</Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
            Desenvolvimento Web Completo
          </h1>

          <p className="text-lg text-zinc-300 mb-6 max-w-xl">
            Domine HTML, CSS, JavaScript, React, Node.js e mais neste curso completo. Ideal para iniciantes e
            desenvolvedores que querem aprimorar suas habilidades.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="outline" className="bg-zinc-900/80 border-zinc-700 text-zinc-300">
              HTML & CSS
            </Badge>
            <Badge variant="outline" className="bg-zinc-900/80 border-zinc-700 text-zinc-300">
              JavaScript
            </Badge>
            <Badge variant="outline" className="bg-zinc-900/80 border-zinc-700 text-zinc-300">
              React
            </Badge>
            <Badge variant="outline" className="bg-zinc-900/80 border-zinc-700 text-zinc-300">
              Node.js
            </Badge>
            <Badge variant="outline" className="bg-zinc-900/80 border-zinc-700 text-zinc-300">
              12 horas
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 px-6 py-6">
              <Play className="h-5 w-5" />
              Assistir Agora
            </Button>
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 gap-2 px-6 py-6">
              <Plus className="h-5 w-5" />
              Adicionar à Minha Lista
            </Button>
            <Button variant="ghost" className="text-white hover:bg-zinc-800/60 gap-2 px-6 py-6">
              <Info className="h-5 w-5" />
              Mais Informações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
