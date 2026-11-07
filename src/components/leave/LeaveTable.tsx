import { useCallback, useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

interface LeaveRecord {
  id: number;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  applied_at: string;
}

interface LeaveHistoryResponse {
  success: boolean;
  count: number;
  leaves: LeaveRecord[];
  message?: string;
}

interface LeaveTableProps {
  refreshKey?: number;
}

function getStoredEmployeeId(): string | null {
  return (
    localStorage.getItem("employeeId") ||
    sessionStorage.getItem("employeeId")
  );
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";

  // Handle YYYY-MM-DD without timezone conversion.
  const datePart = dateString.split(" ")[0];
  const parts = datePart.split("-");

  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateLeaveDays(
  startDate: string,
  endDate: string
): number {
  if (!startDate || !endDate) return 0

  const start = new Date(startDate.split(" ")[0] + "T00:00:00")
  const end = new Date(endDate.split(" ")[0] + "T00:00:00")

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return 0
  }

  const difference = end.getTime() - start.getTime()

  return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1
}

function getLeaveTypeLabel(type: string): string {
  const leaveTypes: Record<string, string> = {
    CL: "Casual Leave",
    SL: "Sick Leave",
    EL: "Earned Leave",
  };

  return leaveTypes[type?.toUpperCase()] || type || "—";
}

function getStatusClasses(status: string): string {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "pending":
      return "bg-amber-100 text-amber-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function LeaveTable({
  refreshKey = 0,
}: LeaveTableProps) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaveHistory = useCallback(
    async (showRefreshIndicator = false) => {
      const employeeId = getStoredEmployeeId();

      if (!employeeId) {
        setLeaves([]);
        setError(
          "Employee ID not found. Please log in again to view your leave history."
        );
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}leave/history/${encodeURIComponent(
            employeeId
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data: LeaveHistoryResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch leave history."
          );
        }

        setLeaves(Array.isArray(data.leaves) ? data.leaves : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while fetching leave history."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchLeaveHistory();
  }, [fetchLeaveHistory, refreshKey]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Leave History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View your previous and current leave applications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchLeaveHistory(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            size={15}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading leave history...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <CalendarDays size={23} />
          </div>

          <p className="mt-4 font-medium text-gray-900">
            Unable to load leave history
          </p>

          <p className="mt-2 max-w-md text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void fetchLeaveHistory(true)}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      ) : leaves.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <CalendarDays size={26} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-900">
            No leave applications yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Your leave applications will appear here once you apply.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-5 py-3">
            <p className="text-sm text-gray-500">
              Total applications
            </p>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              {leaves.length}
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="border-y border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Leave Type
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Start Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    End Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Days Taken
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reason
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Applied On
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap text-sm font-medium text-gray-900">
                        {getLeaveTypeLabel(leave.leave_type)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {formatDate(leave.start_date)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {formatDate(leave.end_date)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                        {calculateLeaveDays(leave.start_date, leave.end_date)} Days
                      </span>
                    </td>

                    <td className="max-w-[220px] px-5 py-4 text-sm text-gray-600">
                      <span
                        className="block truncate"
                        title={leave.reason}
                      >
                        {leave.reason || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          leave.status
                        )}`}
                      >
                        {leave.status || "Unknown"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {formatDate(leave.applied_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}