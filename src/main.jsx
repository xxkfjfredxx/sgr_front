import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './i18n';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";

import { EmpresaProvider } from "@/context/EmpresaContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EmpresaProvider>
      <BrowserRouter>
        <ThemeProvider>
          <MaterialTailwindControllerProvider>
            <App />
          </MaterialTailwindControllerProvider>
        </ThemeProvider>
      </BrowserRouter>
    </EmpresaProvider>
  </React.StrictMode>
);
