import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContextProvider, useApp } from "./context/AppContext";
import { MainLayout } from "./components/MainLayout";
import { Archivi } from "./pages/Archivi";

// Protective Route Wrapper checking auth state
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user) {
    // Redirect to accounts central login page
    const loginUrl = window.location.host.includes("localhost")
      ? "http://localhost:5173/login"
      : `${window.location.protocol}//accounts.${window.location.host.split(".").slice(-2).join(".")}/login`;
    window.location.href = loginUrl;
    return null;
  }
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Archivi />
              </ProtectedRoute>
            }
          />
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
