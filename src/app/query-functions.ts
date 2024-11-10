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
