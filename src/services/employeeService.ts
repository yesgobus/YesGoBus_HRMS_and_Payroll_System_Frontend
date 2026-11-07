import { API_BASE_URL } from "../config/api"

export interface Employee {
  employee_id: string | null
  name: string
  gender: string | null
  contact_details: string | null
  doj: string | null
  job_title: string | null
  email: string | null
  department: string | null
  designation: string | null
  reporting_manager_id: string | null
  status: string | null
}

export interface TeamResponse {
  success: boolean
  managerId: string
  count: number
  employees: Employee[]
}

export const getEmployeeTeam = async (
  employeeId: string
): Promise<TeamResponse> => {
  const response = await fetch(
    `${API_BASE_URL}employees/${employeeId}/team`
  )

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to fetch employee team"
    )
  }

  return data
}