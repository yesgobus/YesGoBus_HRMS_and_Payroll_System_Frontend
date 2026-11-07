import { useState } from "react";
import DatePicker from "react-datepicker";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ApplyLeaveResponse {
  success: boolean;
  message?: string;
  leaveId?: number;
  emailSent?: boolean;
  sentTo?: string[];
  failedFor?: string[];
}

const leaveTypes = [
  { label: "Casual Leave", value: "CL", balance: 5 },
  { label: "Sick Leave", value: "SL", balance: 3 },
  { label: "Earned Leave", value: "EL", balance: 8 },
];

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStoredEmployeeId(): string {
  return (
    localStorage.getItem("employeeId") ||
    sessionStorage.getItem("employeeId") ||
    ""
  ).trim();
}

function ApplyLeaveModal({ open, onClose, onSuccess }: Props) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] =
    useState<ApplyLeaveResponse | null>(null);

  if (!open) return null;

  const selectedLeaveType = leaveTypes.find(
    (item) => item.value === leaveType
  );

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    ).getTime();

    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    ).getTime();

    return Math.round((end - start) / 86400000) + 1;
  };

  const duration = calculateDuration();
  const balance = selectedLeaveType?.balance ?? 0;
  const lopDays = Math.max(duration - balance, 0);
  const paidDays = Math.min(duration, balance);

  const resetForm = () => {
    setLeaveType("");
    setStartDate(null);
    setEndDate(null);
    setReason("");
    setError("");
    setSuccessData(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const employeeId = getStoredEmployeeId();

    if (!employeeId) {
      setError(
        "Employee ID not found. Please log out and log in again."
      );
      return;
    }

    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (endDate < startDate) {
      setError("End date cannot be before the start date.");
      return;
    }

    const payload = {
      employeeId,
      leaveType,
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
      reason: reason.trim(),
    };

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}leave/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: ApplyLeaveResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your leave application."
        );
      }

      setSuccessData(data);
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <ClipboardList size={23} />

            <div>
              <h2 className="text-lg font-semibold">Apply Leave</h2>
              <p className="mt-0.5 text-xs text-blue-100">
                Submit your leave request
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close leave form"
            className="rounded-lg p-2 transition hover:bg-white/15 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {successData ? (
          /* Success state */
          <div className="p-6">
            <div className="flex flex-col items-center py-3 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={36} className="text-green-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                Leave Applied Successfully!
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {successData.message ||
                  "Your leave request has been submitted."}
              </p>

              {successData.leaveId !== undefined && (
                <div className="mt-4 rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600">
                  Leave Request ID:{" "}
                  <span className="font-semibold text-gray-800">
                    {successData.leaveId}
                  </span>
                </div>
              )}
            </div>

            {successData.emailSent !== undefined && (
              <div
                className={`mt-4 rounded-xl border p-4 ${
                  successData.emailSent
                    ? "border-green-200 bg-green-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail
                    size={18}
                    className={
                      successData.emailSent
                        ? "text-green-700"
                        : "text-amber-700"
                    }
                  />

                  <p className="text-sm font-semibold text-gray-800">
                    {successData.emailSent
                      ? "Notification emails accepted"
                      : "Email notification not confirmed"}
                  </p>
                </div>

                {successData.sentTo &&
                  successData.sentTo.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-500">
                        Notifications sent to:
                      </p>

                      {successData.sentTo.map((email) => (
                        <p
                          key={email}
                          className="break-all text-sm text-gray-700"
                        >
                          {email}
                        </p>
                      ))}
                    </div>
                  )}

                {successData.failedFor &&
                  successData.failedFor.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-red-700">
                        Notifications failed for:
                      </p>

                      {successData.failedFor.map((email) => (
                        <p
                          key={email}
                          className="break-all text-sm text-red-600"
                        >
                          {email}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          /* Application form */
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 p-6">
              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Leave Type */}
              <div>
                <label
                  htmlFor="leaveType"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Leave Type <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                  <CalendarDays
                    size={18}
                    className="mr-2 shrink-0 text-gray-400"
                  />

                  <select
                    id="leaveType"
                    value={leaveType}
                    onChange={(event) => setLeaveType(event.target.value)}
                    required
                    disabled={submitting}
                    className="w-full bg-transparent text-sm outline-none"
                  >
                    <option value="">Select leave type</option>

                    {leaveTypes.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date selection */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>

                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => {
                      setStartDate(date);

                      if (date && endDate && endDate < date) {
                        setEndDate(null);
                      }
                    }}
                    minDate={new Date()}
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select start date"
                    disabled={submitting}
                    required
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    wrapperClassName="w-full"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>

                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    minDate={startDate || new Date()}
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select end date"
                    disabled={submitting}
                    required
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    wrapperClassName="w-full"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock size={19} />

                  <span className="text-sm font-medium">
                    Leave Duration
                  </span>
                </div>

                <span className="text-lg font-bold text-blue-800">
                  {duration} {duration === 1 ? "day" : "days"}
                </span>
              </div>

              {/* Balance estimate */}
              {selectedLeaveType && duration > 0 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-600">
                      Displayed {selectedLeaveType.label} balance
                    </span>
                    <span className="font-medium text-gray-800">
                      {balance} days
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between gap-3">
                    <span className="text-gray-600">
                      Estimated paid days
                    </span>
                    <span className="font-medium text-green-700">
                      {paidDays} days
                    </span>
                  </div>

                  {lopDays > 0 && (
                    <div className="mt-2 flex justify-between gap-3 text-red-600">
                      <span>Estimated LOP days</span>
                      <span className="font-semibold">{lopDays} days</span>
                    </div>
                  )}

                  <p className="mt-2 text-xs text-gray-400">
                    These are frontend estimates, not balances confirmed by the API.
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label
                  htmlFor="leaveReason"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Reason <span className="text-red-500">*</span>
                </label>

                <div className="flex items-start rounded-xl border border-gray-200 px-3 py-2.5 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                  <FileText
                    size={18}
                    className="mr-2 mt-1 shrink-0 text-gray-400"
                  />

                  <textarea
                    id="leaveReason"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Enter the reason for your leave..."
                    required
                    rows={3}
                    maxLength={500}
                    disabled={submitting}
                    className="w-full resize-none bg-transparent text-sm outline-none"
                  />
                </div>

                <p className="mt-1 text-right text-xs text-gray-400">
                  {reason.length}/500
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && (
                  <Loader2 size={17} className="animate-spin" />
                )}

                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplyLeaveModal;