import { PrismaClient, Types } from "@prisma/client";

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

export async function updateGroup(groupId: string, name: string) {
  try {
    const group = await prismaClient.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
      },
    });

    return group;
  } catch (error) {
    console.error("Error updating group:", error);

    throw error;
  }
}

export async function deleteGroup(groupId: string) {
  try {
    await prismaClient.group.delete({
      where: {
        id: groupId,
      },
    });
  } catch (error) {
    console.error("Error deleting group:", error);

    throw error;
  }
}

export async function createEvent(
  title: string,
  description: string,
  type: Types,
  date: Date,
  groupId: string,
  userId: string
) {
  try {
    const event = await prismaClient.event.create({
      data: {
        title,
        description,
        type,
        date,
        groupId,
        userId,
      },
    });

    return event;
  } catch (error) {
    console.error("Error creating event:", error);

    throw error;
  }
}

export async function readEvent(title: string, groupId: string) {
  try {
    const event = await prismaClient.event.findFirst({
      where: {
        title,
        groupId,
      },
    });

    return event;
  } catch (error) {
    console.error("Error reading event:", error);

    throw error;
  }
}

export async function updateEvent(
  eventId: string,
  title: string,
  description: string,
  type: Types,
  date: Date,
  groupId: string
) {
  try {
    const event = await prismaClient.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        description,
        type,
        date,
        groupId,
      },
    });

    return event;
  } catch (error) {
    console.error("Error updating event", error);

    throw error;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await prismaClient.event.delete({
      where: {
        id: eventId,
      },
    });
  } catch (error) {
    console.error("Error deleting event", error);

    throw error;
  }
}
