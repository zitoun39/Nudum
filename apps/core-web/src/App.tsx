import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContextProvider, useApp } from "./context/AppContext";
import { MainLayout } from "./components/MainLayout";
import { Login } from "./pages/Login";
import { PortalDashboard } from "./pages/PortalDashboard";
import { AppPortal } from "./pages/AppPortal";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

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
                <PortalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <AppPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
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
