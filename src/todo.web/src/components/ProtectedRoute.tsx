import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-svh flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
