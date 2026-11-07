import { useState } from "react"
import { Megaphone, PartyPopper, AlertCircle } from "lucide-react"
import NewsModal from "./NewsModal"

function NewsCard() {

  const [selectedNews, setSelectedNews] = useState<any>(null)

  const news = [
    {
      title: "New HR Policy Updated",
      date: "12 Mar 2026",
      description: "We have updated our HR policies. Please review the latest guidelines regarding attendance and leave.",
      icon: Megaphone,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "Team Outing This Friday",
      date: "10 Mar 2026",
      description: "Join us for a fun team outing this Friday. Activities and lunch will be provided.",
      icon: PartyPopper,
      color: "text-green-600 bg-green-100"
    },
    {
      title: "Office Closed on Monday",
      date: "08 Mar 2026",
      description: "The office will remain closed due to a public holiday. Plan your work accordingly.",
      icon: AlertCircle,
      color: "text-red-600 bg-red-100"
    }
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-semibold text-gray-800">
          News & Events
        </h2>

        <button className="text-sm text-blue-600 hover:underline">
          View All →
        </button>

      </div>

      <div className="space-y-4">

        {news.map((item, index) => {

          const Icon = item.icon

          return (
            <div
              key={index}
              onClick={() => setSelectedNews(item)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >

              {/* Icon */}
              <div className={`p-2 rounded-lg ${item.color}`}>
                <Icon size={18} />
              </div>

              {/* Content */}
              <div className="flex-1">

                <p className="text-sm font-medium text-gray-800">
                  {item.title}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {item.date}
                </p>

              </div>

            </div>
          )
        })}

      </div>

      {/* Modal */}
      <NewsModal
        open={!!selectedNews}
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
      />

    </div>
  )
}

export default NewsCard