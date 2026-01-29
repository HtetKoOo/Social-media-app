import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSavePost } from "../services/savedPost";
import { toast } from "react-toastify";

export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleSavePost(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate feed
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] }); // Invalidate saved posts list
      if(data.message) toast.success(data.message);
    },
    onError: (error) => {
        toast.error(error.message);
    }
  });
}
