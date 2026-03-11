"use client";

// import { PostProps } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CommentPreview from "../comment/commentPreview";
import PostContent from "./postContent";
import LikeButton from "../like/likeButton";
import CommentInput from "../comment/commentInput";
import { useAuth } from "@/hooks/useAuth";
import { usePostStore } from "@/hooks/usePostStore";
import { useSocket } from "@/hooks/useSocket";
import PostSelected from "./postSelected";
import { useUser } from "@/hooks/useUser";
import { postApi } from "@/apis/post";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Posts() {
  const { posts, setPosts } = usePostStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const rowsPerPage = 5;
  
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const selectedPost = posts.find(p => p.id === selectedPostId) || null;

  const isAuthReady = useAuth((s) => s.isAuthReady);
  const { userData } = useUser();
  
  useSocket();

  useEffect(() => {
    if (!isAuthReady) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await postApi.getAllPost(0, rowsPerPage);
        const newPosts = res.data.result || [];
        setPosts(newPosts);
        setPage(0);
        
        if (newPosts.length === rowsPerPage) {
          const checkMoreRes = await postApi.getAllPost(1, rowsPerPage);
          setHasMore((checkMoreRes.data.result || []).length > 0);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Fetch posts failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthReady, setPosts]);

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await postApi.getAllPost(nextPage, rowsPerPage);
      const newPosts = res.data.result || [];
      
      if (newPosts.length > 0) {
        const existingIds = new Set(posts.map((p: { id: string; }) => p.id));
        const uniqueNewPosts = newPosts.filter((p: { id: string; }) => !existingIds.has(p.id));
        setPosts([...posts, ...uniqueNewPosts]);
        setPage(nextPage);

        if (newPosts.length === rowsPerPage) {
          const checkMoreRes = await postApi.getAllPost(nextPage + 1, rowsPerPage);
          setHasMore((checkMoreRes.data.result || []).length > 0);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Load more posts failed", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?")) return;

    try {
      await postApi.delete(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("เกิดข้อผิดพลาดในการลบโพสต์");
    }
  };
  
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedPost]);

  if (loading && page === 0) {
    return <p className="mt-10 text-gray-500 text-center">Loading posts...</p>;
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
                <Link href={`/profile/${post.userID}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full shrink-0 overflow-hidden shadow-inner flex items-center justify-center text-white font-bold text-xs uppercase group-hover:ring-2 group-hover:ring-violet-400 transition">
                      {post.userPost.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-violet-600 transition">
                      {post.userPost.firstName} {post.userPost.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </Link>
                {userData?.id === post.userID && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.id);
                    }} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                    title="ลบโพสต์"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
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
                  src={
                    post.movie.movieImage.startsWith("http")
                      ? "/images/noImage.png"
                      : `https://image.tmdb.org/t/p/original${post.movie.movieImage}`
                  }
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

      {/* --- Load More Button --- */}
      {posts.length > 0 && hasMore && (
        <div className="flex justify-center my-6 pb-6">
          <button
            onClick={loadMorePosts}
            disabled={isLoadingMore}
            className={`px-6 py-2 rounded-full font-medium transition ${
              isLoadingMore
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200 hover:shadow-md"
            }`}
          >
            {isLoadingMore ? "กำลังโหลด..." : "โหลดโพสต์เพิ่มเติม"}
          </button>
        </div>
      )}

      {selectedPost && (
        <PostSelected post={selectedPost} onClose={() => setSelectedPostId(null)} />
      )}
    </>
  );
}