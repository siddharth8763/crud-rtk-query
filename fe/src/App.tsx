import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ItemList } from "./components/ItemList";
import { ItemForm } from "./components/ItemForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Root route - shows ItemList if authenticated, Login if not */}
        <Route path="/" element={isAuthenticated ? <ItemList /> : <Login />} />

        {/* Protected routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <ItemForm />
            </ProtectedRoute>
          }
        />
        {/* Removed /edit/:id route since ItemForm does not support editing */}
        <Route
          path="/itemlist"
          element={
            <ProtectedRoute>
              <ItemList />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
