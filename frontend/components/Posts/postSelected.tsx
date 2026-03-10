"use client";

import { PostProps } from "@/types";
// import { useState } from "react";
import Image from 'next/image'
import LikeButton from "../like/likeButton";
import CommentInput from "../comment/commentInput";
import PostContent from "./postContent";

export default function PostSelected({ post, onClose }: { post: PostProps.PostType, onClose: () => void }) {
  
  return (
    <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 animate-in fade-in duration-300 p-0 md:p-8 overscroll-none"
              onClick={onClose}
            >
              <button 
                className="fixed top-4 right-4 z-[9999] p-2.5 bg-black/40 text-white rounded-full hover:bg-white/20 hover:scale-105 transition-all cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
    
              <div 
                className="flex flex-col md:flex-row w-full h-full md:max-h-[90vh] max-w-[1400px] mx-auto overflow-y-auto md:overflow-hidden bg-white md:rounded-3xl shadow-xl animate-in zoom-in-95 duration-300 transform-gpu overscroll-contain"
                onClick={(e) => e.stopPropagation()} 
              >
                
                <div className="w-full h-[40vh] md:h-full md:flex-auto relative bg-black/5 flex items-center justify-center shrink-0 overflow-hidden transform-gpu">
                   <Image
                      src={`https://image.tmdb.org/t/p/original${post.movie.movieImage}`}
                      alt="Full view"
                      fill
                      className="object-contain"
                      quality={100}
                      priority
                   />
                </div>
    
                <div className="flex w-full md:w-[450px] lg:w-[550px] bg-white flex-col h-auto min-h-[60vh] md:h-full md:border-l border-gray-100 shadow-none md:shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.1)] z-10 shrink-0 transform-gpu">
                  
                  <div className="p-5 border-b border-gray-100 flex items-center gap-4 bg-white/95 shrink-0 sticky top-0 z-20">
                    {/* <Image
                      src="/images/user.jpg"
                      alt="User"
                      width={44}
                      height={44}
                      className="rounded-full ring-2 ring-gray-100 shadow-sm"
                    /> */}
                    <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shrink-0 overflow-hidden shadow-inner flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                        {post.userPost.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">
                        {post.userPost.firstName} {post.userPost.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        {new Date(post.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
    
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white overscroll-contain transform-gpu">
                  
                    <div className="mb-6 text-gray-800 text-lg leading-relaxed">
                       <PostContent content={post.content} />
                    </div>
    
                    <div className="mb-8 p-5 bg-gradient-to-br from-violet-50 to-white rounded-2xl border border-violet-100/50 shadow-sm text-sm">
                       <p className="font-bold text-violet-900 mb-2 flex items-center gap-2 text-base">
                         <span className="text-xl">🎬</span> {post.movie.movieName}
                       </p>
                       <p className="text-gray-600 leading-relaxed text-sm/6">{post.movie.overview}</p>
                    </div>
    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Comments <span className="text-violet-600">({post.comments.length})</span></p>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
    
                    <div>
                      <div className="space-y-5">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 group">
                             <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shrink-0 overflow-hidden shadow-inner flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                                {comment.userComment?.firstName?.[0] || 'U'}
                             </div>
                             <div className="flex-1">
                                <div className="bg-gray-50 px-4 py-2.5 rounded-2xl rounded-tl-sm inline-block shadow-sm border border-gray-100/50">
                                   <p className="text-sm font-bold text-gray-900 mb-0.5">{comment.userComment?.firstName || 'User'}</p>
                                   <p className="text-[14px] text-gray-700 leading-snug">{comment.comment}</p>
                                </div>
                                <p className="text-[11px] font-medium text-gray-400 mt-1.5 pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {new Date(comment.createdAt).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}
                                </p>
                             </div>
                          </div>
                        ))}
                        {post.comments.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                              <span className="text-2xl opacity-40">💬</span>
                            </div>
                            <p className="text-gray-500 font-medium text-sm">ยังไม่มีความคิดเห็น</p>
                            <p className="text-gray-400 text-xs mt-1">เป็นคนแรกที่แสดงความคิดเห็นเลย!</p>
                          </div>
                        )}
                      </div>
                    </div>
    
                  </div>
    
                  <div className="p-4 md:p-5 border-t border-gray-100 bg-white shrink-0 sticky bottom-0 z-20">
                    <div className="mb-3 px-2 flex items-center justify-between">
                       <LikeButton posts={post} />
                    </div>
                    <CommentInput posts={post} />
                  </div>
    
                </div>
              </div>
            </div>
  );
}