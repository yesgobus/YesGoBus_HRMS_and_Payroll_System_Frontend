import { CalendarDays } from "lucide-react"

function HolidaysCard() {

  const holidays = [
    {
      date: "15",
      month: "Aug",
      name: "Independence Day",
      day: "Friday"
    },
    {
      date: "02",
      month: "Oct",
      name: "Gandhi Jayanti",
      day: "Wednesday"
    },
    {
      date: "25",
      month: "Dec",
      name: "Christmas",
      day: "Wednesday"
    }
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">

      {/* Title */}
      <div className="flex items-center gap-2 mb-4">

        <CalendarDays size={20} className="text-blue-500" />

        <h2 className="text-lg font-semibold text-gray-800">
          Upcoming Holidays
        </h2>

      </div>

      <div className="space-y-1">

        {holidays.map((holiday, index) => (

          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
          >

            {/* Date Box */}
            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-lg flex flex-col items-center justify-center">

              <span className="text-sm font-semibold">
                {holiday.date}
              </span>

              <span className="text-xs">
                {holiday.month}
              </span>

            </div>

            {/* Holiday Info */}
            <div className="flex-1">

              <p className="text-sm font-medium text-gray-800">
                {holiday.name}
              </p>

              <p className="text-xs text-gray-500">
                {holiday.day}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default HolidaysCard