import { CommentProps } from "@/types/comment-type";
import { axios } from "@/utils/axios";

export const commentApi = {
  create: async (data: CommentProps.CreateType) => {
    const res = await axios.post('/comment', { ...data });
    return res
  }
}