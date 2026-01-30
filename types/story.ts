export interface Story {
  id: string;
  text: string | null;
  image: string | null;
  imagePublicId: string | null;
  createdAt: string;
  expiresAt: string;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

export interface StoriesResponse {
  stories: Story[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
}
