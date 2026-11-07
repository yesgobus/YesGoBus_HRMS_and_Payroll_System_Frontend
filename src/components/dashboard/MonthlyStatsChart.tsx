import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

function MonthlyStatsChart() {

  const data = [
    { month: "Jan", attendance: 20, leaves: 2, overtime: 5 },
    { month: "Feb", attendance: 22, leaves: 1, overtime: 6 },
    { month: "Mar", attendance: 18, leaves: 3, overtime: 4 },
    { month: "Apr", attendance: 21, leaves: 2, overtime: 7 },
    { month: "May", attendance: 23, leaves: 1, overtime: 6 },
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Monthly Stats
      </h2>

      <div className="w-full h-72">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <XAxis dataKey="month" />
            <YAxis />

            <Tooltip />
            <Legend />

            <Bar dataKey="attendance" fill="#3b82f6" name="Attendance" />
            <Bar dataKey="leaves" fill="#ef4444" name="Leaves" />
            <Bar dataKey="overtime" fill="#22c55e" name="Overtime" />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default MonthlyStatsChart