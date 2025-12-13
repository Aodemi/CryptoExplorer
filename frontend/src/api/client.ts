import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const instance = axios.create({ baseURL: BASE_URL });

let token: string | null = null;

instance.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  setToken(t: string | null) {
    token = t;
  },
  async post<T = any>(url: string, data?: any): Promise<T> {
    const res = await instance.post(url, data);
    return res.data as T;
  },
  async get<T = any>(url: string): Promise<T> {
    const res = await instance.get(url);
    return res.data as T;
  },
  async delete<T = any>(url: string): Promise<T> {
    const res = await instance.delete(url);
    return res.data as T;
  },
  async patch<T = any>(url: string, data?: any): Promise<T> {
    const res = await instance.patch(url, data);
    return res.data as T;
  },
};
