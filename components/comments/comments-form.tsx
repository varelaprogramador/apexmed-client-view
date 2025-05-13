"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Função simples para gerar ID único
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

interface CommentFormProps {
    videoId: string;
    onCommentAdded: () => void;
}

export default function CommentForm({ videoId, onCommentAdded }: CommentFormProps) {
    const { user, isSignedIn } = useUser();
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const MAX_LENGTH = 500;
    const MIN_LENGTH = 3;

    // Salvar ID do usuário no localStorage para poder usá-lo no sistema de likes
    useEffect(() => {
        if (user?.id) {
            localStorage.setItem('user-id', user.id);
        }
    }, [user?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação
        if (comment.trim().length < MIN_LENGTH) {
            setError(`O comentário deve ter pelo menos ${MIN_LENGTH} caracteres.`);
            return;
        }

        if (comment.trim().length > MAX_LENGTH) {
            setError(`O comentário não pode exceder ${MAX_LENGTH} caracteres.`);
            return;
        }

        setError(null);

        try {
            setIsSubmitting(true);

            // Pegar comentários existentes do localStorage
            const existingComments = JSON.parse(localStorage.getItem(`video-comments-${videoId}`) || '[]');

            // Criar novo comentário
            const newComment = {
                id: generateId(),
                content: comment.trim(),
                createdAt: new Date().toISOString(),
                user: {
                    id: user?.id || 'anonymous',
                    name: user?.fullName || user?.username || 'Usuário',
                    imageUrl: user?.imageUrl || '/placeholder-avatar.png'
                },
                likes: 0,
                likedBy: []
            };

            // Adicionar novo comentário e salvar no localStorage
            const updatedComments = [newComment, ...existingComments];
            localStorage.setItem(`video-comments-${videoId}`, JSON.stringify(updatedComments));

            // Limpar formulário e notificar sobre novo comentário
            setComment("");
            onCommentAdded();
        } catch (error) {
            console.error("Erro ao salvar comentário:", error);
            setError("Não foi possível salvar seu comentário. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isSignedIn) {
        return (
            <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-center">
                Faça login para deixar um comentário
            </div>
        );
    }

    const charactersLeft = MAX_LENGTH - comment.length;
    const isOverLimit = charactersLeft < 0;

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4">
                <img
                    src={user?.imageUrl || "/placeholder-avatar.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="relative">
                        <textarea
                            className={`w-full p-3 border rounded-lg bg-zinc-900 text-white placeholder:text-zinc-500 resize-none transition-colors
                                ${error ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-teal-custom'}`}
                            rows={3}
                            placeholder="Deixe seu comentário..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting}
                            maxLength={MAX_LENGTH + 10} // Pequena margem para prevenir bugs
                        />
                        <div className={`text-xs mt-1 flex justify-between items-center ${isOverLimit ? 'text-red-500' : 'text-zinc-400'}`}>
                            <div>
                                {charactersLeft < 100 && (
                                    <span>{charactersLeft} caracteres restantes</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-2 text-red-500 text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {error}
                        </div>
                    )}

                    <div className="mt-3 flex justify-end">
                        <Button
                            type="submit"
                            className="bg-teal-custom hover:bg-teal-custom/80 text-white rounded-lg flex items-center gap-2"
                            disabled={isSubmitting || isOverLimit || comment.trim().length < MIN_LENGTH}
                        >
                            <Send className="h-4 w-4" />
                            {isSubmitting ? "Enviando..." : "Enviar comentário"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}