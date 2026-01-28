import { AuthProps } from "@/types";
import { axios } from "@/utils/axios"

export const authApi = {
  login: async (data: AuthProps.LoginType) => {
    const res = await axios.post('/auth/login', { ...data })
    return res
  },
  logout: async () => {
    const res = await axios.get('/auth/logout')
    return res
  },
  register: async (data: AuthProps.RegisterType) => {
    const res = await axios.post('/auth/register', {...data})
    return res
  },
  searchUser: async (params: { query: string }) => {
    const res = await axios.get('/auth/search/user', {
      params
    })
    return res
  }
}