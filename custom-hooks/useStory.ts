import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createStory, getStories } from "../services/story";

export function useCreateStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createStory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", "infinite"] });
    },
  });
}

export function useInfiniteStories() {
  return useInfiniteQuery({
    queryKey: ["stories", "infinite"],
    queryFn: getStories,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false,
    retry: 1,
  });
}
