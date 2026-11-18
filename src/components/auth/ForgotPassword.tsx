
import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck, LockKeyhole, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

interface Props {
  initialEmployeeId: string;
  onBack: () => void;
}

type Step = "request" | "verify" | "reset";

interface ApiResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

function ForgotPassword({ initialEmployeeId, onBack }: Props) {
  const [step, setStep] = useState<Step>("request");
  const [employeeId, setEmployeeId] = useState(initialEmployeeId);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const callApi = async (
    endpoint: string,
    body: Record<string, string>
  ): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  };

  // STEP 1: REQUEST OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!employeeId.trim()) {
      setError("Please enter your Employee ID.");
      return;
    }

    try {
      setLoading(true);

      const data = await callApi("forgot-password", {
        employeeId: employeeId.trim(),
        method: "email",
      });

      setSuccess(data.message);
      setStep("verify");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      const data = await callApi("verify-otp", {
        employeeId: employeeId.trim(),
        otp: otp.trim(),
      });

      if (!data.resetToken) {
        throw new Error("Reset token was not received.");
      }

      // Keep reset token in component memory only
      setResetToken(data.resetToken);
      setSuccess(data.message);
      setStep("reset");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: RESET PASSWORD
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await callApi("reset-password", {
        employeeId: employeeId.trim(),
        resetToken,
        newPassword,
        confirmPassword,
      });

      setSuccess(data.message);

      // Clear sensitive information
      setOtp("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");

      // Return to login after successful reset
      setTimeout(() => {
        onBack();
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    request: {
      title: "Forgot Password?",
      description: "Enter your Employee ID to receive an OTP on your registered email.",
    },
    verify: {
      title: "Verify OTP",
      description: "Enter the OTP sent to your registered official email address.",
    },
    reset: {
      title: "Create New Password",
      description: "Choose a new password for your RambleHR account.",
    },
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-7"
      >
        <ArrowLeft size={17} />
        Back to Login
      </button>

      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
        {step === "request" && <Mail size={26} />}
        {step === "verify" && <ShieldCheck size={26} />}
        {step === "reset" && <LockKeyhole size={26} />}
      </div>

      <h2 className="text-3xl font-bold text-slate-900">
        {titles[step].title}
      </h2>

      <p className="text-gray-500 mt-2 mb-7">
        {titles[step].description}
      </p>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {step === "request" && (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>

            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
              disabled={loading}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={19} /> : <Mail size={19} />}
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              disabled={loading}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={19} /> : <ShieldCheck size={19} />}
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setStep("request");
              setOtp("");
              setError("");
              setSuccess("");
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-700"
          >
            Request OTP again
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={loading}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={loading}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={19} /> : <LockKeyhole size={19} />}
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
