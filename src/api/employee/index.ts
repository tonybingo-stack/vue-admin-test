import { request } from "@/utils/service"
import type * as Employee from "./types/employee"
import axios from "axios";
import { getToken } from "@/utils/cache/cookies"

export function createEmployeeDataApi(data: Employee.CreateEmployeeRequestData) {
  return request({
    url: "/employee",
    method: "post",
    data
  })
}

export function deleteEmployeeDataApi(id: string) {
  return request({
    url: `employee/${id}`,
    method: "delete"
  })
}

export function updateEmployeeDataApi(data: Employee.UpdateEmployeeRequestData) {
  const config = {
      headers: {
          "Authorization": `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
      },
  };
  let formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("company", data.company);
  formData.append("email", data.email);  
  formData.append("phone", data.phone);  
  const baseURL = import.meta.env.VITE_BASE_API;
  return axios.post(`${baseURL}/employee/${data.id}`, formData, config);
}

export function getEmployeeDataApi(params: Employee.GetEmployeeRequestData) {
  return request<Company.GetCompanyResponseData>({
    url: "employee",
    method: "get",
    params
  })
}
