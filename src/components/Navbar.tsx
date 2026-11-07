function Navbar() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Admin</span>

        <div className="w-full h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          A
        </div>
      </div>
    </div>
  );
}

export default Navbar;