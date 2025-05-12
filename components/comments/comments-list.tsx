"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, Clock, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        imageUrl: string;
    };
    likes?: number;
    likedBy?: string[];
}

export default function CommentList({ videoId }: { videoId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        // Simular ID do usuário logado - em produção, obter do Clerk
        setCurrentUserId(localStorage.getItem('user-id') || 'anonymous');
    }, []);

    const fetchComments = () => {
        try {
            setIsLoading(true);
            // Buscar comentários do localStorage
            const savedComments = localStorage.getItem(`video-comments-${videoId}`);
            const parsedComments = savedComments ? JSON.parse(savedComments) : [];

            // Aplicar ordenação
            const sortedComments = [...parsedComments].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });

            setComments(sortedComments);
        } catch (error) {
            console.error("Erro ao carregar comentários:", error);
            setComments([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Configurar um listener para storage events para atualizar em tempo real
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === `video-comments-${videoId}`) {
            fetchComments();
        }
    };

    useEffect(() => {
        fetchComments();

        // Adicionar listener para mudanças no localStorage
        window.addEventListener('storage', handleStorageChange);

        return () => {
            // Remover listener quando o componente for desmontado
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [videoId, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(current => current === 'newest' ? 'oldest' : 'newest');
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `há ${diffInSeconds} segundos`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `há ${diffInYears} ${diffInYears === 1 ? 'ano' : 'anos'}`;
    };

    const handleLikeComment = (commentId: string) => {
        if (!currentUserId) return;

        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                const likedBy = comment.likedBy || [];
                const userLikedIndex = likedBy.indexOf(currentUserId);

                if (userLikedIndex >= 0) {
                    // Remover like
                    likedBy.splice(userLikedIndex, 1);
                    return {
                        ...comment,
                        likes: (comment.likes || 0) - 1,
                        likedBy
                    };
                } else {
                    // Adicionar like
                    return {
                        ...comment,
                        likes: (comment.likes || 0) + 1,
                        likedBy: [...likedBy, currentUserId]
                    };
                }
            }
            return comment;
        });

        setComments(updatedComments);
        localStorage.setItem(`video-comments-${videoId}`, JSON.stringify(updatedComments));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-6">
                <div className="animate-spin h-6 w-6 border-2 border-red-600 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="text-center py-6 text-zinc-400">
                Nenhum comentário ainda. Seja o primeiro a comentar!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-zinc-300">
                    {comments.length} comentário{comments.length !== 1 ? 's' : ''}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSortOrder}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                    {sortOrder === 'newest' ? (
                        <>
                            <SortDesc className="h-4 w-4 mr-1" />
                            Mais recentes
                        </>
                    ) : (
                        <>
                            <SortAsc className="h-4 w-4 mr-1" />
                            Mais antigos
                        </>
                    )}
                </Button>
            </div>

            <Separator className="bg-zinc-800" />

            {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <img
                            src={comment.user.imageUrl || "/placeholder-avatar.png"}
                            alt={comment.user.name || "Usuário"}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <div className="font-medium text-white">{comment.user.name || "Usuário"}</div>
                            <div className="text-xs text-zinc-400 flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatRelativeTime(comment.createdAt)}
                            </div>
                        </div>
                    </div>

                    <p className="whitespace-pre-wrap text-zinc-300 pt-1 pb-3">{comment.content}</p>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeComment(comment.id)}
                            className={`text-xs px-2 py-1 h-auto ${comment.likedBy?.includes(currentUserId || '')
                                ? 'text-red-500'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                            {comment.likes || 0}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}