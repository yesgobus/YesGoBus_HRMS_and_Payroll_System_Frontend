import { useCallback, useEffect, useState } from "react"
import * as XLSX from "xlsx"
import {
  CalendarDays,
  CalendarRange,
  Clock3,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import { API_BASE_URL } from "../config/api"

type FilterMode = "all" | "date" | "range"

interface AttendanceRecord {
  employeeId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  totalWorkingHours: string | null
  status: string
}

interface Pagination {
  page: number
  limit: number
  totalRecords: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface HistoryResponse {
  success: boolean
  message?: string
  employeeId: string
  filters?: {
    date: string | null
    fromDate: string | null
    toDate: string | null
  }
  pagination: Pagination
  count: number
  attendance: AttendanceRecord[]
}

interface EmployeeDetails {
  name?: string
  department?: string | null
  designation?: string | null
  job_title?: string | null
  employee_id?: string
}

interface HistoryFilters {
  mode: FilterMode
  date: string
  fromDate: string
  toDate: string
}

const PAGE_SIZE = 20

const getAuthStorage = () => {
  if (localStorage.getItem("employeeId")) return localStorage
  if (sessionStorage.getItem("employeeId")) return sessionStorage
  return null
}

const formatDate = (value: string) => {
  if (!value) return "--"

  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) return value

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const formatTime = (value: string | null) => {
  if (!value) return "--"

  const [hoursText, minutesText] = value.split(":")
  const hours = Number(hoursText)
  const minutes = Number(minutesText)

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

function Attendance() {
  const [employeeId, setEmployeeId] = useState("")
  const [employeeName, setEmployeeName] = useState("Employee")
  const [department, setDepartment] = useState("")

  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [date, setDate] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  const loadAttendance = useCallback(
    async (
      id: string,
      filters: HistoryFilters,
    ) => {
      setLoading(true)
      setError("")

      try {
        const employeeId =
          localStorage.getItem("employeeId") ||
          sessionStorage.getItem("employeeId");

        if (!employeeId) {
          throw new Error("Employee ID not found. Please log in again.");
        }

        const params = new URLSearchParams();

        if (filters.mode === "date") {
          // Single date filter
          params.set("date", filters.date);
        } else if (filters.mode === "range") {
          // Between two dates
          params.set("fromDate", filters.fromDate);
          params.set("toDate", filters.toDate);
        }

        const queryString = params.toString();

        const url = `${API_BASE_URL}attendance/history/${encodeURIComponent(
          employeeId
        )}${queryString ? `?${queryString}` : ""}`;

        console.log("Attendance API URL:", url);

        const response = await fetch(url);
        const data: HistoryResponse = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch attendance history."
          )
        }

        // Do not display another employee's records.
        if (data.employeeId !== id) {
          throw new Error(
            "The attendance history does not match the logged-in employee."
          )
        }

        setRecords(data.attendance || [])
        setPagination(
          data.pagination || {
            page: 1,
            limit: PAGE_SIZE,
            totalRecords: data.count || 0,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        )
      } catch (err) {
        setRecords([])
        setPagination({
          page: 1,
          limit: PAGE_SIZE,
          totalRecords: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        })

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading attendance."
        )
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Load the logged-in employee and their complete history.
  useEffect(() => {
    const storage = getAuthStorage()
    const id = storage?.getItem("employeeId") || ""

    if (!id) {
      setError("Please log in to view your attendance history.")
      setInitializing(false)
      return
    }

    setEmployeeId(id)

    const employeeData =
      storage?.getItem("employee") || null

    if (employeeData) {
      try {
        const employee: EmployeeDetails = JSON.parse(employeeData)

        setEmployeeName(employee.name || "Employee")
        setDepartment(employee.department || "")
      } catch {
        setEmployeeName("Employee")
      }
    }

    loadAttendance(
      id,
      {
        mode: "all",
        date: "",
        fromDate: "",
        toDate: "",
      },
    ).finally(() => setInitializing(false))
  }, [loadAttendance])

  const currentFilters: HistoryFilters = {
    mode: filterMode,
    date,
    fromDate,
    toDate,
  }

  const handleApplyFilters = () => {
    if (!employeeId) {
      setError("Employee ID not found. Please log in again.")
      return
    }

    if (filterMode === "date" && !date) {
      setError("Please select a date.")
      return
    }

    if (filterMode === "range") {
      if (!fromDate || !toDate) {
        setError("Please select both From Date and To Date.")
        return
      }

      if (fromDate > toDate) {
        setError("From Date cannot be later than To Date.")
        return
      }
    }

    loadAttendance(employeeId, currentFilters)
  }

  const handleClearFilters = () => {
    setFilterMode("all")
    setDate("")
    setFromDate("")
    setToDate("")
    setSearch("")

    if (employeeId) {
      loadAttendance(
        employeeId,
        {
          mode: "all",
          date: "",
          fromDate: "",
          toDate: "",
        },
      )
    }
  }

  // const handlePageChange = (nextPage: number) => {
  //   if (!employeeId || loading) return

  //   loadAttendance(employeeId, currentFilters)
  // }

  const filteredRecords = records.filter((record) => {
    const query = search.trim().toLowerCase()

    if (!query) return true

    return (
      record.date.toLowerCase().includes(query) ||
      record.status.toLowerCase().includes(query) ||
      record.employeeId.toLowerCase().includes(query)
    )
  })

  const presentCount = records.filter(
    (record) => record.status.toLowerCase() === "present"
  ).length

  const completedCount = records.filter(
    (record) => Boolean(record.checkOut)
  ).length

  const inProgressCount = records.filter(
    (record) => Boolean(record.checkIn) && !record.checkOut
  ).length

  const handleExportExcel = () => {
    if (filteredRecords.length === 0) {
      window.alert("No attendance records available to export.")
      return
    }

    const excelData = filteredRecords.map((record) => ({
      Date: record.date,
      "Employee ID": record.employeeId,
      "Employee Name": employeeName,
      Department: department,
      "Punch In": record.checkIn || "--",
      "Punch Out": record.checkOut || "--",
      "Working Hours": record.totalWorkingHours || "--",
      Status: record.status,
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance History"
    )

    XLSX.writeFile(
      workbook,
      `Attendance_History_${employeeId}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    )
  }

  const getFilterDescription = () => {
    if (filterMode === "date" && date) {
      return `Attendance for ${formatDate(date)}`
    }

    if (filterMode === "range" && fromDate && toDate) {
      return `${formatDate(fromDate)} – ${formatDate(toDate)}`
    }

    return "All available attendance records"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Clock3 size={24} className="text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Attendance History
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View your attendance records by date.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportExcel}
          disabled={loading || filteredRecords.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <FileSpreadsheet size={18} />
          Export Excel
        </button>
      </div>

      {/* Employee information */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {employeeName
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || "E"}
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              {employeeName}
            </p>
            <p className="mt-0.5 text-sm text-gray-600">
              {employeeId}
              {department ? ` · ${department}` : ""}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {getFilterDescription()}
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Records"
          value={pagination.totalRecords}
          icon={<CalendarDays size={21} />}
          color="blue"
        />

        <SummaryCard
          title="Present Records"
          value={presentCount}
          icon={<UserCheck size={21} />}
          color="green"
        />

        <SummaryCard
          title="Checked Out"
          value={completedCount}
          icon={<CheckCircle2 size={21} />}
          color="indigo"
        />

        <SummaryCard
          title="In Progress"
          value={inProgressCount}
          icon={<Clock3 size={21} />}
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-800">
            Filter Attendance
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Select which attendance records you want to view.
          </p>
        </div>

        {/* Filter mode */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FilterOption
            active={filterMode === "all"}
            icon={<CalendarDays size={19} />}
            title="All History"
            description="Every available record"
            onClick={() => setFilterMode("all")}
          />

          <FilterOption
            active={filterMode === "date"}
            icon={<Search size={19} />}
            title="Single Date"
            description="One specific day"
            onClick={() => setFilterMode("date")}
          />

          <FilterOption
            active={filterMode === "range"}
            icon={<CalendarRange size={19} />}
            title="Date Range"
            description="Between two dates"
            onClick={() => setFilterMode("range")}
          />
        </div>

        {filterMode === "date" && (
          <div className="max-w-sm">
            <label
              htmlFor="attendance-date"
              className="mb-2 block text-xs font-medium text-gray-600"
            >
              Select Date
            </label>

            <input
              id="attendance-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        )}

        {filterMode === "range" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="attendance-from-date"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                From Date
              </label>

              <input
                id="attendance-from-date"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="attendance-to-date"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                To Date
              </label>

              <input
                id="attendance-to-date"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => setToDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Clear Filters
          </button>

          <button
            type="button"
            onClick={handleApplyFilters}
            disabled={loading || initializing || !employeeId}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Search size={17} />
            )}
            View Attendance
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Results */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">
              Attendance Records
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {pagination.totalRecords} records found
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search date or status..."
              className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {initializing || loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <p className="mt-3 text-sm text-gray-500">
              Loading attendance records...
            </p>
          </div>
        ) : error && records.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle
              size={38}
              className="mx-auto mb-3 text-red-300"
            />
            <p className="font-medium text-gray-700">
              Unable to load attendance
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Check your connection and try again.
            </p>

            <button
              type="button"
              onClick={() =>
                employeeId &&
                loadAttendance(employeeId, currentFilters)
              }
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays
              size={42}
              className="mx-auto mb-3 text-gray-300"
            />
            <p className="font-medium text-gray-700">
              No attendance records found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try another date, date range, or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="border-b border-gray-200 bg-slate-50">
                <tr>
                  {[
                    "Date",
                    "Punch In",
                    "Punch Out",
                    "Working Hours",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr
                    key={`${record.employeeId}-${record.date}-${index}`}
                    className="border-b border-gray-100 transition last:border-b-0 hover:bg-blue-50/40"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">
                      {formatDate(record.date)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatTime(record.checkIn)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatTime(record.checkOut)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {record.totalWorkingHours || "--"}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalRecords > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of{" "}
              {Math.max(pagination.totalPages, 1)}
              {" · "}
              {pagination.totalRecords} total records
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                // onClick={() =>
                //   handlePageChange(pagination.page - 1)
                // }
                disabled={!pagination.hasPreviousPage || loading}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                // onClick={() =>
                //   handlePageChange(pagination.page + 1)
                // }
                disabled={!pagination.hasNextPage || loading}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface SummaryCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: "blue" | "green" | "indigo" | "orange"
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: SummaryCardProps) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    indigo: "bg-indigo-100 text-indigo-600",
    orange: "bg-orange-100 text-orange-600",
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

interface FilterOptionProps {
  active: boolean
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

function FilterOption({
  active,
  icon,
  title,
  description,
  onClick,
}: FilterOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${active
        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
        : "border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50"
        }`}
    >
      <span
        className={`mt-0.5 ${active ? "text-blue-600" : "text-gray-400"
          }`}
      >
        {icon}
      </span>

      <span>
        <span className="block text-sm font-semibold text-gray-800">
          {title}
        </span>
        <span className="mt-1 block text-xs text-gray-500">
          {description}
        </span>
      </span>
    </button>
  )
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase()

  let styles = "bg-gray-100 text-gray-700"

  if (normalizedStatus === "present") {
    styles = "bg-green-100 text-green-700"
  } else if (normalizedStatus === "late") {
    styles = "bg-orange-100 text-orange-700"
  } else if (normalizedStatus === "absent") {
    styles = "bg-red-100 text-red-700"
  } else if (normalizedStatus === "half day") {
    styles = "bg-purple-100 text-purple-700"
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {status || "Unknown"}
    </span>
  )
}

export default Attendance