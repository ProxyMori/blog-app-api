import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { PaginationQueryParams } from "../types/pagination.js";
import { ApiError } from "../utils/api-error.js";

export const getPostsService = async (query: PaginationQueryParams) => {
  const { page, take, sortOrder, sortBy, search } = query;

  const whereClause: Prisma.PostWhereInput = {};

  if (search) {
    whereClause.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    skip: (page - 1) * take,
    take,
    orderBy: { [sortBy]: sortOrder },
    include: { user: { select: { name: true } } },
  });

  const total = await prisma.post.count({
    where: whereClause,
  });

  return {
    data: posts,
    meta: { page, take, total },
  };
};

export const getPostBySlugService = async (slug: string) => {
  const blog = await prisma.post.findUnique({
    where: { slug },
    include: { user: { select: { name: true } } },
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};
