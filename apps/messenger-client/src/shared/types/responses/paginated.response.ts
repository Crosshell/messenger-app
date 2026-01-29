export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    nextCursor?: string | null;
    total?: number;
    page?: number;
    totalPages?: number;
  };
}
