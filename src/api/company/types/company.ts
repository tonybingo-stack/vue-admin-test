export interface CreateCompanyRequestData {
  name: string
  email: string
  logo: File
  website: string
}

export interface UpdateCompanyRequestData {
  id: string
  name: string
  email: string
  logo: File
  website: string
}

export interface GetCompanyRequestData {
  currentPage: number
  size: number
}

export interface GetCompanyData {
  id: string
  name: string
  email: string
  logo: File
  website: string
}

export type GetCompanyResponseData = ApiResponseData<{
  data: GetCompanyData[]
  total: number
}>
