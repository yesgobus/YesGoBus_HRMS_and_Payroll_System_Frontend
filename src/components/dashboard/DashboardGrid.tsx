interface Props {
  children: React.ReactNode
}

function DashboardGrid({ children }: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6 mt-4 lg:mt-6">
      {children}
    </div>
  )
}

export default DashboardGrid