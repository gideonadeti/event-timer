import axios from "axios";

export async function readGroups(userId: string) {
  try {
    const res = await axios.get(`/api/groups`, {
      params: {
        userId,
      },
    });

    return res.data.groups;
  } catch (error) {
    console.error("Error reading groups:", error);

    throw error;
  }
}

export async function readEvents(userId: string) {
  try {
    const res = await axios.get(`/api/events`, {
      params: {
        userId,
      },
    });

    return res.data.events;
  } catch (error) {
    console.error("Error reading events:", error);

    throw error;
  }
}

export async function createGroup(userId: string, name: string) {
  try {
    const res = await axios.post(`/api/groups`, {
      userId,
      name,
    });

    return res.data.message;
  } catch (error) {
    console.error("Error creating group:", error);

    throw error;
  }
}

export async function updateGroup(
  groupId: string,
  userId: string,
  name: string
) {
  try {
    const res = await axios.patch(`/api/groups/${groupId}`, {
      userId,
      name,
    });

    return res.data.message;
  } catch (error) {
    console.error("Error updating group:", error);

    throw error;
  }
}

export async function deleteGroup(groupId: string) {
  try {
    const res = await axios.delete(`/api/groups/${groupId}`);

    return res.data.message;
  } catch (error) {
    console.error("Error deleting group:", error);

    throw error;
  }
}
