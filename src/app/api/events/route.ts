import { NextRequest, NextResponse } from "next/server";

import { readEvents } from "../../../../prisma/db";

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
