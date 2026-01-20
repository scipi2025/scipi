import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateSession } from "@/lib/auth";

// GET - Fetch all carousel images (public)
export async function GET() {
  try {
    const images = await prisma.carouselImage.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel images" },
      { status: 500 }
    );
  }
}

// POST - Create a new carousel image (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, alt, displayOrder, isActive } = body;

    if (!imageUrl || !alt) {
      return NextResponse.json(
        { error: "Image URL and alt text are required" },
        { status: 400 }
      );
    }

    const image = await prisma.carouselImage.create({
      data: {
        imageUrl,
        alt,
        displayOrder: displayOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error creating carousel image:", error);
    return NextResponse.json(
      { error: "Failed to create carousel image" },
      { status: 500 }
    );
  }
}

// PUT - Update a carousel image (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, imageUrl, alt, displayOrder, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const image = await prisma.carouselImage.update({
      where: { id },
      data: {
        ...(imageUrl !== undefined && { imageUrl }),
        ...(alt !== undefined && { alt }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating carousel image:", error);
    return NextResponse.json(
      { error: "Failed to update carousel image" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a carousel image (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    await prisma.carouselImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    return NextResponse.json(
      { error: "Failed to delete carousel image" },
      { status: 500 }
    );
  }
}
