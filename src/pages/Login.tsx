import LoginForm from "../components/auth/LoginForm"

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 flex items-center justify-center p-4">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex-col justify-between">

          <div>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">

              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">

                <span className="text-blue-600 text-2xl font-bold">
                  R
                </span>

              </div>

              <div>

                <h1 className="text-xl font-bold">
                  RambleHR
                </h1>

                <p className="text-blue-100 text-sm">
                  Transport Pvt Ltd
                </p>

              </div>

            </div>

            {/* Heading */}
            <h2 className="text-4xl font-bold leading-tight mb-5">
              Manage your workforce
              <br />
              smarter.
            </h2>

            <p className="text-blue-100 leading-7 max-w-md">
              Manage employees, attendance, leave, payroll and
              company operations from one simple HR platform.
            </p>

          </div>

          {/* Footer */}
          <p className="text-sm text-blue-200">
            © 2026 RambleHR. All rights reserved.
          </p>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="p-8 sm:p-10 md:p-12 flex items-center">

          <div className="w-full">

            {/* Mobile Logo */}
            <div className="flex md:hidden items-center gap-3 mb-8">

              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">

                <span className="text-white text-xl font-bold">
                  R
                </span>

              </div>

              <div>

                <h1 className="text-xl font-bold text-gray-800">
                  RambleHR
                </h1>

                <p className="text-sm text-gray-500">
                  Transport Pvt Ltd
                </p>

              </div>

            </div>

            <LoginForm />

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login