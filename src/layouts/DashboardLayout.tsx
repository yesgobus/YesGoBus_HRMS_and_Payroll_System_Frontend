
import { useState, useCallback } from "react";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile sidebar
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Toggle mobile sidebar
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((previous) => !previous);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
      />

      {/* RIGHT CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* TOP NAVBAR */}
        <TopNavbar
          onMenuClick={toggleMobileMenu}
          menuOpen={mobileMenuOpen}
        />

        {/* PAGE CONTENT */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;
