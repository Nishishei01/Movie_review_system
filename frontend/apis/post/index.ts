import { PostProps } from "@/types/post-type";
import { axios } from "@/utils/axios";

export const postApi = {
  create: async (data: PostProps.createPost) => {
    const res = await axios.post('/post', { ...data });
    return res
  }
}