import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./App";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeProvider as CustomThemeProvider } from "./context/themeContext";
import { TooltipProvider } from "./components/ui/tooltip";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="lep-ui-theme">
        <CustomThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </BrowserRouter>
          </AuthProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </TooltipProvider>
  </React.StrictMode>
);