import { request } from "@/utils/service"
import type * as Company from "./types/company"
import axios from "axios";
import { getToken } from "@/utils/cache/cookies"

export function createCompanyDataApi(data: Company.CreateCompanyRequestData) {
  const config = {
      headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Access-Control-Allow-Origin": "*"
      },
  };
  let formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("logo", data.logo);
  formData.append("website", data.website);
  const baseURL = import.meta.env.VITE_BASE_API;
  return axios.post(`${baseURL}/company`, formData, config);
}

export function deleteCompanyDataApi(id: string) {
  return request({
    url: `company/${id}`,
    method: "delete"
  })
}

export function updateCompanyDataApi(data: Company.UpdateCompanyRequestData) {
  const config = {
      headers: {
          "Authorization": `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
      },
  };
  let formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("logo", data.logo);
  formData.append("website", data.website);  
  const baseURL = import.meta.env.VITE_BASE_API;
  return axios.post(`${baseURL}/company/${data.id}`, formData, config);
}

export function getCompanyDataApi(params: Company.GetCompanyRequestData) {
  return request<Company.GetCompanyResponseData>({
    url: "company",
    method: "get",
    params
  })
}
