import CommentInput from "@/components/comment/CommentInput";
import Comments from "@/components/comment/Comments";
import Image from "next/image";
import React from "react";
import { getPostByID } from "@/../server-actions/post";
import { notFound } from "next/navigation";
import moment from "moment";
import PostActions from "@/components/post/PostActions";
import { auth } from "@/../auth";
import { FaEllipsisH, FaTimes } from "react-icons/fa";

export default async function PostViewPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  const post = await getPostByID(postId);

  const session = await auth();
  const userId = session?.user?.id;

  if (!post) {
    notFound();
  }
  return (
    <>
      <div className="bg-dark-3 p-4 rounded-2xl my-3">
        <div className="flex gap-2 items-center">
          <div className="relative w-10 h-10">
            <Image
              src={post.author.image || "/images/avatar.png"}
              fill
              alt="profile-pic"
              className="object-cover rounded-full border-4 border-dark-4"
            />
          </div>
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <div>
              <span className="text-primary text-sm font-semibold">
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button className="text-gray-300 hover:text-white hover:bg-dark-4 hover:rounded-full rounded-full transition-colors cursor-pointer p-3">
              <FaEllipsisH size={18} />
            </button>
            <button className="text-gray-300 hover:text-white hover:bg-dark-4 hover:rounded-full rounded-full transition-colors cursor-pointer p-3">
              <FaTimes size={18} />
            </button>
          </div>
        </div>
        {post.text && <p className="py-4 text-gray-200 text-sm">{post.text}</p>}
        {post.image && (
          <div className="relative w-full h-80 sm:h-100 md:h-120">
            <Image
              src={post.image}
              alt="profile-pic"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        )}

        {userId && (
          <PostActions
            userId={userId}
            postId={post.id}
            creatorId={post.authorId}
            postViewPage={true}
          />
        )}

        {/* comment input */}
        <CommentInput postId={post.id} />

        {/* comments */}
        <Comments postId={post.id} />
        </div>
    </>
  );
}
