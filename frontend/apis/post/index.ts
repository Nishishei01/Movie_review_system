import { PostProps } from "@/types/post-type";
import { axios } from "@/utils/axios";

export const postApi = {
  create: async (data: PostProps.createPost) => {
    const res = await axios.post('/post', { ...data });
    return res
  },
  getPostByUserId: async (id: string, page: number = 0, rowsPerPage: number = 5) => {
    const res = await axios.get(`/post/user/${id}?page=${page}&rowsPerPage=${rowsPerPage}`);
    return res;
  },
  getAllPost: async (page: number = 0, rowsPerPage: number = 5) => {
    const res = await axios.get(`/post?page=${page}&rowsPerPage=${rowsPerPage}`);
    return res;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/post/${id}`);
    return res;
  }
}