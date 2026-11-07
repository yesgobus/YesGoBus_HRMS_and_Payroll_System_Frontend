import { useState } from "react"

function EmployeeInfoForm() {

  const [formData, setFormData] = useState({
    name: "Purnima",
    gender: "Female",
    dob: "",
    place: "",
    postalCode: "",
    country: "India",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    console.log("Saved Data:", formData)
    alert("Employee info saved successfully ✅")
  }

  return (
    <div>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold text-gray-800">
          Employee Information
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

        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm text-gray-600">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm text-gray-600">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Place */}
        <div>
          <label className="text-sm text-gray-600">Place</label>
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="text-sm text-gray-600">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Country */}
        <div>
          <label className="text-sm text-gray-600">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

      </div>

    </div>
  )
}

export default EmployeeInfoForm