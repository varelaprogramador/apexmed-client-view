/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"

interface SaveProgressParams {
    videoId: string
    userId: string
    progress: number
    currentTime: number
    completed?: boolean
}

export async function saveVideoProgress({
    videoId,
    userId,
    progress,
    currentTime,
    completed = false,
}: SaveProgressParams) {
    try {
        // Aqui você implementaria a lógica para salvar o progresso no banco de dados
        // Por exemplo, usando Prisma:
        /*
        const result = await prisma.videoProgress.upsert({
          where: {
            userId_videoId: {
              userId,
              videoId,
            },
          },
          update: {
            progress,
            currentTime,
            completed,
            lastUpdated: new Date(),
          },
          create: {
            userId,
            videoId,
            progress,
            currentTime,
            completed,
            lastUpdated: new Date(),
          },
        });
        */

        // Simulação de uma chamada de API bem-sucedida
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Revalidar caminhos relevantes
        revalidatePath(`/videos/${videoId}`)
        revalidatePath(`/cliente/perfil`)

        return { success: true }
    } catch (error) {
        console.error("Erro ao salvar progresso do vídeo:", error)
        return { success: false, error: "Falha ao salvar progresso" }
    }
}
