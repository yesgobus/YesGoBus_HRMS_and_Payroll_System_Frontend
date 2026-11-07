import { useState } from "react"

function EmploymentInfoForm() {

    const [formData, setFormData] = useState({
        hiringDate: "",
        joiningDate: "",
        salaryStatus: "Active",
        paymentMethod: "Bank Transfer",
        employeeType: "Full Time",
        bankName: "",
        branch: "",
        accountTitle: "",
        branchCode: "",
        accountNumber: "",
        swiftCode: "",
        location: "",
        designation: "",
        department: "",
        cnic: "",
        employeeCode: "",
        separationDate: "",
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
        console.log("Employment Info Saved:", formData)
        alert("Employment info saved successfully ✅")
    }

    return (
        <div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <h2 className="text-lg font-semibold text-gray-800">
                    Employment Information
                </h2>

                <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    Save
                </button>

            </div>

            <div className="grid grid-cols-2 gap-6">

                {/* Hiring Date */}
                <div>
                    <label className="text-sm text-gray-600">Hiring Date</label>
                    <input type="date" name="hiringDate" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                {/* Joining Date */}
                <div>
                    <label className="text-sm text-gray-600">Joining Date</label>
                    <input type="date" name="joiningDate" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                {/* Salary Status */}
                <div>
                    <label className="text-sm text-gray-600">Salary Status</label>
                    <select name="salaryStatus" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2">
                        <option>Active</option>
                        <option>On Hold</option>
                        <option>Stopped</option>
                    </select>
                </div>

                {/* Payment Method */}
                <div>
                    <label className="text-sm text-gray-600">Payment Method</label>
                    <select name="paymentMethod" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2">
                        <option>Bank Transfer</option>
                        <option>Cash</option>
                    </select>
                </div>

                {/* Employee Type */}
                <div>
                    <label className="text-sm text-gray-600">Employee Type</label>
                    <select name="employeeType" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2">
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Contract</option>
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label className="text-sm text-gray-600">Location</label>
                    <input type="text" name="location" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                {/* Designation */}
                <div>
                    <label className="text-sm text-gray-600">Designation</label>
                    <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Designation</option>
                        <option>Android Developer</option>
                        <option>Flutter Developer</option>
                        <option>iOS Developer</option>
                        <option>Backend Developer</option>
                        <option>Frontend Developer</option>
                        <option>Full Stack Developer</option>
                        <option>CEO</option>
                        <option>CTO</option>
                        <option>COO</option>
                        <option>HR Manager</option>
                        <option>Marketing Manager</option>
                        <option>Marketing Head</option>
                    </select>
                </div>

                {/* Department */}
                <div>
                    <label className="text-sm text-gray-600">Department</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Department</option>
                        <option>IT</option>
                        <option>Tech</option>
                        <option>Marketing</option>
                        <option>HR</option>
                        <option>Finance</option>
                        <option>Operations</option>
                    </select>
                </div>

                {/* Employee Code */}
                <div>
                    <label className="text-sm text-gray-600">Employee Code</label>
                    <input type="text" name="employeeCode" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                {/* CNIC */}
                <div>
                    <label className="text-sm text-gray-600">Aadhar Card number</label>
                    <input type="text" name="cnic" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                {/* Bank Section */}
                <div className="col-span-2 mt-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                        Bank Details
                    </h3>
                </div>

                <div>
                    <label className="text-sm text-gray-600">Bank Name</label>
                    <input type="text" name="bankName" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Branch</label>
                    <input type="text" name="branch" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Account Title</label>
                    <input type="text" name="accountTitle" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Branch Code</label>
                    <input type="text" name="branchCode" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Account Number</label>
                    <input type="text" name="accountNumber" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                {/* Separation Date */}
                <div>
                    <label className="text-sm text-gray-600">Separation Date</label>
                    <input type="date" name="separationDate" onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

            </div>

        </div>
    )
}

export default EmploymentInfoForm