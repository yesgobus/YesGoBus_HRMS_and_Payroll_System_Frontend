import {
  CalendarPlus,
  Clock,
  Wallet,
  User
} from "lucide-react"

function QuickActionsCard() {

  const actions = [
    {
      name: "Apply Leave",
      icon: CalendarPlus,
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Mark Attendance",
      icon: Clock,
      color: "bg-green-100 text-green-600"
    },
    {
      name: "Payslip",
      icon: Wallet,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      name: "Profile",
      icon: User,
      color: "bg-purple-100 text-purple-600"
    }
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((action, index) => {

          const Icon = action.icon

          return (
            <button
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition"
            >

              <div className={`p-2 rounded-lg ${action.color}`}>
                <Icon size={18} />
              </div>

              <span className="text-sm font-medium text-gray-700">
                {action.name}
              </span>

            </button>
          )
        })}

      </div>

    </div>
  )
}

export default QuickActionsCard