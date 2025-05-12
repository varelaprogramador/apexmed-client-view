/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, Info, Play, Plus, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ContentCarouselProps {
  title: string
  items: any[]
  type: "course" | "video" | "live" | "continue"
}

export default function ContentCarousel({ title, items, type }: ContentCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = current.clientWidth * 0.75

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex-shrink-0 snap-start relative group/item transition-all duration-300",
              type === "continue" ? "w-full md:w-[500px]" : "w-[250px] md:w-[280px]",
              hoveredIndex === index ? "scale-105 z-10" : "scale-100 z-0",
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href={`/videos/${item.muxPlaybackId}`}>
              <div className="relative aspect-video rounded-md overflow-hidden">
                <Image
                  src={item.thumbnail || (item.muxPlaybackId ? `https://image.mux.com/${item.muxPlaybackId}/thumbnail.png?width=214&height=121&time=7` : "/placeholder.svg")}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                />

                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />

                {/* Barra de progresso para "Continuar assistindo" */}
                {type === "continue" && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                    <div className="h-full bg-red-600" style={{ width: `${item.progress}%` }} />
                  </div>
                )}

                {/* Badges e informações */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {type === "live" && <Badge className="bg-red-600 text-white border-none">AO VIVO</Badge>}
                  {item.tags && item.tags[0] && (
                    <Badge className="bg-zinc-900/80 border-zinc-700 text-zinc-300">{item.tags[0]}</Badge>
                  )}
                </div>

                {/* Botões de ação no hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <Button size="icon" className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-700 text-white">
                    <Play className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="h-10 w-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white">
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="h-10 w-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Link>

            <div className="mt-2">
              <h3 className="font-medium text-white line-clamp-1">{item.title}</h3>

              {/* Informações específicas por tipo */}
              {type === "course" && (
                <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                  )}
                  {item.students && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{item.students}</span>
                    </div>
                  )}
                  {item.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.duration}</span>
                    </div>
                  )}
                </div>
              )}

              {type === "video" && (
                <div className="flex items-center justify-between mt-1 text-sm text-zinc-400">
                  <span>{item.duration}</span>
                  <span>{item.date}</span>
                </div>
              )}

              {type === "live" && (
                <div className="mt-1 text-sm text-zinc-400">
                  <p>{item.date}</p>
                  <p className="mt-0.5">{item.instructor}</p>
                </div>
              )}

              {type === "continue" && (
                <div className="mt-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">{item.progress}% concluído</span>
                    <span className="text-zinc-400">{item.duration}</span>
                  </div>
                  <p className="text-zinc-300 mt-1">{item.lastWatched}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
