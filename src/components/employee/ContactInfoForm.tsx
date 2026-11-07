import { useState } from "react"

function ContactInfoForm() {

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    workPhone: "",
    emergencyName: "",
    emergencyPhone: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    console.log("Contact Info Saved:", formData)
    alert("Contact info saved successfully ✅")
  }

  return (
    <div>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold text-gray-800">
          Contact Information
        </h2>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Save
        </button>

      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-6">

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">
            Contact Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">
            Email ID
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Work Number */}
        <div>
          <label className="text-sm text-gray-600">
            Work Number
          </label>
          <input
            type="text"
            name="workPhone"
            value={formData.workPhone}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Emergency Name */}
        <div>
          <label className="text-sm text-gray-600">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergencyName"
            value={formData.emergencyName}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Emergency Phone */}
        <div>
          <label className="text-sm text-gray-600">
            Emergency Contact Number
          </label>
          <input
            type="text"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

      </div>

    </div>
  )
}

export default ContactInfoForm