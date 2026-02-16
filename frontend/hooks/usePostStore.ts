import { create } from "zustand";
import { PostProps } from "@/types";

interface PostState {
  posts: PostProps.PostType[];
  
  setPosts: (posts: PostProps.PostType[]) => void;
  addPost: (post: PostProps.PostType) => void;
  updatePost: (post: PostProps.PostType) => void;
  deletePost: (postId: string) => void;
  addComment: (comment: PostProps.Comment) => void;
  addLike: (like: PostProps.Like) => void;
  removeLike: (like: PostProps.Like) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],

  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),

  updatePost: (updatedPost) => set((state) => ({
    posts: state.posts.map((post) => 
      post.id === updatedPost.id ? { ...post, ...updatedPost } : post
    )
  })),

  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== postId)
  })),

  addComment: (comment) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === comment.postID ? { ...post, comments: [...post.comments, comment] } : post
    ),
  })),

  addLike: (like) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === like.postID ? { ...post, likes: [...(post.likes || []), like] } : post
    ),
  })),

  removeLike: (like) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === like.postID ? { ...post, likes: post.likes.filter((l) => l.id !== like.id) } : post
    ),
  })),
}));
