import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"

function SecurityForm() {

  const [formData, setFormData] = useState({
    username: "purnima123",
    email: "purnima@gmail.com",
    password: "",
    role: "Employee",
    status: "Active",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    console.log("Security Data:", formData)
    alert("Security settings saved ✅")
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold text-gray-800">
          Security Settings
        </h2>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Save
        </button>

      </div>

      <div className="space-y-8">

        {/* Account Info */}
        <div className="bg-white border rounded-xl p-5">

          <h3 className="font-semibold text-gray-700 mb-4">
            Account Information
          </h3>

          <div className="grid grid-cols-2 gap-6">

            {/* Username */}
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            {/* Password */}
            <div className="col-span-2">
              <label className="text-sm text-gray-600">
                Change Password
              </label>

              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">

                <Lock size={16} className="text-gray-400 mr-2" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full outline-none"
                />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Role & Access */}
        <div className="bg-white border rounded-xl p-5">

          <h3 className="font-semibold text-gray-700 mb-4">
            Role & Access
          </h3>

          <div className="grid grid-cols-2 gap-6">

            {/* Role */}
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              >
                <option>Employee</option>
                <option>Manager</option>
                <option>HR</option>
                <option>Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-600">Account Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>

          </div>

        </div>

        {/* Last Login */}
        <div className="bg-white border rounded-xl p-5">

          <h3 className="font-semibold text-gray-700 mb-2">
            Activity
          </h3>

          <p className="text-sm text-gray-500">
            Last Login: 21 Mar 2026, 10:30 AM
          </p>

        </div>

      </div>

    </div>
  )
}

export default SecurityForm