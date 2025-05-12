"use client"

import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export function UserProfile() {
  const { user, isLoaded } = useUser()
  const [isUpdating, setIsUpdating] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Initialize form when user data is loaded
  useState(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
    }
  })

  const handleUpdateProfile = async () => {
    if (!user) return

    setIsUpdating(true)

    try {
      await user.update({
        firstName,
        lastName,
      })

      // Sync with our database
      await fetch("/api/auth/sync")
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <div>Usuário não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Gerencie suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.imageUrl || "/logo.svg"}
                alt={user.fullName || "Avatar"}
                width={96}
                height={96}
              />
              <AvatarFallback>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-semibold">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.primaryEmailAddress?.emailAddress || ""} disabled />
              <p className="text-xs text-muted-foreground">O email não pode ser alterado diretamente</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateProfile} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
