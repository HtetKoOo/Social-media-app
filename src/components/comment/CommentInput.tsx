"use client";
import Image from "next/image";
import React, { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useGetUser } from "../../../custom-hooks/useUser";
import { useSession } from "next-auth/react";
import { CreateCommentData } from "../../../types/comments";
import { useCreateComment } from "../../../custom-hooks/useComment";

export default function CommentInput({ postId }: { postId: string }) {
  const { data: user, isLoading } = useGetUser();
  const [content, setContent] = useState("");
  const { mutate: CreateCommentMutation, isPending } = useCreateComment();
  const session = useSession();
  const userId = session.data?.user?.id;

  const handleSubmit = () => {
    if (!userId) return;

    if (!content.trim()) return;

    //create the comment object
    const commentData: CreateCommentData = {
      userId,
      postId,
      content: content.trim(),
    };

    CreateCommentMutation(commentData, {
      onSuccess: () => {
        setContent("");
      },
    });
  };
  return (
    <div className="bg-dark-3 p-4 rounded-2xl">
      <div className="flex gap-2">
        {isLoading ? (
           <div className="animate-pulse rounded-full w-12 h-12 bg-dark-4"></div>
        ) : (
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src={user?.image || "/images/avatar.png"}
              alt="profile-pic"
              fill
              className="object-cover rounded-full border-4 border-dark-4"
            />
          </div>
        )}

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Leave a comment"
            className="bg-dark-2 w-full p-2 rounded-2xl outline-none resize-none"
          />
          <div className="mt-2 flex gap-4">
            <button className="text-yellow-800 flex items-center gap-2 bg-dark-2 px-4 py-2 rounded-xl cursor-pointer">
              <MdOutlineEmojiEmotions size={20} />
              <span className="text-sm text-gray-400">Emoji</span>
            </button>
            <button
              disabled={isPending}
              onClick={handleSubmit}
              className="text-blue-700 flex items-center gap-2 bg-dark-2 px-4 py-2 rounded-xl cursor-pointer"
            >
              <BsFillSendFill size={20} />
              <span className="text-sm text-gray-400">
                {isPending ? "Posting..." : "Post Comment"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
