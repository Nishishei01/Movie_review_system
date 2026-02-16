"use client";

import { PostProps } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import CommentPreview from "../comment/commentPreview";
import PostContent from "./postContent";
import LikeButton from "../like/likeButton";
import CommentInput from "../comment/commentInput";
import { axios } from "@/utils/axios";
import { useAuth } from "@/hooks/useAuth";
import { usePostStore } from "@/hooks/usePostStore";
import { useSocket } from "@/hooks/useSocket";

export default function Posts() {
  const { posts, setPosts } = usePostStore();
  const [loading, setLoading] = useState(true);
  
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);

  const [selectedPost, setSelectedPost] = useState<PostProps.PostType | null>(null);

  const isAuthReady = useAuth((s) => s.isAuthReady);
  
  useSocket();

  useEffect(() => {
    if (!isAuthReady) return;

    const fetchPosts = async () => {
      try {
        const res = await axios.get("/post");
        setPosts(res.data.result);
      } catch (error) {
        console.error("Fetch posts failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthReady, setPosts]);

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedPost]);

  if (loading) {
    return <p className="mt-10 text-gray-500">Loading posts...</p>;
  }

  return (
    <>
      {/* --- Main Feed --- */}
      <div className="flex flex-col items-center gap-6 my-5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-[0_0_15px] hover:shadow-violet-700/25 transition"
          >
            {/* ... (User Info ส่วนเดิม) ... */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/user.jpg"
                  alt="User Profile"
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.userPost.firstName} {post.userPost.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 pb-3">
              <PostContent content={post.content} />
            </div>

            <div className="border-t border-gray-100">
              <div className="px-5 py-3">
                <p className="text-sm text-gray-600">
                  🎬 <span className="font-medium">{post.movie.movieName}</span>
                </p>
              </div>

              <div 
                className="relative w-full aspect-[16/9] cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${post.movie.movieImage}`}
                  alt={post.movie.movieName}
                  fill
                  className="object-cover group-hover:brightness-90 transition"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
              </div>

              <div className="px-5 py-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  เรื่องย่อ: {post.movie.overview}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 px-5 py-3 border-t border-gray-100 text-sm text-gray-600">
              <LikeButton posts={post} />
              <span
                className="cursor-pointer hover:text-violet-600"
                onClick={() =>
                  setOpenCommentPostId(
                    openCommentPostId === post.id ? null : post.id
                  )
                }
              >
                💬 Comments: {post.comments.length}
              </span>
            </div>

            {openCommentPostId === post.id && (
              <CommentInput posts={post} />
            )}

            <CommentPreview comments={post.comments} />
          </div>
        ))}
      </div>

      {selectedPost && (
        <div 
          className="fixed inset-0 z-[9999] flex bg-black/95 animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <button 
            className="absolute top-4 left-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPost(null);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div 
            className="flex w-full h-full max-w-[1920px] mx-auto"
            onClick={(e) => e.stopPropagation()} 
          >
            
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
               <Image
                  src={`https://image.tmdb.org/t/p/original${selectedPost.movie.movieImage}`}
                  alt="Full view"
                  fill
                  className="object-contain"
                  quality={100}
                  priority
               />
            </div>

            <div className="hidden md:flex w-[400px] lg:w-[500px] bg-white flex-col h-full border-l border-gray-800">
              
              <div className="p-4 border-b flex items-center gap-3 bg-white shrink-0">
                <Image
                  src="/images/user.jpg"
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {selectedPost.userPost.firstName} {selectedPost.userPost.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedPost.createdAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              
                <div className="mb-4">
                   <PostContent content={selectedPost.content} />
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                   <p className="font-bold mb-1">🎬 {selectedPost.movie.movieName}</p>
                   <p className="text-gray-600">{selectedPost.movie.overview}</p>
                </div>

                <hr className="my-4 border-gray-100" />

                <div>
                  <p className="text-sm font-semibold mb-3">Comments ({selectedPost.comments.length})</p>
                  <div className="space-y-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                         <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0 overflow-hidden">
                         </div>
                         <div className="flex-1">
                            <div className="bg-gray-100 px-3 py-2 rounded-2xl inline-block">
                               <p className="text-xs font-bold">{comment.userComment?.firstName || 'User'}</p>
                               <p className="text-sm">{comment.comment}</p>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 pl-1">• {new Date(comment.createdAt).toLocaleTimeString()}</p>
                         </div>
                      </div>
                    ))}
                    {selectedPost.comments.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">No comments yet.</p>
                    )}
                  </div>
                </div>

              </div>

              <div className="p-3 border-t bg-white shrink-0">
                <div className="mb-2 px-1">
                   <LikeButton posts={selectedPost} />
                </div>
                <CommentInput posts={selectedPost} />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}