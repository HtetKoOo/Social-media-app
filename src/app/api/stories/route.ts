import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import {
  CloudinaryUploadResult,
  uploadToCloudinary,
} from "../../../../services/cloudinary";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const text = formData.get("text") as string | null;
    const imageFile = formData.get("image") as File | null;

    //validate required fields
    if (!text?.trim() && !imageFile) {
      return NextResponse.json(
        { error: "Story must have either text or image" },
        { status: 400 }
      );
    }

    let imageData: CloudinaryUploadResult | null = null;

    if (imageFile) {
      try {
        imageData = await uploadToCloudinary(imageFile);
      } catch (error) {
        console.error("image upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Set expiration to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await prisma.story.create({
      data: {
        text: text?.trim() || null,
        authorId: session?.user?.id,
        expiresAt,
        ...(imageData && {
          image: imageData.secure_url,
          imagePublicId: imageData.public_id,
        }),
      },
    });

    return NextResponse.json(
      { success: true, message: "Story created successfully", story },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create story error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    // Limit to 10 stories per page for faster loading, usually horizontal list doesn't need huge batches
    const limit = 10; 

    const skip = (page - 1) * limit;

    // Filter for active stories only
    const where = {
        expiresAt: {
            gt: new Date()
        }
    };

    const [stories, totalCount] = await Promise.all([
      prisma.story.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.story.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      stories,
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
    console.error("Get stories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
