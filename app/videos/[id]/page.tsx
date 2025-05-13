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
    History,
    Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import CommentForm from '@/components/comments/comments-form';
import CommentList from '@/components/comments/comments-list';
import { toast } from 'sonner';

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

interface RecommendedVideo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    instructor: string;
    tags: string[];
}

// Interface para categorias de vídeos
interface VideoCategory {
    name: string;
    videos: RecommendedVideo[];
}

const VideoPage = ({ params }: { params: { id: string } }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);

    // Estado para localStorage
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [viewCount, setViewCount] = useState(0);

    // Carregar estado do localStorage
    useEffect(() => {
        if (!params.id) return;

        // Verificar se o vídeo foi curtido
        const likedVideos = JSON.parse(localStorage.getItem('apexmed-liked-videos') || '[]');
        setIsLiked(likedVideos.includes(params.id));

        // Verificar se o vídeo foi favoritado
        const favoriteVideos = JSON.parse(localStorage.getItem('apexmed-favorite-videos') || '[]');
        setIsFavorited(favoriteVideos.includes(params.id));

        // Verificar se o vídeo foi salvo
        const savedVideos = JSON.parse(localStorage.getItem('apexmed-saved-videos') || '[]');
        setIsSaved(savedVideos.includes(params.id));

        // Adicionar ao histórico
        const history = JSON.parse(localStorage.getItem('apexmed-video-history') || '[]');
        if (!history.includes(params.id)) {
            const updatedHistory = [params.id, ...history].slice(0, 50); // Limitar a 50 itens
            localStorage.setItem('apexmed-video-history', JSON.stringify(updatedHistory));
        }

        // Incrementar contagem de visualizações
        const viewCounts = JSON.parse(localStorage.getItem('apexmed-view-counts') || '{}');
        const currentViews = viewCounts[params.id] || 0;
        viewCounts[params.id] = currentViews + 1;
        localStorage.setItem('apexmed-view-counts', JSON.stringify(viewCounts));
        setViewCount(currentViews + 1);

    }, [params.id]);

    // Simular carregamento de dados
    useEffect(() => {
        // Em uma implementação real, estes dados viriam de uma API
        setTimeout(() => {
            const viewCounts = JSON.parse(localStorage.getItem('apexmed-view-counts') || '{}');
            const currentViews = viewCounts[params.id] || 0;

            // Carregar contagem de likes do localStorage
            const likedCount = JSON.parse(localStorage.getItem('apexmed-video-likes-count') || '{}');
            const videoLikes = likedCount[params.id] || 0;

            setVideoInfo({
                id: params.id,
                title: "Técnicas Avançadas em Procedimentos Médicos",
                description: "Este vídeo apresenta técnicas avançadas e protocolos atuais para procedimentos médicos complexos, com ênfase em segurança do paciente e eficiência clínica.",
                instructor: "Dra. Maria Santos",
                views: currentViews,
                likes: videoLikes,
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

    // Manipuladores de interação
    const handleLike = () => {
        const likedVideos = JSON.parse(localStorage.getItem('apexmed-liked-videos') || '[]');
        let updatedLikedVideos;
        const likesCount = JSON.parse(localStorage.getItem('apexmed-video-likes-count') || '{}');

        if (isLiked) {
            // Remover like
            updatedLikedVideos = likedVideos.filter((id: string) => id !== params.id);
            likesCount[params.id] = (likesCount[params.id] || 1) - 1;
            toast.success('Like removido');
        } else {
            // Adicionar like
            updatedLikedVideos = [...likedVideos, params.id];
            likesCount[params.id] = (likesCount[params.id] || 0) + 1;
            toast.success('Você curtiu este vídeo');
        }

        localStorage.setItem('apexmed-liked-videos', JSON.stringify(updatedLikedVideos));
        localStorage.setItem('apexmed-video-likes-count', JSON.stringify(likesCount));

        setIsLiked(!isLiked);
        if (videoInfo) {
            setVideoInfo({
                ...videoInfo,
                likes: likesCount[params.id]
            });
        }
    };

    const handleFavorite = () => {
        const favoriteVideos = JSON.parse(localStorage.getItem('apexmed-favorite-videos') || '[]');
        let updatedFavoriteVideos;

        if (isFavorited) {
            // Remover dos favoritos
            updatedFavoriteVideos = favoriteVideos.filter((id: string) => id !== params.id);
            toast.success('Removido dos favoritos');
        } else {
            // Adicionar aos favoritos
            updatedFavoriteVideos = [...favoriteVideos, params.id];
            toast.success('Adicionado aos favoritos');
        }

        localStorage.setItem('apexmed-favorite-videos', JSON.stringify(updatedFavoriteVideos));
        setIsFavorited(!isFavorited);
    };

    const handleSave = () => {
        const savedVideos = JSON.parse(localStorage.getItem('apexmed-saved-videos') || '[]');
        let updatedSavedVideos;

        if (isSaved) {
            // Remover dos salvos
            updatedSavedVideos = savedVideos.filter((id: string) => id !== params.id);
            toast.success('Removido dos salvos');
        } else {
            // Adicionar aos salvos
            updatedSavedVideos = [...savedVideos, params.id];
            toast.success('Vídeo salvo para assistir depois');
        }

        localStorage.setItem('apexmed-saved-videos', JSON.stringify(updatedSavedVideos));
        setIsSaved(!isSaved);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: videoInfo?.title || 'Vídeo ApexMed',
                text: 'Confira este vídeo no ApexMed:',
                url: window.location.href
            })
                .then(() => toast.success('Compartilhado com sucesso!'))
                .catch((error) => console.error('Erro ao compartilhar:', error));
        } else {
            // Copiar URL para a área de transferência
            navigator.clipboard.writeText(window.location.href)
                .then(() => toast.success('Link copiado para a área de transferência!'))
                .catch((error) => console.error('Erro ao copiar link:', error));
        }
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
                    accentColor="#00A894"
                    primaryColor="#00A894"
                    streamType="on-demand"
                    style={{ width: "100%", aspectRatio: "16/9", maxHeight: "80vh" }}
                />
            </div>

            {/* Conteúdo do Vídeo */}
            <div className=" px-4 md:px-8 py-6">
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
                                        <Badge key={index} className="bg-teal-custom hover:bg-teal-custom/80 text-white border-none">
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
                                    <Button
                                        variant="outline"
                                        className={`border-zinc-700 hover:bg-zinc-800 gap-2 ${isLiked ? 'text-teal-custom border-teal-custom/40' : 'text-white'}`}
                                        onClick={handleLike}
                                    >
                                        <ThumbsUp className="h-4 w-4" />
                                        {formatNumber(videoInfo?.likes || 0)}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`border-zinc-700 hover:bg-zinc-800 gap-2 ${isFavorited ? 'text-teal-custom border-teal-custom/40' : 'text-white'}`}
                                        onClick={handleFavorite}
                                    >
                                        <Heart className="h-4 w-4" />
                                        Favoritar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`border-zinc-700 hover:bg-zinc-800 gap-2 ${isSaved ? 'text-teal-custom border-teal-custom/40' : 'text-white'}`}
                                        onClick={handleSave}
                                    >
                                        <BookmarkPlus className="h-4 w-4" />
                                        Salvar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-zinc-700 text-white hover:bg-zinc-800 gap-2"
                                        onClick={handleShare}
                                    >
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

                    {/* Coluna Secundária - Vídeos Recomendados */}
                    <div className="lg:col-span-1">
                        {isLoading ? (
                            <div className="flex justify-center py-6">
                                <div className="animate-spin h-6 w-6 border-2 border-teal-custom rounded-full border-t-transparent"></div>
                            </div>
                        ) : (
                            <>
                                {videoCategories.map((category) => (
                                    <div key={category.name} className="space-y-3">
                                        <h4 className="font-medium text-zinc-300 border-l-2 border-teal-custom pl-3">
                                            {category.name}
                                        </h4>
                                        <div className="space-y-3">
                                            {category.videos.slice(0, 3).map(video => renderVideoItem(video))}
                                        </div>
                                        {category.videos.length > 3 && (
                                            <Button
                                                variant="link"
                                                className="text-teal-custom hover:text-teal-custom/80 p-0 h-auto"
                                            >
                                                Ver mais vídeos de {category.name}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPage;
