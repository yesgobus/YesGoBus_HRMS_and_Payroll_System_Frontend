
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  LogIn,
  Loader2,
} from "lucide-react";

import { loginUser } from "../../services/authService";
import ForgotPassword from "./ForgotPassword";

function LoginForm() {
  const navigate = useNavigate();

  // LOGIN FORM STATE
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // LOGIN STATE
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // FORGOT PASSWORD STATE
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // LOGIN
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (!employeeId.trim() || !password.trim()) {
      setError("Please enter Employee ID and Password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(
        employeeId.trim(),
        password
      );

      // Check whether backend returned a token
      if (!data.token) {
        throw new Error(
          "Authentication token was not received from the server."
        );
      }

      // Select storage based on Remember Me
      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      const oppositeStorage = rememberMe
        ? sessionStorage
        : localStorage;

      // Remove previous login information
      const storageKeys = [
        "isLoggedIn",
        "employeeId",
        "employee",
        "role",
        "visibleEmployees",
        "token",
      ];

      storageKeys.forEach((key) => {
        oppositeStorage.removeItem(key);
      });

      // STORE LOGIN INFORMATION
      storage.setItem("isLoggedIn", "true");

      storage.setItem(
        "employeeId",
        data.employee.employee_id
      );

      storage.setItem(
        "employee",
        JSON.stringify(data.employee)
      );

      storage.setItem(
        "role",
        data.role || ""
      );

      storage.setItem(
        "visibleEmployees",
        JSON.stringify(data.visibleEmployees || [])
      );

      // STORE JWT TOKEN
      storage.setItem("token", data.token);

      // LOGIN SUCCESS
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = () => {
    alert("Google Login will be connected later.");
  };

  // FORGOT PASSWORD SCREEN
  if (showForgotPassword) {
    return (
      <ForgotPassword
        initialEmployeeId={employeeId}
        onBack={() => {
          setShowForgotPassword(false);
          setError("");
        }}
      />
    );
  }

  // LOGIN UI
  return (
    <div className="w-full">

      {/* MOBILE LOGO */}
      <div className="md:hidden flex items-center gap-3 mb-8">

        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            R
          </span>
        </div>

        <div>
          <h1 className="font-bold text-gray-900">
            RambleHR
          </h1>

          <p className="text-xs text-gray-500">
            Transport Pvt Ltd
          </p>
        </div>

      </div>

      {/* HEADING */}
      <div className="mb-8">

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome back 👋
        </h2>

        <p className="text-gray-500 mt-2">
          Sign in to access your employee dashboard
        </p>

      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* LOGIN FORM */}
      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

        {/* EMPLOYEE ID */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID
          </label>

          <div className="relative">

            <UserRound
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                setError("");
              }}
              placeholder="Enter your employee ID"
              disabled={loading}
              autoComplete="username"
              className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
            />

          </div>

        </div>

        {/* PASSWORD */}
        <div>

          <div className="flex items-center justify-between mb-2">

            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            {/* FORGOT PASSWORD */}
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setError("");
                setShowForgotPassword(true);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              Forgot Password?
            </button>

          </div>

          <div className="relative">

            <LockKeyhole
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
              className="w-full h-12 pl-11 pr-12 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>

          </div>

        </div>

        {/* REMEMBER ME */}
        <div className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) =>
              setRememberMe(e.target.checked)
            }
            disabled={loading}
            className="w-4 h-4 accent-blue-600"
          />

          <span className="text-sm text-gray-600">
            Remember me
          </span>

        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >

          {loading ? (
            <>
              <Loader2
                size={19}
                className="animate-spin"
              />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={19} />
              Sign In
            </>
          )}

        </button>

      </form>

      {/* DIVIDER */}
      <div className="flex items-center gap-4 my-7">

        <div className="flex-1 h-px bg-gray-200" />

        <span className="text-xs text-gray-400">
          OR
        </span>

        <div className="flex-1 h-px bg-gray-200" />

      </div>

      {/* GOOGLE LOGIN */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-12 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
      >

        <span className="text-lg font-bold">
          G
        </span>

        Continue with Google

      </button>

      {/* FOOTER */}
      <p className="text-center text-xs text-gray-400 mt-8">
        Authorized employees only
      </p>

    </div>
  );
}

export default LoginForm;
