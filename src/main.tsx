import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./core/theme/globals.css";
import App from "./App.tsx";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401 || error?.response?.status === 403)
          return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
    },
    mutations: {
      retry: false,
    },
  },

  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Erro global de query:", error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        window.location.href = "/login";
      }
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
