import { Clock, LogIn, LogOut, CheckCircle } from "lucide-react"

function AttendanceCard() {

  const attendance = {
    checkIn: "09:02 AM",
    checkOut: "--",
    workingHours: "4h 20m",
    status: "Present"
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Attendance Summary
      </h2>

      <div className="space-y-4">

        {/* Check In */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-gray-600">
            <LogIn size={18} />
            <span>Check In</span>
          </div>

          <span className="font-medium text-gray-800">
            {attendance.checkIn}
          </span>

        </div>

        {/* Check Out */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-gray-600">
            <LogOut size={18} />
            <span>Check Out</span>
          </div>

          <span className="font-medium text-gray-800">
            {attendance.checkOut}
          </span>

        </div>

        {/* Working Hours */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span>Working Hours</span>
          </div>

          <span className="font-medium text-gray-800">
            {attendance.workingHours}
          </span>

        </div>

        {/* Status */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle size={18} />
            <span>Status</span>
          </div>

          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium">
            {attendance.status}
          </span>

        </div>

      </div>

    </div>
  )
}

export default AttendanceCard