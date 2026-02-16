"use client";

import { useEffect, useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { PostProps } from "@/types";
import { likeApi } from "@/apis/like";


export default function LikeButton({posts}: {posts: PostProps.PostType} ) {
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const currentUserString = localStorage.getItem('user-storage');
    if (!currentUserString) return;

    try {
      const currentUserObj = JSON.parse(currentUserString as string);
      const id = currentUserObj.state?.userData?.id; 
      if (id) {
        setCurrentUserId(id);
      }
    } catch (e) {
      console.error("Parse user storage error", e);
    }
  }, []);

  const liked = currentUserId ? posts.likes.some((l) => l.userID === currentUserId) : false;
  const myLike = currentUserId ? posts.likes.find((l) => l.userID === currentUserId) : null;
  const count = posts.likes.length;

  const toggleLike = async () => {
    if (!currentUserId) return;
    
    try {
      if (liked && myLike) {
        await likeApi.delete(myLike.id)
      } else {
        await likeApi.create({ postID: posts.id})
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`
        flex items-center gap-1 transition ${
        liked ? "text-red-500" : "text-gray-500"
      } hover:scale-105 cursor-pointer
      `}
    >
      {liked ? (
        <HeartSolid className="w-5 h-5" />
      ) : (
        <HeartOutline className="w-5 h-5" />
      )}
      <span>{count}</span>
    </button>
  );
}
