import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const bgUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3R8ZW58MHx8MHx8fDA%3D"

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate("/todos")
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
            <h1 className="text-4xl font-bold text-taupe-900 tracking-tight mb-2">Sign in</h1>
            <p className="text-taupe-500 text-sm mb-8">Welcome back! Enter your details.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                    placeholder="Enter your password"
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

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="data-[state=checked]:bg-cornflower-blue-500 data-[state=checked]:border-cornflower-blue-500 border-taupe-300"
                />
                <label htmlFor="remember" className="text-sm text-taupe-600 cursor-pointer select-none hover:text-taupe-800 transition-colors">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cornflower-blue-500 to-cornflower-blue-600 text-white font-semibold rounded-xl hover:from-cornflower-blue-600 hover:to-cornflower-blue-700 hover:shadow-lg hover:shadow-cornflower-blue-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </button>
            </form>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-taupe-100">
              <Link
                to="/signup"
                className="text-sm font-medium text-cornflower-blue-500 hover:text-cornflower-blue-600 transition-colors"
              >
                Create account
              </Link>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-taupe-500 hover:text-cornflower-blue-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
