import type { Employee } from "../types/Employee"

interface Props {
  employees: Employee[]
}

function EmployeeTable({ employees }: Props) {
  return (
    <table className="min-w-full bg-white shadow rounded">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Department</th>
          <th className="p-3 text-left">Designation</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Status</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id} className="border-t">
            <td className="p-3">{emp.id}</td>
            <td className="p-3">{emp.name}</td>
            <td className="p-3">{emp.department}</td>
            <td className="p-3">{emp.designation}</td>
            <td className="p-3">{emp.email}</td>
            <td className="p-3">{emp.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default EmployeeTable