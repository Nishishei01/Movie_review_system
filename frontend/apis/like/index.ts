import { axios } from "@/utils/axios";
import { LikeProps } from "@/types";

export const likeApi = {
  create: async (data: LikeProps.createLike) => {
    const res = await axios.post('/like', { ...data })
    return res
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/like/${id}`)
    return res
  }
}