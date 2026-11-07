interface Props {
  open: boolean
  onClose: () => void
  news: any
}

function NewsModal({ open, onClose, news }: Props) {

  if (!open || !news) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl">

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {news.title}
        </h2>

        <p className="text-xs text-gray-500 mb-4">
          {news.date}
        </p>

        <p className="text-sm text-gray-700 mb-6">
          {news.description}
        </p>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Close
        </button>

      </div>

    </div>
  )
}

export default NewsModal