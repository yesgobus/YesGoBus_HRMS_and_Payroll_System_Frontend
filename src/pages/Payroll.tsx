import PayslipCard from "../components/payroll/PayslipCard"
import SalaryChart from "../components/payroll/SalaryChart"
import SalaryHistoryTable from "../components/payroll/SalaryHistoryTable"
import SalarySummaryCard from "../components/payroll/SalarySummaryCard"

function Payroll() {
  return (
    <div className="bg-gray-50 min-h-screen p-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Payroll
        </h1>
        <p className="text-gray-500">
          Manage your salary, payslips, and history
        </p>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-3 gap-6">

        {/* Salary Summary */}
        <div className="col-span-1">
          <SalarySummaryCard />
        </div>

        {/* Payslip */}
        <div className="col-span-2">
          <PayslipCard />
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">

        {/* History */}
        <div className="col-span-1">
          <SalaryHistoryTable />
        </div>

        {/* Add space for future charts */}
        <div className="col-span-2">
          <SalaryChart />
        </div>

      </div>

    </div>
  )
}

export default Payroll