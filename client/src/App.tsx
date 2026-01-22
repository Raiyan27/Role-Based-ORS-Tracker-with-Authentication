import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ORSListPage from "./pages/ORSListPage";
import ORSFormPage from "./pages/ORSFormPage";
import ORSDetailPage from "./pages/ORSDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes - All authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ors" element={<ORSListPage />} />
        <Route path="/ors/:id" element={<ORSDetailPage />} />
      </Route>

      {/* Protected routes - Admin and Inspector only */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "inspector"]} />}>
        <Route path="/ors/new" element={<ORSFormPage />} />
        <Route path="/ors/:id/edit" element={<ORSFormPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
