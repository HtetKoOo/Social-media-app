import { auth } from "../../../../auth";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
       return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            likes: true, // Need to verify if we need to check if liked by current user, probably yes
            comments: true,
            savedBy: { // Check if saved by current user (it is, but good for consistent structure if we use Feed items)
                 where: {
                     userId: userId
                 }
            }
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalStats = await prisma.savedPost.count({
      where: { userId },
    });
    
    const hasNextPage = totalStats > (skip + limit);

    // Transform to match PostsResponse expected by Feed/Post component
    // The Feed expects `posts` array. `savedPosts` returns `SavedPost` objects which contain `post`.
    // We need to extract the `post` and maybe add `isSaved: true` flag if needed, 
    // or relying on `savedBy` check in Post component.
    
    const posts = savedPosts.map(sp => ({
        ...sp.post,
        // We might need to ensure the shape matches exactly what Post component expects.
        // The Post component expects `PostType`.
    }));

    return NextResponse.json({
      posts,
      pagination: {
        hasNextPage,
        currentPage: page,
      },
    });

  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
