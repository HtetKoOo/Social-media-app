"use client";
import EditProfileModal from "@/components/modals/EditProfileModal";
import React, { useState } from "react";
import { useGetUser } from "../../../../custom-hooks/useUser";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import Post from "@/components/post/Post";
import { useUserPosts } from "../../../../custom-hooks/usePost";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user, isLoading, isError, error } = useGetUser();
  const { ref, inView } = useInView();

  const {
    data: postsData,
    isLoading: isPostsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPosts(user?.id || "");

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <ProfileSkeleton />
  if (isError) return <h1 className="text-gray-300">{error.message}</h1>;
  return (
    <div className="flex flex-col md:mx-20">
      <EditProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        user={user}
      />

      {/* profile card */}
      <ProfileCard user={user} setIsModalOpen={setIsModalOpen} />

      {/* navbar and sticky */}
      <div className="sticky top-16 z-40 w-full bg-dark-1/95 backdrop-blur-md flex justify-around border-b border-dark-4">
        {/* posts */}
        <button className="flex-1 p-4 hover:bg-dark-2 transition-colors text-gray-200 font-medium">Posts</button>
        {/* photos */}
        <button className="flex-1 p-4 hover:bg-dark-2 transition-colors text-gray-400 font-medium">Photos</button>
        {/* reels */}
        <button className="flex-1 p-4 hover:bg-dark-2 transition-colors text-gray-400 font-medium">Reels</button>
        {/* stories */}
        <button className="flex-1 p-4 hover:bg-dark-2 transition-colors text-gray-400 font-medium">Stories</button>
      </div>

      {/* posts */}
      <div className="mt-2">
        {isPostsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : postsData?.pages[0]?.posts.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {postsData?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.posts.map((post) => (
                  <Post
                    key={post.id}
                    post={post}
                    userId={user?.id || ""}
                  />
                ))}
              </React.Fragment>
            ))}

            {/* loading spinner for next page */}
            <div ref={ref} className="py-4 flex justify-center">
              {isFetchingNextPage && (
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
