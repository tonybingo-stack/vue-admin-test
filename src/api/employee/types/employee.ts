export interface CreateEmployeeRequestData {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
}

export interface UpdateEmployeeRequestData {
  id: string
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
}

export interface GetEmployeeRequestData {
  currentPage: number
  size: number
}

export interface GetEmployeeData {
  id: string
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
}

export interface GetEmployeeOptionData {
  label: string
  value: number
}

export type GetEmployeeResponseData = ApiResponseData<{
  data: GetEmployeeData[]
  company_options: GetEmployeeOptionData[]
  total: number
}>
