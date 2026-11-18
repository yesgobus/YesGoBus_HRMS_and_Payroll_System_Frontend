
import { useState } from "react";
import { Plus } from "lucide-react";

import ApplyLeaveModal from "../components/leave/ApplyLeaveModal";
import LeaveTable from "../components/leave/LeaveTable";
import LeaveBalanceSummary from "../components/leave/LeaveBalance";
import ManagerLeaveApprovals from "../components/leave/ManagerLeaveApprovals";

function getIsManager(): boolean {
  const storedEmployees =
    localStorage.getItem("visibleEmployees") ||
    sessionStorage.getItem("visibleEmployees");

  if (!storedEmployees) return false;

  try {
    const employees = JSON.parse(storedEmployees);
    return Array.isArray(employees) && employees.length > 1;
  } catch (error) {
    console.error("Failed to read manager information:", error);
    return false;
  }
}

export default function Leave() {
  const [openModal, setOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isManager] = useState(getIsManager);

  const handleLeaveApplied = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Apply for leave and track your leave applications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Apply for Leave
        </button>
      </div>

      {/* 1. LEAVE BALANCE - TOP */}
      <LeaveBalanceSummary />

      {/* 2. LEAVE HISTORY - BELOW BALANCE */}
      <LeaveTable refreshKey={refreshKey} />

      {/* 3. MANAGER APPROVALS - BOTTOM */}
      {isManager && (
        <ManagerLeaveApprovals
          onProcessed={handleLeaveApplied}
        />
      )}

      {/* APPLY LEAVE MODAL */}
      <ApplyLeaveModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleLeaveApplied}
      />

    </div>
  );
}
