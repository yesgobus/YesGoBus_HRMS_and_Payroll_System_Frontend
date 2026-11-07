import { API_BASE_URL } from "../config/api"

export interface LoggedInEmployee {
  id: number
  employee_id: string
  name: string
  email: string
  department: string | null
  designation: string | null
  job_title: string | null
  role: string
  reporting_manager_id: string | null
  status: string
}

export interface VisibleEmployee {
  employee_id: string
  name: string
  email: string
  department: string | null
  designation: string | null
  job_title: string | null
  role: string
  reporting_manager_id: string | null
  status: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  employee: LoggedInEmployee
  role: string
  visibleEmployees: VisibleEmployee[]
}

export const loginUser = async (
  employeeId: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(
    `${API_BASE_URL}auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId,
        password,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Invalid Employee ID or Password"
    )
  }

  return data
}