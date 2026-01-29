"use client";
import React, { useEffect } from "react";
import Post from "./Post";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "../skeletons/PostSkeleton";
import { getSavedPosts } from "../../../services/savedPost";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FaBookmark } from "react-icons/fa";

export function useInfiniteSavedPosts() {
    return useInfiniteQuery({
        queryKey: ["saved-posts"],
        queryFn: getSavedPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage
                ? lastPage.pagination.currentPage + 1
                : undefined;
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}

export default function SavedPosts({ userId }: { userId: string }) {
    const { inView, ref } = useInView();
    const {
        isLoading,
        data,
        isFetchingNextPage,
        error,
        isError,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteSavedPosts();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allPosts = data?.pages.flatMap((page) => page.posts) || [];

    if (isLoading) return <PostSkeleton />;
    if (isError) return <p className="text-gray-300">{error.message}</p>;

    if (allPosts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-10">
                <div className="text-gray-500 mb-4">
                    <FaBookmark size={40} />
                </div>
                <p className="text-gray-400">No saved posts yet.</p>
            </div>
        )
    }

    return (
        <div className="mt-3">
            {allPosts.map((post, index) => {
                return (
                    <div key={post.id} ref={index === allPosts.length - 1 ? ref : null}>
                        <Post userId={userId} post={post} />
                    </div>
                );
            })}
            {isFetchingNextPage && <PostSkeleton />}
        </div>
    );
}
