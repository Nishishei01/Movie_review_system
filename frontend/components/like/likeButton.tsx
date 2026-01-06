"use client";

import { useEffect, useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { PostProps } from "@/types";
import { likeApi } from "@/apis/like";


export default function LikeButton({posts}: {posts: PostProps.PostType} ) {
  
  
  const [currentUserId, setCurrentUserId] = useState();

  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState<string | undefined>();
  const [count, setCount] = useState(posts.likes.length);
  
  useEffect(() => {
    const currentUserString = localStorage.getItem('user-storage');
    if (!currentUserString) return;

    const currentUserObj = JSON.parse(currentUserString as string);
    
    const currentUserId = currentUserObj.state.userData.id

    if (currentUserId) {
      setCurrentUserId(currentUserId);

      const myLike = posts.likes.find((l) => l.userID === currentUserId);
      setLiked(!!myLike);
      setLikeId(myLike?.id);
    }
  }, [posts.likes])

  const toggleLike = async () => {
    
    if (!currentUserId) return;
    
    try {
      if (liked && likeId) {
        await likeApi.delete(likeId)
        setLiked(false);
        setLikeId(undefined);
        setCount((c) => c - 1);
      } else {
        const res = await likeApi.create({ postID: posts.id})
        setLiked(true);
        setLikeId(res.data.result.id);
        setCount((c) => c + 1);
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
