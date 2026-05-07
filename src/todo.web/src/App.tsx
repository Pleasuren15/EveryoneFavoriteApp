import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import { ForgotPassword } from "@/pages/ForgotPassword"
import { TodoList } from "@/pages/TodoList"
import { TodoItems } from "@/pages/TodoItems"
import { ShoppingItems } from "@/pages/ShoppingItems"
import { PersonalItems } from "@/pages/PersonalItems"
import { WorkItems } from "@/pages/WorkItems"
import { OthersItems } from "@/pages/OthersItems"
import { BudgetPage } from "@/pages/BudgetPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/todos/shopping" element={<ShoppingItems />} />
        <Route path="/todos/personal" element={<PersonalItems />} />
        <Route path="/todos/work" element={<WorkItems />} />
        <Route path="/todos/others" element={<OthersItems />} />
        <Route path="/todos/budget" element={<BudgetPage />} />
        <Route path="/todos/:category" element={<TodoItems />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
