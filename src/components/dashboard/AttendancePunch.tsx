import { useCallback, useEffect, useState } from "react"
import {
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { API_BASE_URL } from "../../config/api"

interface AttendanceRecord {
  employeeId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  totalWorkingHours: string | null
  status: string
}

interface AttendanceResponse {
  success: boolean
  message?: string
  attendance?: AttendanceRecord | null
}

const getAuthStorage = () => {
  if (localStorage.getItem("employeeId")) return localStorage
  if (sessionStorage.getItem("employeeId")) return sessionStorage
  return null
}

const formatTime = (time: string | null | undefined) => {
  if (!time) return "--:--"

  const [hoursText, minutesText] = time.split(":")
  const hours = Number(hoursText)
  const minutes = Number(minutesText)

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return time
  }

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

function AttendancePunch() {
  const [employeeId, setEmployeeId] = useState("")
  const [attendance, setAttendance] =
    useState<AttendanceRecord | null>(null)

  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<
    "check-in" | "check-out" | null
  >(null)

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Fetch today's attendance from the backend.
  const fetchTodayAttendance = useCallback(
    async (id: string, showErrors = true) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}attendance/today/${encodeURIComponent(id)}`
        )

        const data: AttendanceResponse = await response.json()

        if (!response.ok) {
          // A 404 can mean no attendance has been recorded today.
          if (response.status === 404) {
            setAttendance(null)
            return null
          }

          throw new Error(
            data.message || "Unable to fetch today's attendance."
          )
        }

        if (data.success && data.attendance) {
          // Never display another employee's attendance.
          if (data.attendance.employeeId !== id) {
            throw new Error(
              "The attendance response does not match the logged-in employee."
            )
          }

          setAttendance(data.attendance)

          const storage = getAuthStorage()
          storage?.setItem(
            'attendance_${id}',
            JSON.stringify(data.attendance)
          )

          return data.attendance
        }

        // Handle an API response indicating no record exists.
        if (
          !data.attendance &&
          /no attendance|attendance not found|no record/i.test(
            data.message || ""
          )
        ) {
          setAttendance(null)
          return null
        }

        throw new Error(
          data.message || "Unable to fetch today's attendance."
        )
      } catch (err) {
        if (showErrors) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to fetch today's attendance."
          )
        }

        return null
      }
    },
    []
  )

  // Load the logged-in employee's attendance when the card mounts.
  useEffect(() => {
    let cancelled = false

    const loadAttendance = async () => {
      const storage = getAuthStorage()
      const id = storage?.getItem("employeeId") || ""

      if (!id) {
        setError("Please log in again to record attendance.")
        setInitializing(false)
        return
      }

      setEmployeeId(id)

      // Show cached data while the API request is running.
      const cached = storage?.getItem('attendance_${id}')

      if (cached) {
        try {
          const parsed: AttendanceRecord = JSON.parse(cached)

          if (parsed.employeeId === id) {
            setAttendance(parsed)
          }
        } catch {
          storage?.removeItem('attendance_${id}')
        }
      }

      await fetchTodayAttendance(id)

      if (!cancelled) {
        setInitializing(false)
      }
    }

    loadAttendance()

    return () => {
      cancelled = true
    }
  }, [fetchTodayAttendance])

  const handleAttendanceAction = async (
    type: "check-in" | "check-out"
  ) => {
    if (loading || initializing) return

    const storage = getAuthStorage()
    const id = storage?.getItem("employeeId") || ""

    if (!id) {
      setError("Employee ID not found. Please log in again.")
      return
    }

    if (type === "check-in" && attendance?.checkIn) return

    if (
      type === "check-out" &&
      (!attendance?.checkIn || attendance?.checkOut)
    ) {
      return
    }

    setError("")
    setSuccessMessage("")
    setLoading(true)
    setAction(type)

    try {
      const response = await fetch(
        `${API_BASE_URL}attendance/${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId: id }),
        }
      )

      const data: AttendanceResponse = await response.json()

      if (!response.ok || !data.success) {
        // If the server says the employee already checked in,
        // refresh the actual attendance instead of relying on cache.
        if (
          type === "check-in" &&
          /already checked in/i.test(data.message || "")
        ) {
          await fetchTodayAttendance(id, false)
          setSuccessMessage(
            "You have already checked in today. Your attendance has been refreshed."
          )
          return
        }

        throw new Error(
          data.message ||
          'Unable to ${type === "check-in" ? "check in" : "check out"}.'
        )
      }

      if (!data.attendance) {
        throw new Error(
          "The server did not return attendance details."
        )
      }

      if (data.attendance.employeeId !== id) {
        throw new Error(
          "The returned attendance does not match the logged-in employee."
        )
      }

      setAttendance(data.attendance)

      storage?.setItem(
        `attendance_${id}`,
        JSON.stringify(data.attendance)
      )

      setSuccessMessage(
        data.message ||
        (type === "check-in"
          ? "Check-in successful!"
          : "Check-out successful!")
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
      setAction(null)
    }
  }

  const isCheckedIn = Boolean(attendance?.checkIn)
  const isCheckedOut = Boolean(attendance?.checkOut)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800">
          <Clock size={19} className="text-blue-600" />
          Attendance
        </h3>
        <span className="text-sm text-gray-500">Today</span>
      </div>

      {employeeId && (
        <p className="mb-4 text-xs text-gray-500">
          Employee ID:{" "}
          <span className="font-semibold text-gray-700">
            {employeeId}
          </span>
        </p>
      )}

      <div className="mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-green-50 p-3">
          <p className="mb-1 text-xs text-gray-500">Punch In</p>
          <p className="text-sm font-semibold text-green-700">
            {formatTime(attendance?.checkIn)}
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-3">
          <p className="mb-1 text-xs text-gray-500">Punch Out</p>
          <p className="text-sm font-semibold text-red-700">
            {formatTime(attendance?.checkOut)}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3">
          <p className="mb-1 text-xs text-gray-500">Worked</p>
          <p className="text-sm font-semibold text-blue-700">
            {attendance?.totalWorkingHours ?? "--:--:--"}
          </p>
        </div>
      </div>

      <div className="mb-4">
        {isCheckedOut ? (
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 size={17} />
            Attendance completed for today.
          </div>
        ) : isCheckedIn ? (
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 size={17} />
            Checked in — have a productive day!
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            You haven't checked in yet.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleAttendanceAction("check-in")}
          disabled={
            initializing ||
            loading ||
            !employeeId ||
            isCheckedIn
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading && action === "check-in" ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Checking in...
            </>
          ) : isCheckedIn ? (
            "Checked In"
          ) : (
            "Punch In"
          )}
        </button>

        <button
          type="button"
          onClick={() => handleAttendanceAction("check-out")}
          disabled={
            initializing ||
            loading ||
            !employeeId ||
            !isCheckedIn ||
            isCheckedOut
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading && action === "check-out" ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Checking out...
            </>
          ) : isCheckedOut ? (
            "Checked Out"
          ) : (
            "Punch Out"
          )}
        </button>
      </div>
    </div>
  )
}

export default AttendancePunch