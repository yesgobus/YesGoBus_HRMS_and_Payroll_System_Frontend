
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  X,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [openManagement, setOpenManagement] = useState(false);

  const showPayroll = false;
  const showReports = false;
  const showSettings = false;

  const getStoredValue = (key: string) => {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  };

  const getVisibleEmployees = () => {
    const storedEmployees = getStoredValue("visibleEmployees");

    if (!storedEmployees) return [];

    try {
      const parsedEmployees = JSON.parse(storedEmployees);
      return Array.isArray(parsedEmployees) ? parsedEmployees : [];
    } catch (error) {
      console.error("Failed to parse visible employees:", error);
      return [];
    }
  };

  const visibleEmployees = getVisibleEmployees();
  const canViewEmployees = visibleEmployees.length > 1;

  // Close mobile drawer when navigating to another page
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    ...(canViewEmployees
      ? [{ name: "Employees", path: "/employees", icon: Users }]
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
      ? [{ name: "Payroll", path: "/payroll", icon: Wallet }]
      : []),
    ...(showReports
      ? [{ name: "Reports", path: "/reports", icon: BarChart3 }]
      : []),
  ];

  const navigateTo = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        h-screen shrink-0 overflow-y-auto
        bg-slate-900 text-white
        transition-all duration-300 ease-in-out
        w-72
        ${collapsed ? "md:w-20" : "md:w-60"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0
      `}
    >
      {/* LOGO */}
      <div className="flex min-h-24 items-center justify-between border-b border-slate-700 px-5 py-5 sm:px-6">

        <div className={collapsed ? "md:hidden" : ""}>
          <p className="text-xl font-semibold sm:text-2xl">
            RambleHR
          </p>
          <p className="mt-1 text-sm text-gray-400 sm:text-base">
            Transport Pvt Ltd
          </p>
        </div>

        {/* DESKTOP COLLAPSE */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-lg p-2 text-gray-400 transition hover:bg-slate-800 hover:text-white md:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* MOBILE CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-300 transition hover:bg-slate-800 hover:text-white md:hidden"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      </div>

      {/* MENU */}
      <div className="mt-5 space-y-1 px-3 pb-8">

        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={`
                mb-1 flex items-center gap-3 rounded-xl
                px-4 py-3.5 text-sm transition
                ${isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon size={21} className="shrink-0" />

              <span className={`${collapsed ? "md:hidden" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* MANAGEMENT */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setOpenManagement(!openManagement)}
            className="
              flex w-full items-center justify-between rounded-xl
              px-4 py-3.5 text-sm text-gray-300 transition
              hover:bg-slate-800 hover:text-white
            "
          >
            <div className="flex items-center gap-3">
              <Building2 size={21} className="shrink-0" />
              <span className={collapsed ? "md:hidden" : ""}>
                Management
              </span>
            </div>

            <span className={collapsed ? "md:hidden" : ""}>
              {openManagement ? (
                <ChevronUp size={17} />
              ) : (
                <ChevronDown size={17} />
              )}
            </span>
          </button>

          {openManagement && (
            <div className="ml-8 mt-1 space-y-1">
              <button
                type="button"
                onClick={() => navigateTo("/management/structure")}
                className={`
                  block w-full rounded-lg px-3 py-2.5 text-left text-sm transition
                  ${location.pathname === "/management/structure"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                Structure
              </button>

              <button
                type="button"
                onClick={() => navigateTo("/management/employees")}
                className={`
                  block w-full rounded-lg px-3 py-2.5 text-left text-sm transition
                  ${location.pathname === "/management/employees"
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

        {/* SETTINGS */}
        {showSettings && (
          <Link
            to="/settings"
            className={`
              mt-2 flex items-center gap-3 rounded-xl px-4 py-3.5
              text-sm transition
              ${location.pathname === "/settings"
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
              }
            `}
          >
            <Settings size={21} />
            <span className={collapsed ? "md:hidden" : ""}>Settings</span>
          </Link>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
