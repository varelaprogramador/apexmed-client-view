"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [isSynced, setIsSynced] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push("/auth/login")
      return
    }

    // Sync user to database if authenticated
    const syncUser = async () => {
      try {
        await fetch("/api/auth/sync")
        setIsSynced(true)
      } catch (error) {
        console.error("Error syncing user:", error)
        // Continue anyway
        setIsSynced(true)
      }
    }

    syncUser()
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn || !isSynced) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
