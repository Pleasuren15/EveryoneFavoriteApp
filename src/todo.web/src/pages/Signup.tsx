import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react"

const bgUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3R8ZW58MHx8MHx8fDA%3D"

export function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-svh relative overflow-hidden flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-8 md:px-10 py-12">
            <h1 className="text-4xl font-bold text-taupe-900 tracking-tight mb-2">Create Account</h1>
            <p className="text-taupe-500 text-sm mb-8">Sign up to get started.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-taupe-700 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400 group-focus-within:text-cornflower-blue-500 transition-colors" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-taupe-200 rounded-xl text-taupe-900 placeholder:text-taupe-400 text-sm focus:outline-none focus:border-cornflower-blue-500 focus:ring-4 focus:ring-cornflower-blue-500/10 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-taupe-700 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400 group-focus-within:text-cornflower-blue-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-taupe-200 rounded-xl text-taupe-900 placeholder:text-taupe-400 text-sm focus:outline-none focus:border-cornflower-blue-500 focus:ring-4 focus:ring-cornflower-blue-500/10 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-taupe-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400 group-focus-within:text-cornflower-blue-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-taupe-200 rounded-xl text-taupe-900 placeholder:text-taupe-400 text-sm focus:outline-none focus:border-cornflower-blue-500 focus:ring-4 focus:ring-cornflower-blue-500/10 transition-all"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-taupe-700 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-400 group-focus-within:text-cornflower-blue-500 transition-colors" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-taupe-200 rounded-xl text-taupe-900 placeholder:text-taupe-400 text-sm focus:outline-none focus:border-cornflower-blue-500 focus:ring-4 focus:ring-cornflower-blue-500/10 transition-all"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-taupe-400 hover:text-taupe-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cornflower-blue-500 to-cornflower-blue-600 text-white font-semibold rounded-xl hover:from-cornflower-blue-600 hover:to-cornflower-blue-700 hover:shadow-lg hover:shadow-cornflower-blue-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>
            </form>

            <div className="flex justify-center mt-6 pt-5 border-t border-taupe-100">
              <Link
                to="/login"
                className="text-sm font-medium text-cornflower-blue-500 hover:text-cornflower-blue-600 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
