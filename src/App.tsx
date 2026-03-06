import { ThemeProvider } from "./core/theme/ThemeContext";
import { AuthProvider } from "./features/auth/contexts/AuthContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
