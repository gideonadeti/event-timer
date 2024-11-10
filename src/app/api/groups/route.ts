import { NextRequest, NextResponse } from "next/server";

import { readGroups, createGroup, readGroup } from "../../../../prisma/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const groups = await readGroups(userId.trim());

    return NextResponse.json({ groups });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while reading groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId, name } = await req.json();

  if (!userId || !name) {
    return NextResponse.json(
      { error: "userId and name are required" },
      { status: 400 }
    );
  }

  try {
    const group = await readGroup(userId.trim(), name.trim());

    if (group) {
      return NextResponse.json(
        { error: "Group already exists" },
        { status: 400 }
      );
    }

    await createGroup(userId.trim(), name.trim());

    return NextResponse.json(
      { message: "Group created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while creating group" },
      { status: 500 }
    );
  }
}
