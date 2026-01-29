import { axios } from "@/utils/axios"

export const movieApi = {
  searchMovie: async (params: { query: string }) => {
    const res = await axios.get('/movie/search', {
      params
    })
    
    return res
  }
}