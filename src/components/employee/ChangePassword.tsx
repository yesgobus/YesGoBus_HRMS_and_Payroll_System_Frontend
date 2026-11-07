
import { useState } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
  autoComplete: string;
  disabled?: boolean;
}

// Moved outside ChangePassword to prevent input focus loss.
function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  autoComplete,
  disabled = false,
}: PasswordFieldProps) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-indigo-600"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}

function getStoredToken(): string {
  const keys = ["token", "accessToken", "authToken", "jwt"];

  for (const key of keys) {
    const token =
      localStorage.getItem(key) ||
      sessionStorage.getItem(key);

    if (token) return token;
  }

  return "";
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from current password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const token = getStoredToken();

    if (!token) {
      setError(
        "Authentication token not found. Please log in again."
      );
      return;
    }

    try {
      setLoading(true);

      const baseUrl = API_BASE_URL.replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/employees/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data: ChangePasswordResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to change password."
        );
      }

      setSuccess(
        data.message || "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Security Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account password securely.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.5fr]">

        {/* Information Panel */}
        <div className="border-b border-gray-100 bg-gray-50/80 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
            <LockKeyhole size={23} />
          </div>

          <h3 className="mt-5 text-base font-semibold text-gray-900">
            Update your password
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Keep your employee account secure by choosing a strong,
            unique password.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-green-600"
              />
              Use at least 8 characters.
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-green-600"
              />
              Choose a password different from your current one.
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-green-600"
              />
              Keep your password private.
            </div>
          </div>
        </div>

        {/* Password Form */}
        <div className="p-6 sm:p-8">
          <form
            onSubmit={handleChangePassword}
            className="space-y-5"
          >
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                {success}
              </div>
            )}

            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrent}
              onToggle={() => setShowCurrent(!showCurrent)}
              placeholder="Enter current password"
              autoComplete="current-password"
              disabled={loading}
            />

            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              onToggle={() => setShowNew(!showNew)}
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={loading}
            />

            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              disabled={loading}
            />

            {/* Submit Button */}
            <div className="flex justify-end border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <LockKeyhole size={18} />
                )}

                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
