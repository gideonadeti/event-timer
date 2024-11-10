import { NextRequest, NextResponse } from "next/server";

import { readEvents, createEvent, readEvent } from "../../../../prisma/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const events = await readEvents(userId);

    return NextResponse.json({ events });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while reading events." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { title, description, type, date, groupId, userId } = await req.json();

  if (!title || !type || !date || !groupId || !userId) {
    return NextResponse.json(
      { error: "title, type, date, groupId and userId are required" },
      { status: 400 }
    );
  }

  try {
    const event = await readEvent(title.trim(), groupId.trim());

    if (event) {
      return NextResponse.json(
        { error: "Event already exists" },
        { status: 400 }
      );
    }

    await createEvent(
      title.trim(),
      description.trim(),
      type.trim(),
      date.trim(),
      groupId.trim(),
      userId.trim()
    );

    return NextResponse.json(
      { message: "Event created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while creating event" },
      { status: 500 }
    );
  }
}
