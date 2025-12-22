"use client"

import { PostProps } from "@/types"
import { useState } from "react"
import Image from 'next/image'
import CommentPreview from "../comment/commentPreview";
import PostContent from "./postContent";
import LikeButton from "../like/likeButton";
import CommentInput from "../comment/commentInput";

export default function Posts({posts}: {posts: PostProps.PostType[]}) {
  const [postsList] = useState(posts);
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);

  return(
    <div className="flex flex-col items-center gap-6 my-5">
      {
        postsList.map((post) => {
          
        return (
          <div 
            key={post.id} 
            className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-[0_0_15px] hover:shadow-violet-700/25 transition"
          >

            {/* User Info */}
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

            {/* Post Content */}
            <div className="px-5 pb-3">
              {/* <p className="text-gray-800 leading-relaxed">
                {post.content}
              </p> */}
              <PostContent content={post.content} />
            </div>

            {/* Movie Section */}
            <div className="border-t border-gray-100">
              <div className="px-5 py-3">
                <p className="text-sm text-gray-600">
                  🎬 <span className="font-medium">{post.movie.movieName}</span>
                </p>
              </div>

              <div className="relative w-full aspect-[16/9]">
                <Image 
                  src={`https://image.tmdb.org/t/p/original${post.movie.movieImage}`}
                  alt={post.movie.movieName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 640px"
                  priority={false}
                />                
              </div>

              <div className="px-5 py-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {`เรื่องย่อ: ${post.movie.overview}`}
                </p>
              </div>

            </div>

            {/* Like & Comment */}
            <div className="flex items-center gap-6 px-5 py-3 border-t border-gray-100 text-sm text-gray-600">
              <LikeButton
                posts={post}
              />
              <span 
                className="cursor-pointer hover:text-violet-600"
                onClick={() => 
                  setOpenCommentPostId(
                    openCommentPostId === post.id ? null : post.id
                  )
                }
              >
                💬 Comments: {post.comments.length || 0}
                </span>
            </div>
            {
              openCommentPostId === post.id && (
                <CommentInput posts={post} />
              )
            }    

            <CommentPreview comments={post.comments} />


          </div>
        )}
        )
      }
    </div>
  )
}