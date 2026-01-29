import axios from "axios";
import { PostsResponse } from "../types/post";

export async function toggleSavePost(postId: string) {
  try {
    const response = await axios.post(`/api/posts/save/${postId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to save post");
    } else {
      throw error;
    }
  }
}

export async function getSavedPosts({ pageParam = 1 }): Promise<PostsResponse> {
  try {
    const response = await axios.get(`/api/saved-posts?page=${pageParam}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch saved posts");
    } else {
      throw error;
    }
  }
}
