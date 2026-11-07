import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

function SalaryChart() {

  const data = [
    { name: "Basic", value: 20000 },
    { name: "HRA", value: 10000 },
    { name: "Bonus", value: 5000 },
    { name: "Deductions", value: 5000 },
  ]

  const COLORS = ["#033564", "#14bde3", "#60a5fa", "#ef4444"]

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Salary Breakdown
      </h2>

      <div className="w-full h-72">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >

              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}

            </Pie>

            <Tooltip />
            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default SalaryChart