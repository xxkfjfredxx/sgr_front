import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './i18n';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";
import { EmpresaProvider } from "@/context/EmpresaContext.jsx";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <EmpresaProvider>
        <BrowserRouter>
          <ThemeProvider>
            <MaterialTailwindControllerProvider>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </MaterialTailwindControllerProvider>
          </ThemeProvider>
        </BrowserRouter>
      </EmpresaProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
