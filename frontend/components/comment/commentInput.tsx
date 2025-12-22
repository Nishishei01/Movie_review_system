"use client";

import { useState } from "react";
import { PostProps } from "@/types";
import { commentApi } from "@/apis/comment";

export default function CommentInput({ posts }: { posts: PostProps.PostType }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim() || loading) return;

    try {
      setLoading(true);
      await commentApi.create({
        postID: posts.id,
        comment: text,
      });
      setText("");
    } catch (err) {
      console.error("Create comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      submit();
    }
  };

  return (
    <div className="px-5 py-3 border-t border-gray-100">
      <div className="">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="เขียนความคิดเห็น..."
          className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-2 pr-14 text-sm
                     focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <p className="mt-1 text-xs text-gray-400">
        กด Enter เพื่อส่ง • Shift+Enter เพื่อขึ้นบรรทัดใหม่
      </p>
    </div>
  );
}
