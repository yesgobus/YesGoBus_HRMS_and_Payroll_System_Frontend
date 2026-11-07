
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api"

interface LeaveBalance {
  total: number | null;
  used: number;
  pending: number;
  remaining: number | null;
}

interface LeaveBalanceResponse {
  success: boolean;
  employeeId: string;
  year: number;
  leaveBalances: {
    SL: LeaveBalance;
    CL: LeaveBalance;
    EL: LeaveBalance;
  };
}

function LeaveBalanceSummary() {
  const [balances, setBalances] =
    useState<LeaveBalanceResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const employeeId =
          localStorage.getItem("employeeId") ||
          sessionStorage.getItem("employeeId");

        if (!employeeId) {
          throw new Error("Employee ID not found. Please log in again.");
        }

        const response = await fetch(
          `${API_BASE_URL}leave/balance/${employeeId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leave balances.");
        }

        const data: LeaveBalanceResponse = await response.json();

        if (!data.success) {
          throw new Error("Unable to load leave balances.");
        }

        setBalances(data);
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

    fetchLeaveBalance();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading leave balances...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!balances) return null;

  const leaveTypes = [
    {
      code: "CL",
      name: "Casual Leave",
      color: "blue",
      data: balances.leaveBalances.CL,
    },
    {
      code: "SL",
      name: "Sick Leave",
      color: "emerald",
      data: balances.leaveBalances.SL,
    },
    {
      code: "EL",
      name: "Earned Leave",
      color: "violet",
      data: balances.leaveBalances.EL,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Leave Balance
          </h2>
          <p className="text-sm text-gray-500">
            Your leave summary for {balances.year}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {leaveTypes.map((leave) => (
          <div
            key={leave.code}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            <h3 className="font-semibold text-gray-700">
              {leave.name}
            </h3>

            <p className="text-3xl font-bold text-gray-800 mt-3">
              {leave.data.remaining ?? "—"}
              <span className="text-sm font-normal text-gray-500 ml-1">
                remaining
              </span>
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold">
                  {leave.data.total ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Used</p>
                <p className="font-semibold">
                  {leave.data.used}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="font-semibold">
                  {leave.data.pending}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Available</p>
                <p className="font-semibold text-green-600">
                  {leave.data.remaining ?? "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaveBalanceSummary;
