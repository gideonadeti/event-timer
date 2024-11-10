import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export async function readGroups(userId: string) {
  try {
    const groups = await prismaClient.group.findMany({
      where: {
        userId,
      },
      include: {
        events: true,
      },
    });

    if (groups.length === 0) {
      const group = await createGroup(userId, "All");

      return [group];
    }

    return groups;
  } catch (error) {
    console.error("Error reading groups:", error);

    throw error;
  }
}

export async function readEvents(userId: string) {
  try {
    const events = await prismaClient.event.findMany({
      where: {
        userId,
      },
    });

    return events;
  } catch (error) {
    console.error("Error reading events:", error);

    throw error;
  }
}

export async function createGroup(userId: string, name: string) {
  try {
    const group = await prismaClient.group.create({
      data: {
        name,
        userId,
      },
    });

    return group;
  } catch (error) {
    console.error("Error creating group:", error);

    throw error;
  }
}

export async function readGroup(userId: string, name: string) {
  try {
    const group = await prismaClient.group.findFirst({
      where: {
        userId,
        name,
      },
    });

    return group;
  } catch (error) {
    console.error("Error reading group:", error);

    throw error;
  }
}
