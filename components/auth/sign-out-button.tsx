"use client"

import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  className?: string
}

export function SignOutButton({
  variant = "default",
  size = "default",
  showIcon = true,
  className = "",
}: SignOutButtonProps) {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <Button variant={variant} size={size} onClick={handleSignOut} className={className}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      Sair
    </Button>
  )
}
