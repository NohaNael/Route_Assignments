export interface IPaginationQuery {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | string;
}

export function buildPaginationOptions(query: IPaginationQuery) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder === "desc" ? -1 : 1;

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
    skip: (page - 1) * limit,
    sort: { [sortBy]: sortOrder },
  };
}

export function buildPaginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
