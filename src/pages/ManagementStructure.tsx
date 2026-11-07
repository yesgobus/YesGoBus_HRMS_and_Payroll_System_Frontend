import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Users,
  Search,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  CalendarDays,
  X,
  UserRound,
  Network,
  BriefcaseBusiness,
  CircleUserRound,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

interface Employee {
  employee_id: string | null;
  name: string;
  gender: string | null;
  contact_details: string | null;
  doj: string | null;
  job_title: string | null;
  email: string | null;
  department: string | null;
  designation: string | null;
  reporting_manager_id: string | null;
  status: string | null;
}

interface EmployeeResponse {
  success: boolean;
  count: number;
  employees: Employee[];
}

interface EmployeeNode {
  employee: Employee;
  children: EmployeeNode[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) return "Not provided";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildEmployeeTree(employees: Employee[]): EmployeeNode[] {
  const nodes: EmployeeNode[] = [];
  const nodesById = new Map<string, EmployeeNode>();

  // Create a node for every employee, including employees without an ID.
  employees.forEach((employee) => {
    const node: EmployeeNode = {
      employee,
      children: [],
    };

    nodes.push(node);

    if (employee.employee_id) {
      nodesById.set(employee.employee_id, node);
    }
  });

  const roots: EmployeeNode[] = [];

  // Connect employees using reporting_manager_id.
  nodes.forEach((node) => {
    const managerId = node.employee.reporting_manager_id;
    const manager = managerId ? nodesById.get(managerId) : undefined;

    if (manager && manager !== node) {
      manager.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortTree = (items: EmployeeNode[]) => {
    items.sort((a, b) =>
      a.employee.name.localeCompare(b.employee.name)
    );

    items.forEach((item) => sortTree(item.children));
  };

  sortTree(roots);

  return roots;
}

function matchesEmployee(employee: Employee, query: string) {
  if (!query) return true;

  const search = query.toLowerCase();

  return [
    employee.name,
    employee.employee_id,
    employee.designation,
    employee.job_title,
    employee.department,
  ].some((value) => (value || "").toLowerCase().includes(search));
}

function hasMatchingDescendant(node: EmployeeNode, query: string): boolean {
  return node.children.some(
    (child) =>
      matchesEmployee(child.employee, query) ||
      hasMatchingDescendant(child, query)
  );
}

interface EmployeeNodeCardProps {
  node: EmployeeNode;
  search: string;
  onSelect: (employee: Employee) => void;
}

function EmployeeNodeCard({
  node,
  search,
  onSelect,
}: EmployeeNodeCardProps) {
  const [expanded, setExpanded] = useState(true);

  const { employee, children } = node;
  const hasChildren = children.length > 0;

  const isRoot = !employee.reporting_manager_id;

  const isMatch = matchesEmployee(employee, search);
  const matchingDescendant =
    search.length > 0 && hasMatchingDescendant(node, search);

  if (search && !isMatch && !matchingDescendant) {
    return null;
  }

  // Expand the reporting path while searching.
  const shouldExpand = search ? matchingDescendant || isMatch : expanded;

  return (
    <div className="flex flex-col items-center">
      {/* Compact, clickable employee node */}
      <div
        className={`group relative flex w-[205px] items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition duration-200 ${
          isRoot
            ? "border-indigo-300 bg-indigo-50 shadow-sm"
            : isMatch && search
              ? "border-amber-300 bg-amber-50 shadow-sm"
              : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
        }`}
      >
        <button
          type="button"
          onClick={() => onSelect(employee)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          title={`View details for ${employee.name}`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
              isRoot
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700"
            }`}
          >
            {getInitials(employee.name)}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-800">
              {employee.name}
            </span>

            <span className="mt-0.5 block truncate text-xs text-slate-500">
              {employee.designation ||
                employee.job_title ||
                "Employee"}
            </span>
          </span>
        </button>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((previous) => !previous)}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${employee.name}'s team`}
            aria-expanded={shouldExpand}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-indigo-100 hover:text-indigo-700"
          >
            {shouldExpand ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        )}
      </div>

      {/* Reporting employees */}
      {hasChildren && shouldExpand && (
        <>
          <div className="h-5 w-px bg-slate-300" />

          <div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-6 border-t border-slate-300 px-3 pt-5">
            {children.map((child, index) => (
              <EmployeeNodeCard
                key={
                  child.employee.employee_id ||
                  `${child.employee.name}-${index}`
                }
                node={child}
                search={search}
                onSelect={onSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface EmployeeDetailsModalProps {
  employee: Employee;
  employees: Employee[];
  onClose: () => void;
}

function EmployeeDetailsModal({
  employee,
  employees,
  onClose,
}: EmployeeDetailsModalProps) {
  const manager = employee.reporting_manager_id
    ? employees.find(
        (item) => item.employee_id === employee.reporting_manager_id
      )
    : null;

  const directReports = employee.employee_id
    ? employees.filter(
        (item) =>
          item.reporting_manager_id === employee.employee_id
      )
    : [];

  const details = [
    {
      label: "Employee ID",
      value: employee.employee_id || "Not assigned",
      icon: CircleUserRound,
    },
    {
      label: "Designation",
      value: employee.designation || "Not provided",
      icon: BriefcaseBusiness,
    },
    {
      label: "Job title",
      value: employee.job_title || "Not provided",
      icon: BriefcaseBusiness,
    },
    {
      label: "Department",
      value: employee.department || "Not assigned",
      icon: Building2,
    },
    {
      label: "Email address",
      value: employee.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Contact number",
      value: employee.contact_details || "Not provided",
      icon: Phone,
    },
    {
      label: "Date of joining",
      value: formatDate(employee.doj),
      icon: CalendarDays,
    },
    {
      label: "Gender",
      value:
        employee.gender === "M"
          ? "Male"
          : employee.gender === "F"
            ? "Female"
            : employee.gender || "Not provided",
      icon: UserRound,
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* Modal header */}
        <div className="relative overflow-hidden bg-indigo-700 px-6 py-6 text-white">
          <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/5" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close employee details"
            className="absolute right-4 top-4 z-10 rounded-lg p-2 text-white/80 hover:bg-white/15 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="relative flex items-center gap-4 pr-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-xl font-bold">
              {getInitials(employee.name)}
            </div>

            <div className="min-w-0">
              <h2
                id="employee-modal-title"
                className="break-words text-xl font-bold"
              >
                {employee.name}
              </h2>

              <p className="mt-1 text-sm text-indigo-100">
                {employee.designation ||
                  employee.job_title ||
                  "Employee"}
              </p>

              <span className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                {employee.status || "Status unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Employee details */}
        <div className="p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Employee information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {details.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <Icon size={15} />
                  <span className="text-xs font-medium">{label}</span>
                </div>

                <p className="break-words text-sm font-medium text-slate-700">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Reporting manager */}
          <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-indigo-500">
              <Network size={15} />
              Reporting manager
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {manager
                ? manager.name
                : employee.reporting_manager_id
                  ? `Manager ID: ${employee.reporting_manager_id}`
                  : "Top-level employee"}
            </p>

            {manager && (
              <p className="mt-1 text-xs text-slate-500">
                {manager.designation || manager.job_title || "Manager"}
                {manager.employee_id
                  ? ` · ${manager.employee_id}`
                  : ""}
              </p>
            )}
          </div>

          {directReports.length > 0 && (
            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Users size={17} className="text-indigo-600" />
                Direct reports
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                  {directReports.length}
                </span>
              </div>

              <div className="space-y-2">
                {directReports.map((report, index) => (
                  <div
                    key={report.employee_id || `${report.name}-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                      {getInitials(report.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">
                        {report.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {report.designation || report.job_title || "Employee"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Close details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManagementStructure() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  async function fetchEmployees(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      // Fetch the entire company, independent of the logged-in employee.
      const response = await fetch(`${API_BASE_URL}employees`);
      const data: EmployeeResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Unable to fetch company employees.");
      }

      setEmployees(data.employees || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load company structure."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void fetchEmployees();
  }, []);

  const tree = useMemo(
    () => buildEmployeeTree(employees),
    [employees]
  );

  const activeCount = employees.filter(
    (employee) => employee.status?.toLowerCase() === "active"
  ).length;

  const managerCount = employees.filter(
    (employee) =>
      employee.employee_id &&
      employees.some(
        (other) =>
          other.reporting_manager_id === employee.employee_id
      )
  ).length;

  const visibleCount = useMemo(() => {
    if (!search.trim()) return employees.length;

    return employees.filter((employee) =>
      matchesEmployee(employee, search.trim())
    ).length;
  }, [employees, search]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Page heading */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-700">
              <Building2 size={17} />
              Ramble Transport Pvt Ltd
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Company Structure
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Explore the company hierarchy. Select any employee to view their details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchEmployees(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <RefreshCw size={17} />
            )}
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        {!loading && !error && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                  <Users size={21} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total employees</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {employees.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
                  <Network size={21} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Managers with reports</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {managerCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <UserRound size={21} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active employees</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {activeCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by employee name, ID, department..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {search.trim() && (
            <p className="mt-2 text-xs text-slate-500">
              {visibleCount} matching employee
              {visibleCount === 1 ? "" : "s"}. Matching reporting paths are kept visible.
            </p>
          )}
        </div>

        {/* Tree */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <p className="text-sm text-slate-500">
              Loading company structure...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="font-semibold text-red-700">
              Unable to load company structure
            </p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={() => void fetchEmployees()}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Try again
            </button>
          </div>
        ) : employees.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Users size={36} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">
              No employees found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
            <div className="flex min-w-max flex-col items-center gap-8 py-4">
              {tree.map((node, index) => (
                <EmployeeNodeCard
                  key={
                    node.employee.employee_id ||
                    `${node.employee.name}-${index}`
                  }
                  node={node}
                  search={search.trim()}
                  onSelect={setSelectedEmployee}
                />
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        {!loading && !error && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded border border-indigo-300 bg-indigo-50" />
              Top-level employee
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded border border-slate-200 bg-white" />
              Employee
            </span>

            <span>Click a name to view details.</span>
            <span>Use the arrow to expand or collapse a team.</span>
          </div>
        )}
      </div>

      {/* Employee details popup */}
      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          employees={employees}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}