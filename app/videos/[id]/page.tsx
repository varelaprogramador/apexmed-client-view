/* eslint-disable @typescript-eslint/no-unused-vars */
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
    Info,
    Check,
    Copy,
    BookmarkCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import CommentForm from '@/components/comments/comments-form';
import CommentList from '@/components/comments/comments-list';
import { useUser } from '@clerk/nextjs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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
    allowComments: boolean;
}

// Interface para categorias de vídeos
interface VideoCategory {
    name: string;
    videos: RecommendedVideo[];
}

interface RecommendedVideo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    instructor: string;
    tags: string[];
}

const VideoPage = ({ params }: { params: { id: string } }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);
    const { user, isSignedIn } = useUser();

    // Estados de interação
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [videoViews, setVideoViews] = useState(0);
    const [videoLikes, setVideoLikes] = useState(0);

    // Carregar estados do localStorage no início
    useEffect(() => {
        if (!isSignedIn) return;

        const userId = user?.id || 'anonymous';

        // Verificar interações salvas
        setIsLiked(localStorage.getItem(`video-${params.id}-liked-${userId}`) === 'true');
        setIsFavorite(localStorage.getItem(`video-${params.id}-favorite-${userId}`) === 'true');
        setIsSaved(localStorage.getItem(`video-${params.id}-saved-${userId}`) === 'true');

        // Configurar URL para compartilhamento
        setShareUrl(window.location.href);
    }, [params.id, isSignedIn, user?.id]);

    // Incrementar contagem de visualizações
    useEffect(() => {
        if (!videoInfo?.id) return;

        const viewedVideos = JSON.parse(localStorage.getItem('viewed-videos') || '{}');

        // Se este vídeo ainda não foi visto nesta sessão
        if (!viewedVideos[videoInfo.id]) {
            const updatedViews = videoInfo.views + 1;
            setVideoViews(updatedViews);

            // Marcar como visto
            viewedVideos[videoInfo.id] = true;
            localStorage.setItem('viewed-videos', JSON.stringify(viewedVideos));

            // Atualizar contagem de visualizações no localStorage
            const allVideosStats = JSON.parse(localStorage.getItem('videos-stats') || '{}');
            allVideosStats[videoInfo.id] = {
                ...allVideosStats[videoInfo.id],
                views: updatedViews
            };
            localStorage.setItem('videos-stats', JSON.stringify(allVideosStats));
        } else {
            // Apenas carregar a contagem atual
            const allVideosStats = JSON.parse(localStorage.getItem('videos-stats') || '{}');
            if (allVideosStats[videoInfo.id]?.views) {
                setVideoViews(allVideosStats[videoInfo.id].views);
            } else {
                setVideoViews(videoInfo.views);
            }

            if (allVideosStats[videoInfo.id]?.likes) {
                setVideoLikes(allVideosStats[videoInfo.id].likes);
            } else {
                setVideoLikes(videoInfo.likes);
            }
        }
    }, [videoInfo?.id, videoInfo?.views, videoInfo?.likes]);

    // Simular carregamento de dados
    useEffect(() => {
        // Em uma implementação real, estes dados viriam de uma API
        setTimeout(() => {
            setVideoInfo({
                id: params.id,
                title: "Técnicas Avançadas em Procedimentos Médicos",
                description: "Este vídeo apresenta técnicas avançadas e protocolos atuais para procedimentos médicos complexos, com ênfase em segurança do paciente e eficiência clínica.",
                instructor: "Dra. Maria Santos",
                views: 1,
                likes: 0,
                publishedAt: "14 de agosto de 2023",
                duration: "42:18",
                tags: ["Procedimentos", "Técnicas Avançadas", "Medicina", "Treinamento"],
                allowComments: true
            });

            // Dados de vídeos recomendados com tags
            const videos = [
                {
                    id: "video1",
                    title: "Novos Protocolos de Atendimento em Emergências",
                    thumbnail: "/placeholder-thumbnail.png",
                    duration: "28:45",
                    instructor: "Dr. Carlos Mendes",
                    tags: ["Procedimentos", "Vídeos recentes", "Emergência"]
                },
                {
                    id: "video2",
                    title: "Gestão de Equipes Médicas: Liderança na Prática",
                    thumbnail: "/placeholder-thumbnail.png",
                    duration: "35:12",
                    instructor: "Dr. André Oliveira",
                    tags: ["Liderança", "Gestão", "Treinamento"]
                },
                {
                    id: "video3",
                    title: "Atualização em Farmacologia Aplicada",
                    thumbnail: "/placeholder-thumbnail.png",
                    duration: "45:30",
                    instructor: "Dra. Júlia Costa",
                    tags: ["Farmacologia", "Vídeos recentes", "Medicina"]
                },
                {
                    id: "video4",
                    title: "Primeiros Socorros em Ambientes Remotos",
                    thumbnail: "/placeholder-thumbnail.png",
                    duration: "33:15",
                    instructor: "Dr. Paulo Ferreira",
                    tags: ["Emergência", "Procedimentos", "Treinamento"]
                },
                {
                    id: "video5",
                    title: "Inovações em Diagnóstico por Imagem",
                    thumbnail: "/placeholder-thumbnail.png",
                    duration: "39:50",
                    instructor: "Dra. Carla Moreira",
                    tags: ["Tecnologia", "Diagnóstico", "Vídeos recentes"]
                }
            ];

            // Organizar vídeos por categorias (tags)
            const allTags = Array.from(new Set(videos.flatMap(video => video.tags)));
            const categories = allTags.map(tag => ({
                name: tag,
                videos: videos.filter(video => video.tags.includes(tag))
            }));

            setVideoCategories(categories);
            setIsLoading(false);
        }, 1500);
    }, [params.id]);

    // Formatador de números para exibição de views
    const formatNumber = (num: number) => {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
    };

    // Renderiza um único vídeo recomendado
    const renderVideoItem = (video: RecommendedVideo) => (
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
    );

    // Funções de interação
    const handleLike = () => {
        if (!isSignedIn) return;

        const userId = user?.id || 'anonymous';
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        // Salvar estado no localStorage
        localStorage.setItem(`video-${params.id}-liked-${userId}`, newLikedState.toString());

        // Atualizar contagem
        const likeDelta = newLikedState ? 1 : -1;
        const updatedLikes = videoLikes + likeDelta;
        setVideoLikes(updatedLikes);

        // Atualizar stats no localStorage
        const allVideosStats = JSON.parse(localStorage.getItem('videos-stats') || '{}');
        allVideosStats[params.id] = {
            ...allVideosStats[params.id],
            likes: updatedLikes
        };
        localStorage.setItem('videos-stats', JSON.stringify(allVideosStats));
    };

    const handleFavorite = () => {
        if (!isSignedIn) return;

        const userId = user?.id || 'anonymous';
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);

        // Salvar no localStorage
        localStorage.setItem(`video-${params.id}-favorite-${userId}`, newFavoriteState.toString());

        // Gerenciar lista de favoritos
        const favorites = JSON.parse(localStorage.getItem(`favorites-${userId}`) || '[]');

        if (newFavoriteState) {
            if (!favorites.includes(params.id)) {
                favorites.push(params.id);
            }
        } else {
            const index = favorites.indexOf(params.id);
            if (index !== -1) {
                favorites.splice(index, 1);
            }
        }

        localStorage.setItem(`favorites-${userId}`, JSON.stringify(favorites));
    };

    const handleSave = () => {
        if (!isSignedIn) return;

        const userId = user?.id || 'anonymous';
        const newSavedState = !isSaved;
        setIsSaved(newSavedState);

        // Salvar estado no localStorage
        localStorage.setItem(`video-${params.id}-saved-${userId}`, newSavedState.toString());

        // Gerenciar lista de salvos
        const savedVideos = JSON.parse(localStorage.getItem(`saved-videos-${userId}`) || '[]');

        if (newSavedState) {
            if (!savedVideos.includes(params.id)) {
                savedVideos.push(params.id);
            }
        } else {
            const index = savedVideos.indexOf(params.id);
            if (index !== -1) {
                savedVideos.splice(index, 1);
            }
        }

        localStorage.setItem(`saved-videos-${userId}`, JSON.stringify(savedVideos));
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Falha ao copiar link:', err);
        }
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


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-8 py-6">
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
                                <span className="mr-4">{formatNumber(videoViews || videoInfo?.views || 0)} visualizações</span>
                                <span>{videoInfo?.publishedAt}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={`border-zinc-700 hover:bg-zinc-800 gap-2 ${isLiked ? 'text-red-500 border-red-500/50' : 'text-white'}`}
                                                onClick={handleLike}
                                                disabled={!isSignedIn}
                                            >
                                                <ThumbsUp className="h-4 w-4" />
                                                {formatNumber(videoLikes || videoInfo?.likes || 0)}
                                            </Button>
                                        </TooltipTrigger>
                                        {!isSignedIn && (
                                            <TooltipContent>
                                                <p>Faça login para curtir este vídeo</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={`border-zinc-700 hover:bg-zinc-800 gap-2 ${isFavorite ? 'text-red-500 border-red-500/50' : 'text-white'}`}
                                                onClick={handleFavorite}
                                                disabled={!isSignedIn}
                                            >
                                                <Heart className="h-4 w-4" />
                                                Favoritar
                                            </Button>
                                        </TooltipTrigger>
                                        {!isSignedIn && (
                                            <TooltipContent>
                                                <p>Faça login para favoritar este vídeo</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={`border-zinc-700 hover:bg-zinc-800 gap-2 ${isSaved ? 'text-red-500 border-red-500/50' : 'text-white'}`}
                                                onClick={handleSave}
                                                disabled={!isSignedIn}
                                            >
                                                {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                                                {isSaved ? 'Salvo' : 'Salvar'}
                                            </Button>
                                        </TooltipTrigger>
                                        {!isSignedIn && (
                                            <TooltipContent>
                                                <p>Faça login para salvar este vídeo</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 gap-2">
                                                <Share2 className="h-4 w-4" />
                                                Compartilhar
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-72 p-3 bg-zinc-900 border-zinc-700">
                                            <h4 className="font-medium mb-2">Compartilhar vídeo</h4>
                                            <div className="flex mb-4">
                                                <input
                                                    type="text"
                                                    value={shareUrl}
                                                    readOnly
                                                    className="flex-1 bg-zinc-800 p-2 text-sm rounded-l-md focus:outline-none"
                                                />
                                                <Button
                                                    className="rounded-l-none bg-red-600 hover:bg-red-700"
                                                    size="sm"
                                                    onClick={handleCopyLink}
                                                >
                                                    {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            {copySuccess && (
                                                <p className="text-green-500 text-xs">Link copiado para a área de transferência!</p>
                                            )}
                                        </PopoverContent>
                                    </Popover>
                                </TooltipProvider>
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

                            <div className="bg-zinc-900/60 rounded-lg p-5">
                                <h3 className="font-semibold text-lg mb-6 flex items-center">
                                    <MessageSquare className="mr-2 h-5 w-5 text-zinc-400" />
                                    Comentários
                                </h3>
                                {videoInfo && videoInfo.allowComments !== false ? (
                                    <div className="space-y-8">
                                        <CommentForm
                                            videoId={params.id}
                                            onCommentAdded={() => {
                                                // Forçar atualização da lista de comentários
                                                const event = new StorageEvent('storage', {
                                                    key: `video-comments-${params.id}`
                                                });
                                                window.dispatchEvent(event);
                                            }}
                                        />
                                        <Separator className="bg-zinc-800" />
                                        <CommentList videoId={params.id} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-zinc-400">
                                        <MessageSquare className="h-12 w-12 mb-4 opacity-30" />
                                        <p className="text-center">
                                            Os comentários estão desativados para este vídeo.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Coluna Lateral - Vídeos Recomendados por Categorias */}

            </div>

        </div>
    );
};

export default VideoPage;
