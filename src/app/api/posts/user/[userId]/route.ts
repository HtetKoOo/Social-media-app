import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 2; // 2 posts per page

    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      // fetch the posts
      prisma.post.findMany({
        where: {
          authorId: userId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
              name: true,
            },
          },
          savedBy: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: {
          authorId: userId,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
