interface Props {
  title: string
  children: React.ReactNode
}

function DashboardCard({ title, children }: Props) {
  return (
   <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition">

      {/* Card Title */}
      <h3 className="text-lg font-semibold mb-4">
        {title}
      </h3>

      {/* Card Content */}
      <div>
        {children}
      </div>

    </div>
  )
}

export default DashboardCard