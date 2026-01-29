"use client";
import React from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { usePostStats } from "../../../custom-hooks/usePost";
import LikeButton from "../like/LikeButton";
import PostActionsSkeleton from "../skeletons/PostActionsSkeleton";

type PostActionsProps = {
  userId: string;
  creatorId: string;
  postId: string;
  postViewPage: boolean;
};

export default function PostActions({
  postId,
}: PostActionsProps) {
  const { data, isLoading } = usePostStats(postId);
  const commentCount = data?.commentsCount;

  if (isLoading) return <PostActionsSkeleton/>

  if (data) {
    return (
      <div className="mt-4 mx-1 flex gap-6">
        <LikeButton postId={postId} postStats={data} />
        <button className="text-gray-300 cursor-pointer flex items-center gap-1">
          <FaRegCommentDots size={20} />
          <span className="text-xs">{commentCount}</span>
        </button>
      </div>
    );
  }
}
