import CreatePostInput from "@/components/post/CreatePostInput";
import Feed from "@/components/post/Feed";
import React from "react";
import { auth } from "../../../../auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <div>
      <CreatePostInput />
      {session?.user?.id && <Feed userId={session.user.id} />}
    </div>
  );
}
