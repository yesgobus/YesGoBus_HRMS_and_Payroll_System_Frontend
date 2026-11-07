import { Wallet, TrendingDown, IndianRupee } from "lucide-react"

function SalarySummaryCard() {

  const salary = {
    gross: 40000,
    deductions: 5000,
    net: 35000
  }

  return (
    <div className="bg-gradient-to-br from-[#033564] to-[#14bde3] text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">

      {/* Title */}
      <h2 className="text-lg font-semibold mb-6 tracking-wide">
        Salary Summary
      </h2>

      <div className="space-y-5">

        {/* Gross Salary */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-blue-100">
            <Wallet size={18} />
            <span>Gross Salary</span>
          </div>

          <span className="font-medium">
            ₹ {salary.gross.toLocaleString()}
          </span>

        </div>

        {/* Deductions */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-blue-100">
            <TrendingDown size={18} />
            <span>Deductions</span>
          </div>

          <span className="font-medium text-red-200">
            - ₹ {salary.deductions.toLocaleString()}
          </span>

        </div>

        {/* Divider */}
        <div className="border-t border-white/30 pt-4 flex items-center justify-between">

          <div className="flex items-center gap-2 font-semibold">
            <IndianRupee size={18} />
            <span>Net Salary</span>
          </div>

          <span className="text-2xl font-bold text-white">
            ₹ {salary.net.toLocaleString()}
          </span>

        </div>

      </div>

    </div>
  )
}

export default SalarySummaryCard