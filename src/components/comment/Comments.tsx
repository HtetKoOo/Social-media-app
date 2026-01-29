"use client";
import Image from "next/image";
import React from "react";
import { FaEllipsisH, FaRegCommentDots, FaRegTrashAlt, FaPen } from "react-icons/fa";
import { useDeleteComment, useInfiniteComments } from "../../../custom-hooks/useComment";
import moment from "moment";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import CommentSkeleton from "../skeletons/CommentSkeleton";

export default function Comments({ postId }: { postId: string }) {
  const session = useSession();
  const userId = session.data?.user?.id
  const { mutate: deleteCommentMutation, isPending } = useDeleteComment()
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null);
  const [openUp, setOpenUp] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdownId &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const toggleDropdown = (commentId: string, event: React.MouseEvent) => {
    // Check position
    const rect = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 150) { // 150px approx for comment dropdown
      setOpenUp(true);
    } else {
      setOpenUp(false);
    }
    setOpenDropdownId((prev) => (prev === commentId ? null : commentId));
  };

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteComments(postId);

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  const handleDelete = (commentId: string) => {
    if (!confirm("Are you sure you want to delete comment?")) {
      return;
    }

    deleteCommentMutation({ commentId, postId }, {
      onSuccess: () => {
        toast("Comment deleted successfully", {
          style: {
            background: "#5D5FEF",
            color: "white"
          }
        })
      }
    })
  }

  if (isLoading) return <CommentSkeleton />
  if (isError) return <p className="text-gray-300">{error.message}</p>;

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mb-10 py-3 px-3">
        <div className="text-gray-400 mb-4">
          <FaRegCommentDots size={50} />
        </div>
        <h3 className="text-xl font-semibold text-gray-300">No comments yet</h3>
        <p className="text-gray-500 text-center max-w-md">
          {" "}
          This post doesn&apos;t have any comments yet. Start the conversation
          by adding the first comment!
        </p>
      </div>
    );
  }
  return (
    <>
      {comments.map((comment) => {
        return (
          <div key={comment.id} className="mt-3 group">
            <div className="flex gap-2">
              <div className="relative w-10 h-10">
                <Image
                  src={comment.author.image || "/images/avatar.png"}
                  fill
                  alt="profile-pic"
                  className="object-cover rounded-full border-4 border-dark-4"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="flex flex-col px-4 py-2 bg-dark-4 rounded-2xl gap-1">
                    <p className="text-gray-300 text-xs">{comment.author.name}</p>
                    <p >{comment.content}</p>
                  </div>
                  {userId === comment.author.id && (
                    <div className="relative" ref={openDropdownId === comment.id ? dropdownRef : null}>
                      <button
                        onClick={(e) => toggleDropdown(comment.id, e)}
                        className="text-gray-300 hover:text-white hover:bg-dark-4 hover:rounded-full rounded-full transition-all cursor-pointer p-3 opacity-0 group-hover:opacity-100"
                      >
                        <FaEllipsisH size={14} />
                      </button>
                      {openDropdownId === comment.id && (
                        <div className={`absolute right-0 p-1 w-44 bg-dark-4 rounded-2xl shadow-lg z-50 border border-gray-700 ${openUp ? "bottom-full mb-1" : "mt-2"}`}>
                          <button
                            className="w-full text-left px-4 py-2 rounded-2xl text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
                            onClick={() => {
                              console.log("Edit comment:", comment.id);
                              toast.info("Edit functionality coming soon!");
                              setOpenDropdownId(null);
                            }}
                          >
                            <FaPen size={12} /> Edit Comment
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 rounded-2xl text-sm text-red-500 hover:bg-gray-700 hover:text-red-400 flex items-center gap-2"
                            onClick={() => {
                              handleDelete(comment.id);
                              setOpenDropdownId(null);
                            }}
                            disabled={isPending}
                          >
                            <FaRegTrashAlt size={12} /> Delete Comment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-primary text-xs font-semibold">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {
        hasNextPage && (
          <div className="flex justify-center mb-10">
            <button
              className="bg-primary text-white py-2 px-4 rounded-full cursor-pointer"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          </div>
        )
      }
    </>
  );
}
