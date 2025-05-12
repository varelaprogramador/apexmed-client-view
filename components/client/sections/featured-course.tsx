import Image from "next/image"
import Link from "next/link"
import { BookOpen, Clock, Play, Plus, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function FeaturedCourse() {
  // Dados simulados - em produção viriam de uma API ou banco de dados
  const course = {
    id: 1,
    title: "React Native do Zero",
    description:
      "Aprenda a criar aplicativos móveis para iOS e Android com React Native. Este curso abrange desde os conceitos básicos até técnicas avançadas de desenvolvimento mobile, incluindo navegação, gerenciamento de estado, integração com APIs e publicação nas lojas.",
    thumbnail: "/react-native-course-thumbnail-red-black.png",
    rating: 4.6,
    students: 98,
    duration: "14 horas",
    modules: 8,
    lessons: 42,
    instructor: "Instrutor",
    tags: ["React", "Mobile", "JavaScript", "Cross-platform"],
    features: [
      "Projetos práticos reais",
      "Código-fonte completo",
      "Certificado de conclusão",
      "Acesso vitalício",
      "Suporte do instrutor",
    ],
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800/40 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagem do curso */}
        <div className="relative aspect-video md:aspect-auto md:h-full overflow-hidden">
          <Image src={course.thumbnail || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 hidden md:block" />
        </div>

        {/* Informações do curso */}
        <div className="p-6 md:p-8 flex flex-col">
          <Badge className="w-fit mb-4 bg-red-600 hover:bg-red-700 text-white border-none">Em Destaque</Badge>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{course.title}</h2>

          <p className="text-zinc-300 mb-6">{course.description}</p>

          <div className="flex flex-wrap gap-3 mb-6">
            {course.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-zinc-900/80 border-zinc-700 text-zinc-300">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <div>
                <p className="font-medium text-white">{course.rating}</p>
                <p className="text-xs text-zinc-400">Avaliação</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-400" />
              <div>
                <p className="font-medium text-white">{course.students}</p>
                <p className="text-xs text-zinc-400">Alunos</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-400" />
              <div>
                <p className="font-medium text-white">{course.duration}</p>
                <p className="text-xs text-zinc-400">Duração</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-red-400" />
              <div>
                <p className="font-medium text-white">{course.modules}</p>
                <p className="text-xs text-zinc-400">Módulos</p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-3">
            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 px-6">
              <Play className="h-5 w-5" />
              Assistir Agora
            </Button>
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 gap-2">
              <Plus className="h-5 w-5" />
              Adicionar à Minha Lista
            </Button>
            <Link href={`/videos/${course.id}`}>
              <Button variant="ghost" className="text-white hover:bg-zinc-800/60">
                Ver Detalhes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
