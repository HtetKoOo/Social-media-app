import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.user.id } }, //exclude the logged in user
          {
            NOT: {
              followers: {
                some: { followerId: session.user.id },
              },
            },
          },
        ],
      },select:{
        id:true,
        name:true,
        username:true,
        image:true
      },
      take:20
    });

    //shuffle the list
    const shuffled = users.sort(() => 0.5 - Math.random())

    //pick 3 random suggestions
    const suggestions = shuffled.slice(0,3);

    return NextResponse.json({users:suggestions})
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user suggestions" },
      { status: 500 }
    );
  }
}
