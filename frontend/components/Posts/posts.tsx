"use client";

// import { PostProps } from "@/types";
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
import PostSelected from "./postSelected";

export default function Posts() {
  const { posts, setPosts } = usePostStore();
  const [loading, setLoading] = useState(true);
  
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const selectedPost = posts.find(p => p.id === selectedPostId) || null;

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

  // console.log(`selectedPost: ${selectedPost}`)

  // console.log(`post: ${JSON.stringify(posts)}`)
  
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
                {/* <Image
                  src="/images/user.jpg"
                  alt="User Profile"
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                /> */}
                <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shrink-0 overflow-hidden shadow-inner flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                    {post.userPost.firstName?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.userPost.firstName} {post.userPost.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
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
                onClick={() => setSelectedPostId(post.id)}
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
        <PostSelected post={selectedPost} onClose={() => setSelectedPostId(null)} />
      )}
    </>
  );
}