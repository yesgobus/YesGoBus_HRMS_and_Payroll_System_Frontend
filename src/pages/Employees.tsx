import { useEffect, useMemo, useState } from "react"
import {
  Search,
  Users,
  Mail,
  Phone,
  CalendarDays,
  BriefcaseBusiness,
  Building2,
  UserRound,
  RefreshCw,
  Loader2,
  Eye,
  X,
  Clock3,
} from "lucide-react"

import {
  getEmployeeTeam,
  type Employee,
} from "../services/employeeService"

import { API_BASE_URL } from "../config/api"

interface ManagerAttendanceRecord {
  employeeId: string
  name: string
  department: string
  designation: string
  date: string
  checkIn: string | null
  checkOut: string | null
  totalWorkingHours: string | null
  status: string
}

interface ManagerAttendanceResponse {
  success: boolean
  managerId: string
  count: number
  attendance: ManagerAttendanceRecord[]
}

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("All")
  const [managerId, setManagerId] = useState("")

  // Attendance modal state
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null)

  const [attendanceRecords, setAttendanceRecords] =
    useState<ManagerAttendanceRecord[]>([])

  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [attendanceError, setAttendanceError] = useState("")
  const [attendanceFromDate, setAttendanceFromDate] = useState("")
  const [attendanceToDate, setAttendanceToDate] = useState("")

  // Get the logged-in employee ID
  const getStoredEmployeeId = () => {
    return (
      localStorage.getItem("employeeId") ||
      sessionStorage.getItem("employeeId") ||
      ""
    )
  }

  // Fetch the manager's team
  const fetchTeam = async (showRefresh = false) => {
    const employeeId = getStoredEmployeeId()

    if (!employeeId) {
      setError("Employee ID not found. Please log in again.")
      setLoading(false)
      return
    }

    setManagerId(employeeId)
    setError("")

    if (showRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const data = await getEmployeeTeam(employeeId)
      setEmployees(data.employees || [])
    } catch (err) {
      console.error("Failed to load team:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employees."
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial team load
  useEffect(() => {
    void fetchTeam()
  }, [])

  // Get unique departments
  const departments = useMemo<string[]>(() => {
    const uniqueDepartments = Array.from(
      new Set(
        employees
          .map((employee) => employee.department)
          .filter(
            (value): value is string => Boolean(value)
          )
      )
    )

    return ["All", ...uniqueDepartments]
  }, [employees])

  // Search and department filtering
  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase().trim()

    return employees.filter((employee) => {
      const matchesSearch =
        !searchValue ||
        employee.name?.toLowerCase().includes(searchValue) ||
        employee.employee_id?.toLowerCase().includes(searchValue) ||
        employee.email?.toLowerCase().includes(searchValue) ||
        employee.job_title?.toLowerCase().includes(searchValue) ||
        employee.designation?.toLowerCase().includes(searchValue)

      const matchesDepartment =
        department === "All" ||
        employee.department === department

      return matchesSearch && matchesDepartment
    })
  }, [employees, search, department])

  // Format dates without shifting the date due to timezone
  const formatDate = (value: string | null) => {
    if (!value) return "—"

    const [year, month, day] = value.split("-").map(Number)

    if (!year || !month || !day) return value

    return new Date(year, month - 1, day).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )
  }

  // Format time
  const formatTime = (value: string | null) => {
    if (!value) return "—"

    const parts = value.split(":")
    const hours = Number(parts[0])
    const minutes = Number(parts[1])

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return value
    }

    const date = new Date()
    date.setHours(hours, minutes, 0, 0)

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Generate employee initials
  const getInitials = (name: string) => {
    if (!name) return "?"

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
  }

  // Fetch manager attendance and select one employee's records
  const handleViewAttendance = async (employee: Employee) => {
    setSelectedEmployee(employee)
    setAttendanceRecords([])
    setAttendanceError("")
    setAttendanceFromDate("")
    setAttendanceToDate("")

    const storedManagerId = getStoredEmployeeId()

    if (!storedManagerId) {
      setAttendanceError(
        "Manager ID not found. Please log in again."
      )
      return
    }

    const selectedEmployeeId = employee.employee_id

    if (!selectedEmployeeId) {
      setAttendanceError("Employee ID is missing.")
      return
    }

    setAttendanceLoading(true)

    try {
      const url =
        `${API_BASE_URL}attendance/manager/` +
        encodeURIComponent(storedManagerId)

      const response = await fetch(url)

      const data: ManagerAttendanceResponse =
        await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          "Unable to load attendance history."
        )
      }

      // Only show attendance belonging to the selected employee.
      const records = (data.attendance || [])
        .filter(
          (record) =>
            record.employeeId === selectedEmployeeId
        )
        .sort((a, b) => b.date.localeCompare(a.date))

      setAttendanceRecords(records)
    } catch (err) {
      console.error("Failed to load attendance:", err)

      setAttendanceError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading attendance."
      )
    } finally {
      setAttendanceLoading(false)
    }
  }

  // Filter the selected employee's attendance by date range
  const filteredAttendance = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const matchesFromDate =
        !attendanceFromDate ||
        record.date >= attendanceFromDate

      const matchesToDate =
        !attendanceToDate ||
        record.date <= attendanceToDate

      return matchesFromDate && matchesToDate
    })
  }, [
    attendanceRecords,
    attendanceFromDate,
    attendanceToDate,
  ])

  // Close the attendance modal
  const closeAttendance = () => {
    setSelectedEmployee(null)
    setAttendanceRecords([])
    setAttendanceError("")
    setAttendanceFromDate("")
    setAttendanceToDate("")
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={38}
              className="mx-auto animate-spin text-blue-600"
            />
            <p className="mt-4 text-sm text-gray-500">
              Loading your team...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
              <Users size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Employees
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and view employees reporting to you
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchTeam(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Team loading error */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void fetchTeam(true)}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Team Members
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {employees.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Users size={23} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Active Employees
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {
                  employees.filter(
                    (employee) =>
                      employee.status?.toLowerCase() === "active"
                  ).length
                }
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <UserRound size={23} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Manager ID</p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                {managerId || "—"}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <BriefcaseBusiness
                size={23}
                className="text-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search and department filters */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, employee ID, email or designation..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <select
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white md:w-52"
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee list */}
      {employees.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <Users
            size={30}
            className="mx-auto text-blue-600"
          />
          <h3 className="mt-5 text-lg font-semibold text-gray-900">
            No employees found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            There are currently no employees reporting to you.
          </p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <Search
            size={30}
            className="mx-auto text-gray-400"
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No matching employees
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or department filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Team Members
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Showing {filteredEmployees.length} of{" "}
                {employees.length} employees
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    "Employee",
                    "Contact",
                    "Job Details",
                    "Department",
                    "Date of Joining",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((employee, index) => (
                  <tr
                    key={
                      employee.employee_id ||
                      `${employee.name}-${index}`
                    }
                    className="transition hover:bg-gray-50/70"
                  >
                    {/* Employee */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                          {getInitials(employee.name)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {employee.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {employee.employee_id ||
                              "Employee ID not assigned"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        {employee.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail
                              size={14}
                              className="shrink-0 text-gray-400"
                            />
                            <span>{employee.email}</span>
                          </div>
                        )}

                        {employee.contact_details && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone
                              size={14}
                              className="shrink-0 text-gray-400"
                            />
                            <span>
                              {employee.contact_details}
                            </span>
                          </div>
                        )}

                        {!employee.email &&
                          !employee.contact_details && (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}
                      </div>
                    </td>

                    {/* Job details */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {employee.job_title || "—"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {employee.designation || "—"}
                      </p>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Building2
                          size={15}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {employee.department || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Date of joining */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="text-gray-400"
                        />
                        <span className="text-sm text-gray-700">
                          {formatDate(employee.doj)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          employee.status?.toLowerCase() === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            employee.status?.toLowerCase() === "active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                        {employee.status || "Unknown"}
                      </span>
                    </td>

                    {/* View attendance */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          void handleViewAttendance(employee)
                        }
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                      >
                        <Eye size={16} />
                        View Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected employee attendance modal */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeAttendance()
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Clock3
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Attendance History
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedEmployee.name} ·{" "}
                    {selectedEmployee.employee_id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAttendance}
                aria-label="Close attendance history"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5 sm:p-6">
              {/* Date filters */}
              <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-800">
                  Filter by date range
                </h3>

                <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="attendance-from-date"
                      className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                      From Date
                    </label>
                    <input
                      id="attendance-from-date"
                      type="date"
                      value={attendanceFromDate}
                      max={attendanceToDate || undefined}
                      onChange={(event) =>
                        setAttendanceFromDate(
                          event.target.value
                        )
                      }
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="attendance-to-date"
                      className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                      To Date
                    </label>
                    <input
                      id="attendance-to-date"
                      type="date"
                      value={attendanceToDate}
                      min={attendanceFromDate || undefined}
                      onChange={(event) =>
                        setAttendanceToDate(
                          event.target.value
                        )
                      }
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAttendanceFromDate("")
                      setAttendanceToDate("")
                    }}
                    className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Clear Dates
                  </button>
                </div>
              </div>

              {/* Loading state */}
              {attendanceLoading ? (
                <div className="flex flex-col items-center justify-center py-14">
                  <Loader2
                    size={32}
                    className="animate-spin text-blue-600"
                  />
                  <p className="mt-3 text-sm text-gray-500">
                    Loading attendance history...
                  </p>
                </div>
              ) : attendanceError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p>{attendanceError}</p>
                  <button
                    type="button"
                    onClick={() =>
                      void handleViewAttendance(
                        selectedEmployee
                      )
                    }
                    className="mt-2 font-semibold underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  {/* Attendance count */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Attendance Records
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {filteredAttendance.length} record(s) found
                      </p>
                    </div>
                  </div>

                  {/* Empty state */}
                  {filteredAttendance.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
                      <CalendarDays
                        size={36}
                        className="mx-auto text-gray-300"
                      />
                      <p className="mt-3 font-medium text-gray-800">
                        No attendance records found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        This employee has no records for the selected dates.
                      </p>
                    </div>
                  ) : (
                    /* Attendance table */
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full min-w-[720px]">
                        <thead className="bg-slate-50">
                          <tr>
                            {[
                              "Date",
                              "Check In",
                              "Check Out",
                              "Working Hours",
                              "Status",
                            ].map((heading) => (
                              <th
                                key={heading}
                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {filteredAttendance.map(
                            (record, index) => (
                              <tr
                                key={`${record.employeeId}-${record.date}-${index}`}
                                className="transition hover:bg-blue-50/40"
                              >
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                                  {formatDate(record.date)}
                                </td>

                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                  {formatTime(record.checkIn)}
                                </td>

                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                  {formatTime(record.checkOut)}
                                </td>

                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                  {record.totalWorkingHours || "—"}
                                </td>

                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                      record.status?.toLowerCase() === "present"
                                        ? "bg-green-50 text-green-700"
                                        : record.status?.toLowerCase() === "absent"
                                          ? "bg-red-50 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {record.status || "Unknown"}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees