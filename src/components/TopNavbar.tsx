
import { ChevronDown, User, LogOut, Mail } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

function TopNavbar() {
  const [openProfile, setOpenProfile] = useState(false)
  const [employeeName, setEmployeeName] = useState("Employee")
  const [role, setRole] = useState("Employee")

  const profileRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedEmployee =
      localStorage.getItem("employee") ||
      sessionStorage.getItem("employee")

    const storedRole =
      localStorage.getItem("role") ||
      sessionStorage.getItem("role")

    if (storedEmployee) {
      try {
        const employee = JSON.parse(storedEmployee)
        setEmployeeName(
          employee.fullName || employee.name || "Employee"
        )
      } catch {
        setEmployeeName("Employee")
      }
    }

    if (storedRole) {
      setRole(storedRole)
    }

    // Close profile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const initials = employeeName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  // LOGOUT
  const handleLogout = () => {
    const storage = localStorage.getItem("employeeId")
      ? localStorage
      : sessionStorage

    const employeeId = storage.getItem("employeeId")

    if (employeeId) {
      storage.removeItem(`attendance_${employeeId}`)
    }

    const keys = [
      "isLoggedIn",
      "employeeId",
      "employee",
      "role",
      "visibleEmployees",
      "token",
    ]

    keys.forEach((key) => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })

    setOpenProfile(false)
    navigate("/login", { replace: true })
  }

  // CONTACT HR
  const handleContactUs = () => {
    window.location.href =
      "mailto:hr@ramblehr.com?subject=HR%20Support%20Request"
  }

  // OPEN EMPLOYEE INFORMATION
  const handleProfileClick = () => {
    setOpenProfile(false)
    navigate("/management/employees")
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 font-semibold text-blue-600">
          R
        </div>

        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Employee Dashboard
          </h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 sm:gap-6">

        {/* CONTACT US */}
        <button
          type="button"
          onClick={handleContactUs}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
        >
          <Mail size={17} />
          <span>Contact Us</span>
        </button>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>

          <button
            type="button"
            onClick={() => setOpenProfile((previous) => !previous)}
            aria-expanded={openProfile}
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-50"
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

              {/* MY PROFILE */}
              <button
                type="button"
                onClick={handleProfileClick}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <User size={17} />
                My Profile
              </button>

              <div className="border-t border-gray-100" />

              {/* LOGOUT */}
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
  )
}

export default TopNavbar
