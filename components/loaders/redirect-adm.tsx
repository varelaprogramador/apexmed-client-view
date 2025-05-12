import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
                    <p className="mt-2 text-zinc-400">Carregando...</p>
                </div>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Redirecionando</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Aguarde enquanto verificamos sua autenticação
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-center">
                            <Skeleton className="h-8 w-8 rounded-full bg-zinc-800" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 