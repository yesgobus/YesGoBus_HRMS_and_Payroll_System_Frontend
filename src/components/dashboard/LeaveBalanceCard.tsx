import { CalendarDays, HeartPulse, Plane } from "lucide-react"

function LeaveBalanceCard() {

  const leaves = [
    {
      name: "Casual Leave",
      used: 5,
      total: 10,
      icon: CalendarDays,
      color: "bg-blue-500"
    },
    {
      name: "Sick Leave",
      used: 3,
      total: 6,
      icon: HeartPulse,
      color: "bg-red-500"
    },
    {
      name: "Earned Leave",
      used: 8,
      total: 12,
      icon: Plane,
      color: "bg-green-500"
    }
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Leave Balance
      </h2>

      <div className="space-y-5">

        {leaves.map((leave) => {

          const Icon = leave.icon
          const percentage = (leave.used / leave.total) * 100

          return (
            <div key={leave.name}>

              {/* Top Row */}
              <div className="flex items-center justify-between mb-1">

                <div className="flex items-center gap-2 text-gray-600">
                  <Icon size={18} />
                  <span className="text-sm">{leave.name}</span>
                </div>

                <span className="text-sm font-medium text-gray-800">
                  {leave.used} / {leave.total}
                </span>

              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

                <div
                  className={`${leave.color} h-full`}
                  style={{ width: `${percentage}%` }}
                />

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default LeaveBalanceCard