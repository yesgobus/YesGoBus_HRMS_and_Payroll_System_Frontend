
import { Routes, Route, Navigate } from "react-router-dom"

import DashboardLayout from "./layouts/DashboardLayout"

import Login from "./pages/Login"

import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import Payroll from "./pages/Payroll"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"

import ManagementStructure from "./pages/ManagementStructure"
import EmployeeInfo from "./pages/EmployeeInfo"
import EmployeeDetails from "./pages/EmployeeDetails"

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />

      <Route
        path="/employees"
        element={
          <DashboardLayout>
            <Employees />
          </DashboardLayout>
        }
      />

      <Route
        path="/attendance"
        element={
          <DashboardLayout>
            <Attendance />
          </DashboardLayout>
        }
      />

      <Route
        path="/leave"
        element={
          <DashboardLayout>
            <Leave />
          </DashboardLayout>
        }
      />

      <Route
        path="/payroll"
        element={
          <DashboardLayout>
            <Payroll />
          </DashboardLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        }
      />

      {/* MANAGEMENT */}
      <Route
        path="/management/structure"
        element={
          <DashboardLayout>
            <ManagementStructure />
          </DashboardLayout>
        }
      />

      <Route
        path="/management/employees"
        element={
          <DashboardLayout>
            <EmployeeInfo />
          </DashboardLayout>
        }
      />

      <Route
        path="/management/employees/:id"
        element={
          <DashboardLayout>
            <EmployeeDetails />
          </DashboardLayout>
        }
      />

      {/* UNKNOWN ROUTES */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App
