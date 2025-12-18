"use client";

import { PostProps } from "@/types";
import { CommentDuration } from "@/utils/date";
import { useState } from "react";
import Image from 'next/image'

export default function CommentPreview({ comments }: { comments: PostProps.Comment[] }) {
  
  const [showAll, setShowAll] = useState(false);

  const visibleComments = showAll ? comments : comments.slice(0, 3);
  
  return (
    <div className="px-5 pb-4">
      {visibleComments.map((c) => {
        const user = c.userComment;
        const commentDate = CommentDuration(c.createdAt);
        return (
          <div key={c.id} className="text-sm text-gray-700 mt-2 flex items-center">
            <div className="flex items-center gap-3">
            <Image 
              src="/images/user.jpg" 
              alt="Comment User Profile" 
              width={33}
              height={33}
              className="rounded-full object-cover"
            />
            <div className="">
              <div className="bg-gray-100 rounded-md p-2">
                <span className="font-bold">
                  {`${user.firstName} ${user.lastName}`}
                </span>
                <p>
                  {c.comment}
                </p>
              </div>
              <span className="pl-2">
                {commentDate}
              </span>
              </div>
            
            </div>
          </div>
        );
      })}

      {comments.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-gray-500 mt-2 hover:underline"
        >
          {showAll
            ? "ซ่อนความคิดเห็น"
            : `ดูความคิดเห็นทั้งหมด (${comments.length})`}
        </button>
      )}
    </div>
  );
}
