import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { usePostStore } from "./usePostStore";

let socket: Socket;

export const useSocket = () => {
  const { addPost, updatePost, addComment, addLike, removeLike } = usePostStore();

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    
    socket = io(backendUrl, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.on("post:created", (post) => {
      console.log("post:created", post);
      addPost(post);
    });

    socket.on("post:updated", (post) => {
      console.log("post:updated", post);
      updatePost(post);
    });

    socket.on("comment:created", (comment) => {
      console.log("comment:created", comment);
      addComment(comment);
    });

    socket.on("like:created", (like) => {
      console.log("like:created", like);
      addLike(like);
    });

    socket.on("like:deleted", (like) => {
      console.log("like:deleted", like);
      removeLike(like);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [addPost, updatePost, addComment, addLike, removeLike]);
};
