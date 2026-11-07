import { CalendarDays } from "lucide-react"

function SalaryHistoryTable() {

  const salaryHistory = [
    { month: "Jan 2026", amount: 34000, status: "Paid" },
    { month: "Feb 2026", amount: 36000, status: "Paid" },
    { month: "Mar 2026", amount: 35000, status: "Paid" },
    { month: "Apr 2026", amount: 35000, status: "Upcoming" },
  ]

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">

        <CalendarDays size={20} className="text-blue-600" />

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Salary History
          </h2>
          <p className="text-xs text-gray-500">
            Monthly salary records
          </p>
        </div>

      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100">

        <table className="w-full">

          {/* Table Head */}
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">

            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Net Salary</th>
              <th className="px-4 py-3">Status</th>
            </tr>

          </thead>

          {/* Table Body */}
          <tbody className="text-sm">

            {salaryHistory.map((item, index) => (

              <tr
                key={index}
                className="border-t hover:bg-blue-50 transition"
              >

                {/* Month */}
                <td className="px-4 py-4 font-medium text-gray-700">
                  {item.month}
                </td>

                {/* Salary */}
                <td className="px-4 py-4 font-semibold text-gray-800">
                  ₹ {item.amount.toLocaleString()}
                </td>

                {/* Status */}
                <td className="px-4 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold

                    ${item.status === "Paid" && "bg-green-100 text-green-700"}
                    ${item.status === "Upcoming" && "bg-yellow-100 text-yellow-700"}
                    
                    `}
                  >
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default SalaryHistoryTable