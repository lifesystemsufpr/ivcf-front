import { Bounce, ToastContainer } from "react-toastify";
import { ThemeProvider } from "./core/theme/ThemeContext";
import { AuthProvider } from "./features/auth/contexts/AuthContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastContainer
          position="top-center"
          autoClose={2500}
          limit={1}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
