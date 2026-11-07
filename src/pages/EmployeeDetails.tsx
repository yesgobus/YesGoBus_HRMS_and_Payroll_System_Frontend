import { useState } from "react"
import ProfileSection from "../components/employee/ProfileSection"
import EmployeeInfoForm from "../components/employee/EmployeeInfoForm"
import ContactInfoForm from "../components/employee/ContactInfoForm"
import EmploymentInfoForm from "../components/employee/EmploymentInfoForm"
import PayrollInfoForm from "../components/employee/PayrollInfoForm"
import SecurityForm from "../components/employee/SecurityForm"
import FilesTab from "../components/employee/FilesTab"

function EmployeeDetails() {

    const [activeTab, setActiveTab] = useState("employee")
    // const [image, setImage] = useState<string | null>(null)

    // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0]
    //     if (file) {
    //         const imageUrl = URL.createObjectURL(file)
    //         setImage(imageUrl)
    //     }
    // }

    const tabs = [
        { key: "employee", label: "Employee Info" },
        { key: "contact", label: "Contact Info" },
        { key: "employment", label: "Employment Info" },
        { key: "payroll", label: "Payroll" },
        { key: "security", label: "Security" },
        { key: "files", label: "Files" },
    ]

    return (
        <div className="bg-gray-50 min-h-screen p-6">

            {/* Header */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Employee Details
            </h1>

            <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-4 lg:col-span-3">
                    <ProfileSection />
                </div>

                {/* Details Section */}
                <div className="col-span-9">

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 flex gap-4 overflow-x-auto">

                        {tabs.map((tab) => (

                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition
                
                ${activeTab === tab.key
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }
                `}
                            >
                                {tab.label}
                            </button>

                        ))}

                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-2xl shadow-md p-6 min-h-[300px]">

                        {activeTab === "employee" && <EmployeeInfoForm />}

                        {activeTab === "contact" && <ContactInfoForm />}

                        {activeTab === "employment" && <EmploymentInfoForm />}

                        {activeTab === "payroll" && <PayrollInfoForm />}

                        {activeTab === "security" && <SecurityForm />}

                        {activeTab === "files" && <FilesTab />}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default EmployeeDetails