import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPassword() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const email = watch("email")

  const onSubmit = () => {
    setSent(true)
  }

  return (
    <div className="h-svh flex flex-col relative items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="px-8 md:px-10 pt-12 pb-0">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Reset Password</CardTitle>
            <CardDescription className="text-slate-400 text-sm mt-2">
              Enter your email to receive a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 md:px-10 pb-12 pt-8">
            {sent ? (
              <div className="text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="inline-flex p-3 bg-emerald-100 rounded-lg mb-4">
                  <Send className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-white font-semibold mb-1">Check your email</p>
                <p className="text-slate-400 text-sm mb-6">
                  We&apos;ve sent a reset link to <span className="font-medium text-slate-200">{email}</span>
                </p>
                <Button variant="link" asChild>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            ) : (
              <>
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
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/30 active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    Send Reset Link
                  </Button>
                </form>

                <div className="flex justify-center mt-6 pt-5 border-t border-white/10">
                  <Button variant="link" asChild>
                    <Link
                      to="/login"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
