import axios from "axios";
import { StoriesResponse } from "../types/story";

export async function createStory(data: FormData) {
  try {
    const response = await axios.post("/api/stories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating story:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to create story");
    } else {
      throw error;
    }
  }
}

export async function getStories({ pageParam = 1 }): Promise<StoriesResponse> {
  try {
    const response = await axios.get(`/api/stories?page=${pageParam}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch stories");
    } else {
      throw error;
    }
  }
}
