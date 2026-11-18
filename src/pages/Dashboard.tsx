
import GreetingHeader from "../components/dashboard/GreetingHeader";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import LeaveBalanceCard from "../components/dashboard/LeaveBalanceCard";
import AttendancePunch from "../components/dashboard/AttendancePunch";
import MonthlyOverview from "../components/dashboard/MonthlyOverview";
import { useEffect, useState } from "react";

function Dashboard() {
  const [employeeName, setEmployeeName] = useState("Employee");

  useEffect(() => {
    const storedEmployee =
      localStorage.getItem("employee") ||
      sessionStorage.getItem("employee");

    if (storedEmployee) {
      try {
        const employee = JSON.parse(storedEmployee);

        setEmployeeName(
          employee.fullName || employee.name || "Employee"
        );
      } catch (error) {
        console.error("Error reading employee details:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-3 sm:p-4 lg:p-6">

      {/* Greeting */}
      <GreetingHeader employeeName={employeeName} />

      {/* Dashboard Grid */}
      <DashboardGrid>

        {/* ROW 1 */}

        {/* Attendance Punch */}
        <div className="col-span-12 min-w-0 lg:col-span-4">
          <AttendancePunch />
        </div>

        {/* Monthly Overview */}
        <div className="col-span-12 min-w-0 lg:col-span-8">
          <MonthlyOverview />
        </div>

        {/* ROW 2 */}

        {/* Leave Balance with Pie Chart */}
        <div className="col-span-12 min-w-0">
          <LeaveBalanceCard />
        </div>

        {/* ROW 3 */}

        {/* Holidays */}
        {/* <div className="col-span-12 min-w-0 lg:col-span-6">
          <HolidaysCard />
        </div> */}

        {/* News */}
        {/* <div className="col-span-12 min-w-0 lg:col-span-6">
          <NewsCard />
        </div> */}

        {/* Quick Actions */}
        {/* <div className="col-span-12 min-w-0 lg:col-span-6">
          <QuickActionsCard />
        </div> */}

        {/* ROW 4 */}

        {/* Monthly Statistics */}
        {/* <div className="col-span-12 min-w-0 overflow-hidden">
          <MonthlyStatsChart />
        </div> */}

      </DashboardGrid>
    </div>
  );
}

export default Dashboard;
