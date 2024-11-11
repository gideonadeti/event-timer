import { NextRequest, NextResponse } from "next/server";
import { readEvent, updateEvent, deleteEvent } from "../../../../../prisma/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const { title, description, type, date, groupId } = await req.json();

  if (!title || !type || !date || !groupId) {
    return NextResponse.json(
      {
        error: "Title, type, date, and groupId are required",
      },
      { status: 400 }
    );
  }

  try {
    const event = await readEvent(title.trim(), groupId.trim());

    if (
      event &&
      event.description === description.trim() &&
      event.type === type &&
      event.date === date
    ) {
      return NextResponse.json(
        {
          error: "Event already exists",
        },
        { status: 400 }
      );
    }

    await updateEvent(eventId, title, description, type, date, groupId);

    return NextResponse.json(
      {
        message: "Event updated succcessfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating event", error);

    return NextResponse.json(
      { error: "Something went wrong while updating event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  try {
    await deleteEvent(eventId);

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting event" },
      { status: 500 }
    );
  }
}
