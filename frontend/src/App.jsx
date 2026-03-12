import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import LaborLogs from "./pages/LaborLogs";
import Invoices from "./pages/Invoices";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route path="" element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* The index route renders when the URL is exactly /dashboard */}
            <Route index element={<Dashboard />} />

            {/* Future routes */}
            <Route path="labor" element={<LaborLogs />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
