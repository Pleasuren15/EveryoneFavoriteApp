import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
})

type LoginSchema = z.infer<typeof loginSchema>

export function Login() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/todos")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token_hash = params.get("token_hash")
    const type = params.get("type")

    if (token_hash) {
      setVerifying(true)
      supabase.auth
        .verifyOtp({ token_hash, type: type || "email" })
        .then(({ error }) => {
          if (error) {
            setAuthError(error.message)
          } else {
            window.history.replaceState({}, document.title, "/")
            navigate("/todos")
          }
          setVerifying(false)
        })
    }
  }, [navigate])

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true)
    setAuthError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setAuthError(error.message)
      setLoading(false)
    } else {
      navigate("/todos")
    }
  }

  const handleMagicLink = async () => {
    const email = getValues("email")
    if (!email) {
      setAuthError("Enter your email first")
      return
    }

    setLoading(true)
    setAuthError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      setAuthError(error.message)
    } else {
      setMagicLinkSent(true)
    }
    setLoading(false)
  }

  if (verifying) {
    return (
      <div className="h-svh flex flex-col relative items-center justify-center p-4">
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl w-full max-w-md">
          <CardHeader className="px-8 md:px-10 pt-12 pb-6 text-center">
            <CardTitle className="text-3xl font-bold text-white tracking-tight">Authentication</CardTitle>
            <CardDescription className="text-slate-400 text-sm mt-2">
              Confirming your magic link...
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 md:px-10 pb-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-svh flex flex-col relative items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="px-8 md:px-10 pt-12 pb-0">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Sign in</CardTitle>
            <CardDescription className="text-slate-400 text-sm mt-2">
              Welcome back! Enter your details.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 md:px-10 pb-12 pt-8">
            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {authError}
              </div>
            )}

            {magicLinkSent ? (
              <div className="text-center py-4">
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  Check your email for the login link!
                </div>
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/80"
                  onClick={() => setMagicLinkSent(false)}
                >
                  Back to login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 z-10 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="pl-10 bg-white/15 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 z-10 pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="pl-10 pr-12 bg-white/15 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-slate-400"
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer">
                    Remember me
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/30 active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  Sign in
                </Button>
              </form>
            )}

            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                onClick={handleMagicLink}
                className="w-full text-sm text-slate-400 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send magic link
              </Button>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
              <Link
                to="/signup"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Create account
              </Link>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
