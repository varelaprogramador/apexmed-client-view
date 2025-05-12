"use client"

import { useState, useEffect } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import {
    ChevronLeft,
    Heart,
    Share2,
    BookmarkPlus,
    ThumbsUp,
    MessageSquare,
    Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

// Interface para o vídeo (simulado para este exemplo)
interface VideoInfo {
    id: string;
    title: string;
    description: string;
    instructor: string;
    views: number;
    likes: number;
    publishedAt: string;
    duration: string;
    tags: string[];
}

interface RecommendedVideo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    instructor: string;
}

const VideoPage = ({ params }: { params: { id: string } }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [recommendedVideos, setRecommendedVideos] = useState<RecommendedVideo[]>([]);

    // Simular carregamento de dados
    useEffect(() => {
        // Em uma implementação real, estes dados viriam de uma API
        setTimeout(() => {
            setVideoInfo({
                id: params.id,
                title: "Técnicas Avançadas em Procedimentos Médicos",
                description: "Este vídeo apresenta técnicas avançadas e protocolos atuais para procedimentos médicos complexos, com ênfase em segurança do paciente e eficiência clínica.",
                instructor: "Dra. Maria Santos",
                views: 1287,
                likes: 342,
                publishedAt: "14 de agosto de 2023",
                duration: "42:18",
                tags: ["Procedimentos", "Técnicas Avançadas", "Medicina", "Treinamento"]
            });

            setRecommendedVideos([
                {
                    id: "video1",
                    title: "Novos Protocolos de Atendimento em Emergências",
                    thumbnail: "/placeholder-thumbnail.png",
                    duration: "28:45",
                    instructor: "Dr. Carlos Mendes"
                },
                {
                    id: "video2",
                    title: "Gestão de Equipes Médicas: Liderança na Prática",
                    thumbnail: "/placeholder-thumbnail.png",
                    duration: "35:12",
                    instructor: "Dr. André Oliveira"
                },
                {
                    id: "video3",
                    title: "Atualização em Farmacologia Aplicada",
                    thumbnail: "/placeholder-thumbnail.png",
                    duration: "45:30",
                    instructor: "Dra. Júlia Costa"
                }
            ]);

            setIsLoading(false);
        }, 1500);
    }, [params.id]);

    // Formatador de números para exibição de views
    const formatNumber = (num: number) => {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Área do Player de Vídeo */}
            <div className="relative bg-black w-full">
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/home">
                        <Button size="sm" variant="ghost" className="text-white bg-black/40 backdrop-blur-sm hover:bg-black/60">
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Voltar
                        </Button>
                    </Link>
                </div>

                <MuxPlayer
                    playbackId={params.id}
                    metadata={{
                        video_title: videoInfo?.title || "Carregando...",
                        viewer_user_id: "user_123",
                    }}
                    accentColor="#dc2626"
                    primaryColor="#dc2626"
                    streamType="on-demand"
                    style={{ width: "100%", aspectRatio: "16/9", maxHeight: "80vh" }}
                />
            </div>

            {/* Conteúdo do Vídeo */}
            <div className="container mx-auto px-4 md:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna Principal - Informações do Vídeo */}
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-zinc-800 rounded w-3/4"></div>
                                <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                                <div className="h-24 bg-zinc-800 rounded"></div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    {videoInfo?.tags.map((tag, index) => (
                                        <Badge key={index} className="bg-red-600/90 hover:bg-red-700 text-white border-none">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                    {videoInfo?.title}
                                </h1>

                                <div className="flex items-center text-zinc-400 mb-4">
                                    <span className="mr-4">{videoInfo?.instructor}</span>
                                    <span className="mr-4">{formatNumber(videoInfo?.views || 0)} visualizações</span>
                                    <span>{videoInfo?.publishedAt}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 gap-2">
                                        <ThumbsUp className="h-4 w-4" />
                                        {formatNumber(videoInfo?.likes || 0)}
                                    </Button>
                                    <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 gap-2">
                                        <Heart className="h-4 w-4" />
                                        Favoritar
                                    </Button>
                                    <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 gap-2">
                                        <BookmarkPlus className="h-4 w-4" />
                                        Salvar
                                    </Button>
                                    <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 gap-2">
                                        <Share2 className="h-4 w-4" />
                                        Compartilhar
                                    </Button>
                                </div>

                                <Separator className="my-6 bg-zinc-800" />

                                <div className="bg-zinc-900/60 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                                        <Info className="mr-2 h-5 w-5 text-zinc-400" />
                                        Sobre este vídeo
                                    </h3>
                                    <p className="text-zinc-300">
                                        {videoInfo?.description}
                                    </p>
                                </div>

                                <div className="bg-zinc-900/60 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                                        <MessageSquare className="mr-2 h-5 w-5 text-zinc-400" />
                                        Comentários
                                    </h3>
                                    <p className="text-zinc-400 text-center py-4">
                                        Os comentários estão desativados para este vídeo.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Coluna Lateral - Vídeos Recomendados */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold mb-4">Vídeos recomendados</h3>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse flex gap-3">
                                        <div className="bg-zinc-800 rounded w-32 h-20"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
                                            <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recommendedVideos.map((video) => (
                                    <Link href={`/videos/${video.id}`} key={video.id}>
                                        <div className="flex gap-3 hover:bg-zinc-900/60 p-2 rounded-lg transition-colors cursor-pointer">
                                            <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute right-1 bottom-1 bg-black/70 text-white text-xs px-1 rounded">
                                                    {video.duration}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                                                <p className="text-zinc-400 text-xs mt-1">{video.instructor}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPage;
