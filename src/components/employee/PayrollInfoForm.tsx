import { useState } from "react"

function PayrollInfoForm() {

  const [formData, setFormData] = useState({
    pfType: "",
    pfEmployer: "",
    pfEmployee: "",

    ssesType: "",
    ssesEmployer: "",
    ssesEmployee: "",

    eobiType: "",
    eobiEmployer: "",
    eobiEmployee: "",
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
    console.log("Payroll Info:", formData)
    alert("Payroll info saved successfully ✅")
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold text-gray-800">
          Payroll Information
        </h2>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Save
        </button>

      </div>

      <div className="space-y-8">

        {/* PF Section */}
        <div className="bg-white border rounded-xl p-4">

          <h3 className="font-semibold text-gray-700 mb-4">
            Provident Fund (PF)
          </h3>

          <div className="grid grid-cols-3 gap-4">

            <select name="pfType" onChange={handleChange} className="border p-2 rounded-lg">
              <option value="">Type</option>
              <option>Fixed</option>
              <option>Percentage</option>
            </select>

            <input
              type="text"
              name="pfEmployer"
              placeholder="Employer Contribution"
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              name="pfEmployee"
              placeholder="Employee Contribution"
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

          </div>

        </div>

        {/* SSES Section */}
        <div className="bg-white border rounded-xl p-4">

          <h3 className="font-semibold text-gray-700 mb-4">
            SSES
          </h3>

          <div className="grid grid-cols-3 gap-4">

            <select name="ssesType" onChange={handleChange} className="border p-2 rounded-lg">
              <option value="">Type</option>
              <option>Fixed</option>
              <option>Percentage</option>
            </select>

            <input
              type="text"
              name="ssesEmployer"
              placeholder="Employer Contribution"
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              name="ssesEmployee"
              placeholder="Employee Contribution"
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

          </div>

        </div>

        {/* EOBI Section */}
        <div className="bg-white border rounded-xl p-4">

          <h3 className="font-semibold text-gray-700 mb-4">
            EOBI
          </h3>

          <div className="grid grid-cols-3 gap-4">

            <select name="eobiType" onChange={handleChange} className="border p-2 rounded-lg">
              <option value="">Type</option>
              <option>Fixed</option>
              <option>Percentage</option>
            </select>

            <input
              type="text"
              name="eobiEmployer"
              placeholder="Employer Contribution"
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              name="eobiEmployee"
              placeholder="Employee Contribution"
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

          </div>

        </div>

      </div>

    </div>
  )
}

export default PayrollInfoForm