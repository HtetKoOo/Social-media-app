import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaEllipsisH, FaTimes, FaRegBookmark, FaBookmark, FaEdit, FaTrash } from "react-icons/fa";
import { useDeletePost } from "../../../custom-hooks/usePost";
import { useSavePost } from "../../../custom-hooks/useSavedPost";
import { toast } from "react-toastify";
import { Post as PostType } from "../../../types/post";
import moment from "moment";
import PostActions from "./PostActions";

type PostComponentProps = {
  post: PostType;
  userId: string;
};

export default function Post({ post, userId }: PostComponentProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [openUp, setOpenUp] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { mutate: DeletePostMutation } = useDeletePost();
  const { mutate: savePostMutation } = useSavePost();

  const isSaved = post.savedBy?.some((save: { userId: string }) => save.userId === userId);
  console.log("isSaved", isSaved);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeletePost = () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    DeletePostMutation(post.id, {
      onSuccess: () => {
        toast.success("Post deleted successfully");
      },
    });
  };

  return (
    <div className="bg-dark-3 p-2 sm:p-4 rounded-2xl my-2 sm:my-3">
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
        <div className="ml-auto flex items-center gap-1 relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              // Simple check for position: if clean bottom space is small, open up.
              if (dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                if (spaceBelow < 200) { // 200px approx height of dropdown
                  setOpenUp(true);
                } else {
                  setOpenUp(false);
                }
              }
            }}
            className="text-gray-300 hover:text-white hover:bg-dark-4 hover:rounded-full rounded-full transition-colors cursor-pointer p-3"
          >
            <FaEllipsisH size={18} />
          </button>

          {showDropdown && (
            <div
              className={`absolute right-0 z-50 w-40 bg-dark-4 rounded-2xl shadow-lg p-1 flex flex-col gap-1 border border-gray-800 ${openUp ? "bottom-full mb-2" : "top-10 mt-2"}`}
            >
              <button
                className="flex items-center gap-3 w-full p-2 text-sm text-gray-300 hover:bg-dark-3 hover:text-white rounded-2xl transition-colors"
                onClick={() => {
                  savePostMutation(post.id);
                  setShowDropdown(false);
                }}
              >
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                {isSaved ? "Unsave Post" : "Save Post"}
              </button>

              {userId === post.author.id && (
                <>
                  <button
                    className="flex items-center gap-3 w-full p-2 text-sm text-gray-300 hover:bg-dark-3 hover:text-white rounded-2xl transition-colors"
                    onClick={() => {
                      setShowDropdown(false);
                      // Placeholder for edit functionality
                    }}
                  >
                    <FaEdit />
                    Edit Post
                  </button>
                  <button
                    className="flex items-center gap-3 w-full p-2 text-sm text-red-500 hover:bg-dark-3 hover:text-red-400 rounded-2xl transition-colors"
                    onClick={() => {
                      setShowDropdown(false);
                      handleDeletePost();
                    }}
                  >
                    <FaTrash />
                    Delete Post
                  </button>
                </>
              )}
            </div>
          )}

          <button className="text-gray-300 hover:text-white hover:bg-dark-4 hover:rounded-full rounded-full transition-colors cursor-pointer p-3">
            <FaTimes size={18} />
          </button>
        </div>
      </div>
      <Link href={`/post/${post.id}`}>
        {post.text && <p className="py-4 text-gray-200 text-sm">{post.text}</p>}
        {post.image && (
          <div className="relative w-full h-80 sm:h-100 md:h-120 my-2">
            <Image
              src={post.image}
              alt="profile-pic"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        )}
      </Link>
      <hr className="border-gray-800 border-[0.5px]" />
      <PostActions
        userId={userId}
        creatorId={post.author.id}
        postId={post.id}
        postViewPage={false}
      />
    </div>
  );
}
