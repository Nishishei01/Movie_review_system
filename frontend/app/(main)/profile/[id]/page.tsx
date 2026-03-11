"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authApi } from "@/apis/auth";
import { postApi } from "@/apis/post";
import Image from "next/image";
import PostContent from "@/components/Posts/postContent";
import LikeButton from "@/components/like/likeButton";
import CommentPreview from "@/components/comment/commentPreview";
import CommentInput from "@/components/comment/commentInput";
import PostSelected from "@/components/Posts/postSelected";
import { PostProps } from "@/types/post-type";
import { AuthProps } from "@/types/auth-type";
import { useUser } from "@/hooks/useUser";
import { TrashIcon } from "@heroicons/react/24/outline";


export default function ProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { userData } = useUser();
  
  const [user, setUser] = useState<AuthProps.UserProfile | null>(null);
  const [posts, setPosts] = useState<PostProps.PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const rowsPerPage = 5;

  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const selectedPost = posts.find(p => p.id === selectedPostId) || null;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const userRes = await authApi.getUserById(id);
        setUser(userRes.data.result);


        const postsRes = await postApi.getPostByUserId(id, 0, rowsPerPage);
        const newPosts = postsRes.data.result || [];
        setPosts(newPosts);
        setPage(0);
        
        if (newPosts.length === rowsPerPage) {
          const checkMoreRes = await postApi.getPostByUserId(id, 1, rowsPerPage);
          setHasMore((checkMoreRes.data.result || []).length > 0);
        } else {
          setHasMore(false);
        }
        
      } catch (err) {
        console.error("Error fetching profile data", err);
        setError("User not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfileData();
    }
  }, [id]);

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const postsRes = await postApi.getPostByUserId(id, nextPage, rowsPerPage);
      const newPosts = postsRes.data.result || [];
      
      if (newPosts.length > 0) {
        const existingIds = new Set(posts.map(p => p.id));
        const uniqueNewPosts = newPosts.filter((p: { id: string; }) => !existingIds.has(p.id));
        setPosts([...posts, ...uniqueNewPosts]);
        setPage(nextPage);

        if (newPosts.length === rowsPerPage) {
          const checkMoreRes = await postApi.getPostByUserId(id, nextPage + 1, rowsPerPage);
          setHasMore((checkMoreRes.data.result || []).length > 0);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Load more posts failed", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?")) return;

    try {
      await postApi.delete(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post", err);
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

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  if (error || !user) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error || "User not found"}</p>
        <button onClick={() => router.push("/")} className="mt-4 text-violet-600 hover:underline cursor-pointer">
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full shrink-0 shadow-inner flex items-center justify-center text-white font-bold text-4xl uppercase">
          {user.firstName?.[0] || 'U'}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500 mt-1 mb-2">@{user.username}</p>
          <div className="text-sm text-gray-600">
            <span className="font-semibold block md:inline">Email:</span> {user.email}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-semibold block md:inline">Joined:</span> {new Date(user.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Posts ({posts.length})</h2>
      
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-white rounded-2xl border border-gray-200">
          This user hasn&apos;t posted anything yet.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-[0_0_15px] hover:shadow-violet-700/25 transition"
            >
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full shrink-0 overflow-hidden shadow-inner flex items-center justify-center text-white font-bold text-xs uppercase">
                      {post.userPost?.firstName?.[0] || user.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {post.userPost?.firstName || user.firstName} {post.userPost?.lastName || user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
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
                    🎬 <span className="font-medium">{post.movie?.movieName}</span>
                  </p>
                </div>

                <div 
                  className="relative w-full aspect-[16/9] cursor-pointer group"
                  onClick={() => setSelectedPostId(post.id)}
                >
                  {post.movie?.movieImage && (
                    <Image
                      src={
                        post.movie.movieImage.startsWith("http")
                          ? "/images/noImage.png"
                          : `https://image.tmdb.org/t/p/original${post.movie.movieImage}`
                      }
                      alt={post.movie?.movieName || 'Movie Cover'}
                      fill
                      className="object-cover group-hover:brightness-90 transition"
                      sizes="(max-width: 768px) 100vw, 640px"
                    />
                  )}
                </div>

                <div className="px-5 py-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    เรื่องย่อ: {post.movie?.overview}
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
                  💬 Comments: {post.comments?.length || 0}
                </span>
              </div>

              {openCommentPostId === post.id && (
                <CommentInput posts={post} />
              )}

              <CommentPreview comments={post.comments || []} />
            </div>
          ))}
        </div>
      )}

      {/* --- Load More Button --- */}
      {posts.length > 0 && hasMore && (
        <div className="flex justify-center my-6 pb-6 mt-6">
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
    </div>
  );
}
