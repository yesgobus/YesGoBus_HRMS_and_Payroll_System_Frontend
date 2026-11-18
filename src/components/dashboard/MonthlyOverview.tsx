
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";

interface MonthlyOverviewResponse {
  success: boolean;
  employeeId: string;
  year: number;
  month: number;
  workingDays: number;
  daysPresent: number;
  leaveTaken: number;
  message?: string;
}

function MonthlyOverview() {
  const today = new Date();

  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const formattedMonth = today.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const [overview, setOverview] =
    useState<MonthlyOverviewResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMonthlyOverview = async () => {
      try {
        setLoading(true);
        setError("");

        // Get logged-in employee ID
        const employeeId =
          localStorage.getItem("employeeId") ||
          sessionStorage.getItem("employeeId");

        if (!employeeId) {
          throw new Error(
            "Employee ID not found. Please log in again."
          );
        }

        // Call monthly overview API
        const response = await fetch(
          `${API_BASE_URL}attendance/monthly-overview/${encodeURIComponent(
            employeeId
          )}?year=${currentYear}&month=${currentMonth}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data: MonthlyOverviewResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch monthly overview."
          );
        }

        setOverview(data);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchMonthlyOverview();
  }, [currentMonth, currentYear]);

  // Loading state
  if (loading) {
    return (
      <div className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-3 text-sm text-gray-500">
            Loading monthly overview...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col items-center justify-center text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!overview) return null;

  const stats = [
    {
      title: "Working Days",
      value: overview.workingDays,
      description: "Total working days",
      color: "bg-indigo-50 text-indigo-600",
      icon: "W",
    },
    {
      title: "Days Present",
      value: overview.daysPresent,
      description: "Attendance recorded",
      color: "bg-green-50 text-green-600",
      icon: "P",
    },
    {
      title: "Leave Taken",
      value: overview.leaveTaken,
      description: "Days on leave",
      color: "bg-orange-50 text-orange-600",
      icon: "L",
    },
  ];

  return (
    <div className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Monthly Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your attendance summary
          </p>
        </div>

        <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600">
          {formattedMonth}
        </span>

      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-100 p-4"
          >

            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
            >
              <span className="text-lg font-bold">
                {stat.icon}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              {stat.title}
            </p>

            <h3 className="mt-1 text-2xl font-bold text-gray-800">
              {stat.value}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              {stat.description}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}

export default MonthlyOverview;
