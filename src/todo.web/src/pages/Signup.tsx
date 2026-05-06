import { useState } from "react"
import { Link } from "react-router-dom"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"

export function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-svh bg-taupe-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-grapefruit-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-powder-blush-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cornflower-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className="bg-white shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-cornflower-blue-500 via-icy-blue-500 to-cornflower-blue-500"></div>
          <div className="px-8 md:px-10 py-10">
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-cornflower-blue-500 text-white font-bold text-xl px-3 py-2 rounded-md">
                  NYD
                </div>
                <h1 className="text-3xl font-bold text-taupe-900 tracking-tight">
                  Not<span className="text-cornflower-blue-500">Yet</span>Done
                </h1>
              </div>
              <p className="text-taupe-500 text-base">Create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-taupe-700 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-taupe-50/80 border border-taupe-200 text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:bg-white focus:border-cornflower-blue-500 focus:ring-2 focus:ring-cornflower-blue-500/20 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-taupe-700 ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-taupe-50/80 border border-taupe-200 text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:bg-white focus:border-cornflower-blue-500 focus:ring-2 focus:ring-cornflower-blue-500/20 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-taupe-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-taupe-50/80 border border-taupe-200 text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:bg-white focus:border-cornflower-blue-500 focus:ring-2 focus:ring-cornflower-blue-500/20 transition-all"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-taupe-700 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-taupe-50/80 border border-taupe-200 text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:bg-white focus:border-cornflower-blue-500 focus:ring-2 focus:ring-cornflower-blue-500/20 transition-all"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-cornflower-blue-500 text-white font-semibold hover:bg-cornflower-blue-600 hover:shadow-lg hover:shadow-cornflower-blue-500/25 transition-all duration-200 mt-2 tracking-wide active:scale-[0.98]"
              >
                Sign Up
              </button>
            </form>

            <div className="flex justify-center mt-8 pt-6 border-t border-taupe-100">
              <Link
                to="/login"
                className="text-sm font-medium text-cornflower-blue-500 hover:text-cornflower-blue-600 hover:underline underline-offset-4 transition-all"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
