import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContextProvider, useApp } from "./context/AppContext";
import { MainLayout } from "./components/MainLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Jawdati } from "./pages/Jawdati";
import { Mahattati } from "./pages/Mahattati";
import { Archivi } from "./pages/Archivi";

// Protective Route Wrapper checking mock auth state
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

// Public Route wrapper (prevents logged in users from seeing login again)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Main Layout routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jawdati"
            element={
              <ProtectedRoute>
                <Jawdati />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mahattati"
            element={
              <ProtectedRoute>
                <Mahattati />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archivi"
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
