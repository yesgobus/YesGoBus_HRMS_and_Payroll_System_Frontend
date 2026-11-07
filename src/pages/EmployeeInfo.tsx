import { useCallback, useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Building2,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import ChangePassword from "../components/employee/ChangePassword";

interface Employee {
  employeeCode: string;
  fullName: string;
  gender: string | null;
  dob: string | null;
  place: string | null;
  contactNumber: string | null;
  email: string | null;
  emergencyContactNumber: string | null;
  joiningDate: string | null;
  department: string | null;
  designation: string | null;
  jobTitle: string | null;
  role: string | null;
  accountStatus: string | null;
}

interface EmployeeResponse {
  success: boolean;
  employee: Employee;
  message?: string;
}

function getStoredEmployeeId(): string {
  return (
    localStorage.getItem("employeeId") ||
    sessionStorage.getItem("employeeId") ||
    ""
  ).trim();
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Not provided";

  const parts = dateString.split("-");

  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getGender(gender: string | null): string {
  if (gender === "F") return "Female";
  if (gender === "M") return "Male";
  return gender || "Not provided";
}

function EmployeeInfo() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployeeInfo = useCallback(async () => {
    const employeeId = getStoredEmployeeId();

    if (!employeeId) {
      setError("Employee ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const baseUrl = API_BASE_URL.replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/employees/${encodeURIComponent(employeeId)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data: EmployeeResponse = await response.json();

      if (!response.ok || !data.success || !data.employee) {
        throw new Error(
          data.message || "Unable to fetch employee information."
        );
      }

      setEmployee(data.employee);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching employee details."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEmployeeInfo();
  }, [fetchEmployeeInfo]);

  const InfoField = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string | null | undefined;
    icon: React.ReactNode;
  }) => (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </label>

      <div className="min-h-[46px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800">
        {value || "Not provided"}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Employee Details
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View your personal and employment information.
            </p>
          </div>

          <button
            onClick={() => void fetchEmployeeInfo()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white shadow-sm">
            <Loader2
              size={36}
              className="animate-spin text-indigo-600"
            />
            <p className="mt-4 text-sm text-gray-500">
              Loading employee information...
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-sm">
            <AlertCircle size={40} className="text-red-500" />

            <h2 className="mt-4 font-semibold text-gray-800">
              Unable to load employee details
            </h2>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <button
              onClick={() => void fetchEmployeeInfo()}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : employee ? (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_1fr]">
            {/* Employee Profile Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-4 border-gray-100 bg-indigo-50 text-5xl font-semibold text-indigo-600">
                {employee.fullName
                  ?.split(" ")
                  .slice(0, 2)
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase() || <UserRound size={55} />}
              </div>

              <h2 className="mt-6 text-xl font-semibold text-gray-800">
                {employee.fullName}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {employee.designation ||
                  employee.jobTitle ||
                  "Employee"}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {employee.accountStatus || "Unknown"}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5 text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Employee ID
                </p>

                <p className="mt-2 text-base font-semibold text-gray-800">
                  {employee.employeeCode}
                </p>
              </div>
            </div>

            {/* Employee Information */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Employee Information
                </h2>

                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
                  Personal Details
                </span>
              </div>

              <div className="grid grid-cols-1 gap-x-7 gap-y-6 sm:grid-cols-2">
                <InfoField
                  label="Full Name"
                  value={employee.fullName}
                  icon={<UserRound size={16} />}
                />

                <InfoField
                  label="Gender"
                  value={getGender(employee.gender)}
                  icon={<UserRound size={16} />}
                />

                <InfoField
                  label="Date of Birth"
                  value={formatDate(employee.dob)}
                  icon={<CalendarDays size={16} />}
                />

                <InfoField
                  label="Place"
                  value={employee.place}
                  icon={<MapPin size={16} />}
                />

                <InfoField
                  label="Contact Number"
                  value={employee.contactNumber}
                  icon={<Phone size={16} />}
                />

                <InfoField
                  label="Email Address"
                  value={employee.email}
                  icon={<Mail size={16} />}
                />

                <InfoField
                  label="Emergency Contact"
                  value={employee.emergencyContactNumber}
                  icon={<Phone size={16} />}
                />

                <InfoField
                  label="Joining Date"
                  value={formatDate(employee.joiningDate)}
                  icon={<CalendarDays size={16} />}
                />

                <InfoField
                  label="Department"
                  value={employee.department}
                  icon={<Building2 size={16} />}
                />

                <InfoField
                  label="Designation"
                  value={employee.designation || employee.jobTitle}
                  icon={<BriefcaseBusiness size={16} />}
                />

                <InfoField
                  label="Role"
                  value={employee.role}
                  icon={<ShieldCheck size={16} />}
                />

                <InfoField
                  label="Account Status"
                  value={employee.accountStatus}
                  icon={<ShieldCheck size={16} />}
                />
              </div>
            </div>
          </div>

        ) : null}

        {/* Change Password Section */}
        <ChangePassword />

      </div>
    </div>
  );
}

export default EmployeeInfo;