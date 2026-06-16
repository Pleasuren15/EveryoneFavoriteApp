import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ApolloProvider } from "@apollo/client/react"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/lib/auth-context.tsx"
import { TodoProvider } from "@/lib/todo-context.tsx"
import { apolloClient } from "@/lib/apollo-client.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ThemeProvider>
          <TodoProvider>
            <App />
          </TodoProvider>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
)
