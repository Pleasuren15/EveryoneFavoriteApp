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
import { BirthdayItems } from "@/pages/BirthdayItems"
import { ContactsItems } from "@/pages/ContactsItems"
import { BudgetPage } from "@/pages/BudgetPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Beams from "@/components/Beams"

export function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 z-0">
          <Beams
            beamWidth={3}
            beamHeight={30}
            beamNumber={20}
            lightColor="#ffffff"
            speed={0.5}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/todos" element={<TodoList />} />
              <Route path="/todos/shopping" element={<ShoppingItems />} />
              <Route path="/todos/personal" element={<PersonalItems />} />
              <Route path="/todos/work" element={<WorkItems />} />
              <Route path="/todos/others" element={<OthersItems />} />
              <Route path="/todos/contacts" element={<ContactsItems />} />
              <Route path="/todos/budget" element={<BudgetPage />} />
              <Route path="/todos/birthday" element={<BirthdayItems />} />
              <Route path="/todos/:category" element={<TodoItems />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
