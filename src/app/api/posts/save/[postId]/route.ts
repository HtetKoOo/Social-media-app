import { auth } from "../../../../../../auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma"
export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = (await params).postId;
    const userId = session.user.id;

    if (!userId) {
       return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    // Check if already saved
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingSave) {
      // Unsave
      await prisma.savedPost.delete({
        where: {
          id: existingSave.id,
        },
      });
      return NextResponse.json({ message: "Post unsaved", saved: false });
    } else {
      // Save
      await prisma.savedPost.create({
        data: {
          userId,
          postId,
        },
      });
      return NextResponse.json({ message: "Post saved", saved: true });
    }
  } catch (error) {
    console.error("Error toggling save post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
