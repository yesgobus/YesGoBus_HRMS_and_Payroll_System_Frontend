
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  Wallet,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
} from "lucide-react"

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [openManagement, setOpenManagement] = useState(false)

  // ==================================================
  // TEMPORARY MENU VISIBILITY
  // Change false to true whenever you want to show them
  // ==================================================

  const showPayroll = false
  const showReports = false
  const showSettings = false

  // ==================================================
  // GET STORED VALUE
  // ==================================================

  const getStoredValue = (key: string) => {
    return (
      localStorage.getItem(key) ||
      sessionStorage.getItem(key)
    )
  }

  // ==================================================
  // CHECK EMPLOYEE VISIBILITY
  // ==================================================

  const getVisibleEmployees = () => {
    const storedEmployees = getStoredValue("visibleEmployees")

    if (!storedEmployees) {
      return []
    }

    try {
      const parsedEmployees = JSON.parse(storedEmployees)

      return Array.isArray(parsedEmployees)
        ? parsedEmployees
        : []
    } catch (error) {
      console.error("Failed to parse visible employees:", error)
      return []
    }
  }

  const visibleEmployees = getVisibleEmployees()

  const canViewEmployees = visibleEmployees.length > 1

  // ==================================================
  // MENU
  // ==================================================

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },

    ...(canViewEmployees
      ? [
          {
            name: "Employees",
            path: "/employees",
            icon: Users,
          },
        ]
      : []),

    {
      name: "Attendance",
      path: "/attendance",
      icon: Clock,
    },

    {
      name: "Leave",
      path: "/leave",
      icon: Calendar,
    },

    ...(showPayroll
      ? [
          {
            name: "Payroll",
            path: "/payroll",
            icon: Wallet,
          },
        ]
      : []),

    ...(showReports
      ? [
          {
            name: "Reports",
            path: "/reports",
            icon: BarChart3,
          },
        ]
      : []),
  ]

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-60"
      } bg-slate-900 text-white min-h-screen transition-all duration-300`}
    >

      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="p-6 border-b border-slate-700 flex items-center justify-between">

        {!collapsed && (
          <div>
            <p className="font-semibold">
              RambleHR
            </p>

            <p className="text-xs text-gray-400">
              Transport Pvt Ltd
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

      </div>

      {/* ==================================================
          MENU
      ================================================== */}

      <div className="mt-6 px-2">

        {/* MAIN MENU */}

        {menu.map((item) => {
          const Icon = item.icon

          const isActive =
            location.pathname === item.path

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3
                px-4 py-3
                rounded-lg
                text-sm
                mb-1
                transition

                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >

              <Icon size={20} />

              {!collapsed && (
                <span>{item.name}</span>
              )}

            </Link>
          )
        })}

        {/* ==================================================
            MANAGEMENT
        ================================================== */}

        <div className="mt-2">

          <button
            type="button"
            onClick={() =>
              setOpenManagement(!openManagement)
            }
            className="
              w-full
              flex
              items-center
              justify-between
              px-4
              py-3
              rounded-lg
              text-sm
              text-gray-300
              hover:bg-slate-800
              hover:text-white
              transition
            "
          >

            <div className="flex items-center gap-3">

              <Building2 size={20} />

              {!collapsed && (
                <span>Management</span>
              )}

            </div>

            {!collapsed && (
              openManagement ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )
            )}

          </button>

          {/* MANAGEMENT SUB MENU */}

          {openManagement && !collapsed && (

            <div className="ml-8 mt-1">

              {/* STRUCTURE */}

              <button
                type="button"
                onClick={() =>
                  navigate("/management/structure")
                }
                className={`
                  block
                  w-full
                  text-left
                  px-3
                  py-2
                  text-sm
                  rounded-lg
                  transition

                  ${
                    location.pathname === "/management/structure"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                Structure
              </button>

              {/* EMPLOYEE INFO */}

              <button
                type="button"
                onClick={() =>
                  navigate("/management/employees")
                }
                className={`
                  block
                  w-full
                  text-left
                  px-3
                  py-2
                  text-sm
                  rounded-lg
                  transition

                  ${
                    location.pathname === "/management/employees"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                Employee Info
              </button>

            </div>

          )}

        </div>

        {/* ==================================================
            SETTINGS
        ================================================== */}

        {showSettings && (
          <Link
            to="/settings"
            className={`
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-lg
              text-sm
              mt-2
              transition

              ${
                location.pathname === "/settings"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
              }
            `}
          >

            <Settings size={20} />

            {!collapsed && (
              <span>Settings</span>
            )}

          </Link>
        )}

      </div>

    </div>
  )
}

export default Sidebar
