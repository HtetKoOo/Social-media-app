import { auth } from "@/../auth";
import SavedPosts from "@/components/post/SavedPosts";
import React from "react";

export default async function SavedPostsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    return (
        <div className="text-white">
            <h1 className="text-xl font-bold p-4 border-b border-gray-800">
                Saved Posts
            </h1>
            <SavedPosts userId={userId} />
        </div>
    );
}
