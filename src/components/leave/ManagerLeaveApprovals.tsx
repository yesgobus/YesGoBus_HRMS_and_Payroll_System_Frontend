
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  X,
  RefreshCw,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  UserRound,
} from "lucide-react";

import { API_BASE_URL } from "../../config/api";

interface PendingLeave {
  id: number;
  employee_id: string;
  name: string;
  department: string;
  designation: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  applied_at: string;
}

interface PendingLeaveResponse {
  success: boolean;
  managerId: string;
  count: number;
  leaves: PendingLeave[];
  message?: string;
}

interface StatusResponse {
  success: boolean;
  message: string;
}

interface Props {
  onProcessed?: () => void;
}

function getStoredValue(key: string): string | null {
  return (
    localStorage.getItem(key) ||
    sessionStorage.getItem(key)
  );
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";

  const datePart = dateString.split(" ")[0];
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return dateString;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate.split(" ")[0]}T00:00:00`);
  const end = new Date(`${endDate.split(" ")[0]}T00:00:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return 0;
  }

  return Math.floor(
    (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  ) + 1;
}

function getLeaveType(type: string): string {
  const types: Record<string, string> = {
    CL: "Casual Leave",
    SL: "Sick Leave",
    EL: "Earned Leave",
  };

  return types[type?.toUpperCase()] || type;
}

export default function ManagerLeaveApprovals({
  onProcessed,
}: Props) {
  const [leaves, setLeaves] = useState<PendingLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // FETCH PENDING LEAVES
  const fetchPendingLeaves = useCallback(
    async (showRefresh = false) => {
      const managerId = getStoredValue("employeeId");

      if (!managerId) {
        setError("Manager ID not found. Please log in again.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}leave/manager/${encodeURIComponent(
            managerId
          )}/pending`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data: PendingLeaveResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch pending leave requests."
          );
        }

        setLeaves(Array.isArray(data.leaves) ? data.leaves : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to fetch pending requests."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchPendingLeaves();
  }, [fetchPendingLeaves]);

  // APPROVE / REJECT
  const handleDecision = async (
    leave: PendingLeave,
    status: "Approved" | "Rejected"
  ) => {
    const managerId = getStoredValue("employeeId");

    if (!managerId) {
      setError("Manager ID not found. Please log in again.");
      return;
    }

    const action = status === "Approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${leave.name}'s leave request?`
    );

    if (!confirmed) return;

    setProcessingId(leave.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}leave/status/${leave.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status,
            managerId,
          }),
        }
      );

      const data: StatusResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Unable to ${action} leave request.`
        );
      }

      setLeaves((previous) =>
        previous.filter((item) => item.id !== leave.id)
      );

      setExpandedId(null);
      setMessage(data.message);

      onProcessed?.();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      void fetchPendingLeaves(true);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* HEADER */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ClipboardList size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Leave Approvals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review your team's pending leave requests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
            {leaves.length} Pending
          </span>

          <button
            type="button"
            onClick={() => void fetchPendingLeaves(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="mt-3 text-sm text-gray-500">
              Loading pending requests...
            </p>
          </div>
        ) : leaves.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Check size={26} />
            </div>

            <h3 className="mt-3 font-semibold text-gray-900">
              All caught up!
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              There are no pending leave requests.
            </p>
          </div>
        ) : (
          /* COMPACT REQUEST LIST */
          <div className="divide-y divide-gray-100">

            {leaves.map((leave) => {
              const isExpanded = expandedId === leave.id;
              const isProcessing = processingId === leave.id;

              return (
                <div key={leave.id} className="py-2">

                  {/* COMPACT ROW */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(
                        isExpanded ? null : leave.id
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      isExpanded
                        ? "bg-indigo-50/70"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* AVATAR */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <UserRound size={19} />
                    </div>

                    {/* NAME AND DETAILS */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {leave.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {leave.employee_id} · {getLeaveType(leave.leave_type)}
                      </p>
                    </div>

                    {/* DATE */}
                    <div className="hidden text-right sm:block">
                      <p className="text-xs font-medium text-gray-700">
                        {formatDate(leave.start_date)}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {calculateDays(leave.start_date, leave.end_date)} days
                      </p>
                    </div>

                    {/* STATUS */}
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      Pending
                    </span>

                    {isExpanded ? (
                      <ChevronUp size={18} className="shrink-0 text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="shrink-0 text-gray-500" />
                    )}
                  </button>

                  {/* EXPANDED DETAILS */}
                  {isExpanded && (
                    <div className="ml-2 mr-2 mt-2 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:ml-14">

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>
                          <p className="text-xs text-gray-400">
                            Employee ID
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {leave.employee_id}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Department / Designation
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {leave.department} · {leave.designation}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Leave Type
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {getLeaveType(leave.leave_type)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Duration
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {calculateDays(leave.start_date, leave.end_date)} days
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Start Date
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                            <CalendarDays size={15} className="text-indigo-500" />
                            {formatDate(leave.start_date)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            End Date
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">
                            <CalendarDays size={15} className="text-indigo-500" />
                            {formatDate(leave.end_date)}
                          </p>
                        </div>

                      </div>

                      {/* REASON */}
                      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Reason for leave
                        </p>
                        <p className="mt-2 break-words text-sm text-gray-700">
                          {leave.reason || "No reason provided"}
                        </p>
                      </div>

                      {/* APPLIED DATE */}
                      <p className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={14} />
                        Applied on {formatDate(leave.applied_at)}
                      </p>

                      {/* ACTION BUTTONS */}
                      <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row">

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            void handleDecision(leave, "Approved")
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Check size={17} />
                          )}
                          Approve Leave
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            void handleDecision(leave, "Rejected")
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <X size={17} />
                          Reject Leave
                        </button>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
      </div>
    </section>
  );
}
