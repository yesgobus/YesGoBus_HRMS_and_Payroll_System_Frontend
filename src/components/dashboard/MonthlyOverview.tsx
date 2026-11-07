
function MonthlyOverview() {
  const currentMonth = new Date().toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  })

  const stats = [
    {
      title: "Working Days",
      value: "22",
      description: "Total working days",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Days Present",
      value: "18",
      description: "Attendance recorded",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Leave Taken",
      value: "2",
      description: "Days on leave",
      color: "bg-orange-50 text-orange-600",
    },
  ]

  return (
    <div className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

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
          {currentMonth}
        </span>
      </div>

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
                {stat.title === "Working Days"
                  ? "W"
                  : stat.title === "Days Present"
                    ? "P"
                    : "L"}
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
  )
}

export default MonthlyOverview
