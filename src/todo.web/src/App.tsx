import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import { ForgotPassword } from "@/pages/ForgotPassword"
import { TodoList } from "@/pages/TodoList"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
