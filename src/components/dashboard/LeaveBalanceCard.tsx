
import { useCallback, useEffect, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { API_BASE_URL } from "../../config/api";

interface LeaveBalance {
  total: number;
  used: number;
  pending: number;
  remaining: number;
}

interface LeaveResponse {
  success: boolean;
  employeeId: string;
  year: number;
  leaveBalances: {
    SL: LeaveBalance;
    CL: LeaveBalance;
    EL: LeaveBalance;
  };
}

const leaveConfig = [
  {
    code: "CL" as const,
    name: "Casual Leave",
    shortName: "Casual",
    color: "#6366F1",
  },
  {
    code: "SL" as const,
    name: "Sick Leave",
    shortName: "Sick",
    color: "#F43F5E",
  },
  {
    code: "EL" as const,
    name: "Earned Leave",
    shortName: "Earned",
    color: "#10B981",
  },
];

function LeaveBalanceCard() {
  const [data, setData] = useState<LeaveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBalance = useCallback(async () => {
    const employeeId =
      localStorage.getItem("employeeId") ||
      sessionStorage.getItem("employeeId");

    if (!employeeId) {
      setError("Employee ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}leave/balance/${employeeId}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch leave balance.");
      }

      const result: LeaveResponse = await response.json();

      if (!result.success) {
        throw new Error("Unable to load leave balance.");
      }

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-72 max-w-sm animate-pulse rounded-full bg-gray-100" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-indigo-600" size={22} />
          <h2 className="font-semibold text-gray-800">
            Leave Balance
          </h2>
        </div>

        <p className="mt-4 text-sm text-red-500">
          {error || "No leave data available."}
        </p>

        <button
          onClick={fetchBalance}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <RefreshCw size={15} />
          Retry
        </button>
      </div>
    );
  }

  // Prepare chart data from API
  const chartData = leaveConfig.map((leave) => ({
    ...leave,
    ...data.leaveBalances[leave.code],
    value: data.leaveBalances[leave.code].remaining,
  }));

  // Calculate totals
  const totalLeaves = chartData.reduce(
    (sum, leave) => sum + leave.total,
    0
  );

  const remainingLeaves = chartData.reduce(
    (sum, leave) => sum + leave.remaining,
    0
  );

  const usedLeaves = chartData.reduce(
    (sum, leave) => sum + leave.used,
    0
  );

  // const pendingLeaves = chartData.reduce(
  //   (sum, leave) => sum + leave.pending,
  //   0
  // );

  const usagePercentage =
    totalLeaves > 0
      ? Math.round((usedLeaves / totalLeaves) * 100)
      : 0;

  return (
    <div className="w-full overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3">
            <CalendarDays size={22} className="text-indigo-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Leave Balance
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Leave distribution for {data.year}
            </p>
          </div>
        </div>

        <button
          onClick={fetchBalance}
          title="Refresh leave balance"
          className="rounded-lg border border-gray-200 p-2.5 text-gray-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {/* Pie Chart */}
      <div className="px-4 py-6 sm:px-8">

        <div className="relative mx-auto h-[360px] w-full max-w-[650px]">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={95}
                outerRadius={135}
                paddingAngle={4}
                cornerRadius={7}
                stroke="none"
                isAnimationActive={true}
                labelLine={{
                  stroke: "#9CA3AF",
                  strokeWidth: 1,
                }}
                label={({ cx, cy, midAngle, outerRadius, payload }: any) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 28;

                  const x =
                    cx + radius * Math.cos(-midAngle * RADIAN);

                  const y =
                    cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={payload.color}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize={13}
                      fontWeight={600}
                    >
                      {payload.shortName}: {payload.remaining} days
                    </text>
                  );
                }}
              >
                {chartData.map((leave) => (
                  <Cell
                    key={leave.code}
                    fill={leave.color}
                    className="cursor-pointer outline-none transition-opacity duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>

              {/* Custom Hover Tooltip */}
              <Tooltip
                cursor={false}
                content={({ active, payload }: any) => {
                  if (!active || !payload?.length) {
                    return null;
                  }

                  const leave = payload[0].payload;

                  return (
                    <div className="min-w-[190px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: leave.color,
                          }}
                        />

                        <p className="font-bold text-gray-800">
                          {leave.name}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-5">
                          <span className="text-gray-500">Total</span>
                          <strong>{leave.total} days</strong>
                        </div>

                        <div className="flex justify-between gap-5">
                          <span className="text-gray-500">Used</span>
                          <strong>{leave.used} days</strong>
                        </div>

                        <div className="flex justify-between gap-5">
                          <span className="text-gray-500">Pending</span>
                          <strong>{leave.pending} days</strong>
                        </div>

                        <div className="flex justify-between gap-5 border-t border-gray-100 pt-2">
                          <span className="font-medium text-gray-700">
                            Remaining
                          </span>
                          <strong className="text-emerald-600">
                            {leave.remaining} days
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centre of Donut */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-gray-500">
              Total Available
            </span>

            <span className="mt-1 text-5xl font-bold tracking-tight text-gray-900">
              {remainingLeaves}
            </span>

            <span className="mt-1 text-sm text-gray-500">
              out of {totalLeaves} days
            </span>

            <div className="mt-3 rounded-full bg-indigo-50 px-3 py-1">
              <span className="text-xs font-semibold text-indigo-600">
                {usagePercentage}% used
              </span>
            </div>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-x-8 gap-y-3">
          {chartData.map((leave) => (
            <div
              key={leave.code}
              className="flex items-center gap-2"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: leave.color }}
              />

              <span className="text-sm font-medium text-gray-600">
                {leave.name}
              </span>

              <span className="text-sm font-bold text-gray-800">
                {leave.remaining}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Hover over each chart section to view its complete leave details.
        </p>
      </div>
    </div>
  );
}

export default LeaveBalanceCard;
