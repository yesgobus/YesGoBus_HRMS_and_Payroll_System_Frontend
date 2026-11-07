
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Fixed Sidebar */}
      <div className="h-screen shrink-0 overflow-hidden">
        <Sidebar />
      </div>

      {/* Right Content */}
      <div className="flex min-w-0 flex-1 flex-col h-screen">

        {/* Fixed Top Navbar */}
        <div className="shrink-0">
          <TopNavbar />
        </div>

        {/* Only this section scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;
