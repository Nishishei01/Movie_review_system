"use client"

import { PostProps } from "@/types";
import { useState } from "react";

export default function PostContent({ content }: { content: PostProps.PostType["content"] }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="">
      <p
        className={`text-gray-800 leading-relaxed transition-all ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {content}
      </p>

      {content.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-violet-600 mt-1 hover:underline"
        >
          {expanded ? "แสดงน้อยลง" : "อ่านเพิ่มเติม"}
        </button>
      )}
    </div>
  )
}