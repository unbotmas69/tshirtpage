import axios from "axios";
import { BASE_URL } from "@/api/constants";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const request = async ({ url, method, data, params, headers }) => {
    try {
      const response = await instance({
        url,
        method,
        data,
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("HTTP Error:", error.response?.data || error.message);
      throw error;
    }
  };
  

export default request;
