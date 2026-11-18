
import {
  ChevronDown,
  User,
  LogOut,
  Mail,
  Phone,
  X,
  Menu,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TopNavbarProps {
  onMenuClick: () => void;
  menuOpen: boolean;
}

function TopNavbar({ onMenuClick, menuOpen }: TopNavbarProps) {
  const [openProfile, setOpenProfile] = useState(false);
  const [employeeName, setEmployeeName] = useState("Employee");
  const [role, setRole] = useState("Employee");
  const [showContact, setShowContact] = useState(false);

  const supportEmail = "support@yesgobus.com";
  const supportPhone = "+91 8867750658";

  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmployee =
      localStorage.getItem("employee") ||
      sessionStorage.getItem("employee");

    const storedRole =
      localStorage.getItem("role") ||
      sessionStorage.getItem("role");

    if (storedEmployee) {
      try {
        const employee = JSON.parse(storedEmployee);
        setEmployeeName(
          employee.fullName || employee.name || "Employee"
        );
      } catch {
        setEmployeeName("Employee");
      }
    }

    if (storedRole) {
      setRole(storedRole);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = employeeName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    const storage = localStorage.getItem("employeeId")
      ? localStorage
      : sessionStorage;

    const employeeId = storage.getItem("employeeId");

    if (employeeId) {
      storage.removeItem(`attendance_${employeeId}`);
    }

    const keys = [
      "isLoggedIn",
      "employeeId",
      "employee",
      "role",
      "visibleEmployees",
      "token",
    ];

    keys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    setOpenProfile(false);
    navigate("/login", { replace: true });
  };

  const handleProfileClick = () => {
    setOpenProfile(false);
    navigate("/management/employees");
  };

  return (
    <div className="relative z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-white px-3 shadow-sm sm:px-6">

      {/* LEFT SECTION */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">

        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-semibold text-blue-600">
          R
        </div>

        <h1 className="truncate text-base font-semibold text-gray-800 sm:text-lg">
          Employee Dashboard
        </h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-4">

        {/* CONTACT US */}
        <button
          type="button"
          onClick={() => setShowContact(true)}
          className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 sm:gap-2 sm:px-3"
        >
          <Mail size={17} />
          <span className="hidden sm:inline">Contact Us</span>
        </button>

        {/* CONTACT MODAL */}
        {showContact && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4">

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

              <div className="flex items-center justify-between bg-indigo-600 p-4 text-white sm:p-5">
                <div>
                  <h2 className="text-lg font-bold">
                    Contact Us
                  </h2>
                  <p className="text-sm text-indigo-100">
                    Ramble Transport Private Limited
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowContact(false)}
                  className="rounded-lg p-2 transition hover:bg-white/20"
                  aria-label="Close contact details"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 p-4 sm:p-6">

                <p className="text-sm text-gray-500">
                  For assistance and HR-related queries, contact our support team.
                </p>

                <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 p-3 sm:gap-4 sm:p-4">
                  <div className="shrink-0 rounded-lg bg-indigo-50 p-3">
                    <Mail size={22} className="text-indigo-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Email Address
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                      {supportEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 sm:gap-4 sm:p-4">
                  <div className="shrink-0 rounded-lg bg-green-50 p-3">
                    <Phone size={22} className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Contact Number
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {supportPhone}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-800">
                    HR Support
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    For attendance, leave management, payroll, payslips,
                    employee information and other HR-related queries.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowContact(false)}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Close
                </button>

              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>

          <button
            type="button"
            onClick={() => setOpenProfile((previous) => !previous)}
            aria-expanded={openProfile}
            className="flex items-center gap-1 rounded-xl p-1.5 transition hover:bg-gray-50 sm:gap-2"
          >
            <div className="hidden text-right sm:block">
              <p className="max-w-36 truncate text-sm font-medium text-gray-800">
                {employeeName}
              </p>

              <p className="text-xs text-gray-500">
                {role}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
              {initials || "E"}
            </div>

            <ChevronDown
              size={15}
              className={`text-gray-500 transition-transform ${
                openProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* PROFILE DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {employeeName}
                </p>

                <p className="text-xs text-gray-500">
                  {role}
                </p>
              </div>

              <button
                type="button"
                onClick={handleProfileClick}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <User size={17} />
                My Profile
              </button>

              <div className="border-t border-gray-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;
