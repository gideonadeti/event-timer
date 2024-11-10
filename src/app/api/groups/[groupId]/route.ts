import { NextRequest, NextResponse } from "next/server";
import { readGroup, updateGroup } from "../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const { userId, name } = await req.json();

  try {
    const group = await readGroup(userId.trim(), name.trim());

    if (group) {
      return NextResponse.json(
        { error: "Group already exists" },
        { status: 400 }
      );
    }

    await updateGroup(groupId, name);

    return NextResponse.json(
      { message: "Group updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating group:", error);

    return NextResponse.json(
      { error: "Something went wrong while updating group" },
      { status: 500 }
    );
  }
}
