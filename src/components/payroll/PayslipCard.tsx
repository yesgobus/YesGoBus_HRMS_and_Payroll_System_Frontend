import { FileDown, IndianRupee } from "lucide-react"

function PayslipCard() {

  const payslip = {
    month: "March 2026",
    basic: 20000,
    hra: 10000,
    bonus: 5000,
    pf: 2000,
    tax: 3000,
    lopDays: 2, // 🔥 from leave module later
  }

  // ✅ Salary calculation
  const gross = payslip.basic + payslip.hra + payslip.bonus

  const perDaySalary = gross / 30

  const lopDeduction = payslip.lopDays * perDaySalary

  const totalDeductions =
    payslip.pf + payslip.tax + lopDeduction

  const net = gross - totalDeductions

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {payslip.month}
          </h2>
          <p className="text-sm text-gray-500">
            Payslip Details
          </p>
        </div>

        <button className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition">
          <FileDown size={16} />
          Download
        </button>

      </div>

      {/* Earnings */}
      <div className="bg-gray-50 p-3 rounded-xl mb-4">

        <p className="text-sm text-gray-500 mb-2 font-medium">
          Earnings
        </p>

        <div className="space-y-1 text-sm text-gray-700">

          <div className="flex justify-between">
            <span>Basic</span>
            <span>₹ {payslip.basic.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>HRA</span>
            <span>₹ {payslip.hra.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Bonus</span>
            <span>₹ {payslip.bonus.toLocaleString()}</span>
          </div>

        </div>

      </div>

      {/* Deductions */}
      <div className="space-y-2 text-sm mb-3">

        <div className="flex justify-between text-gray-600">
          <span>PF</span>
          <span>₹ {payslip.pf.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>₹ {payslip.tax.toLocaleString()}</span>
        </div>

        {/* 🔥 LOP */}
        {payslip.lopDays > 0 && (
          <div className="flex justify-between text-red-500 font-medium">
            <span>LOP ({payslip.lopDays} days)</span>
            <span>- ₹ {Math.round(lopDeduction).toLocaleString()}</span>
          </div>
        )}

      </div>

      {/* Divider */}
      <div className="border-t my-3"></div>

      {/* Total Deduction */}
      <div className="flex justify-between text-sm text-red-500 font-semibold mb-3">

        <span>Total Deductions</span>
        <span>₹ {Math.round(totalDeductions).toLocaleString()}</span>

      </div>

      {/* Highlight Line */}
      <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-3"></div>

      {/* Net Pay */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <IndianRupee size={18} />
          <span>Net Pay</span>
        </div>

        <span className="text-2xl font-bold text-green-600">
          ₹ {Math.round(net).toLocaleString()}
        </span>

      </div>

    </div>
  )
}

export default PayslipCard