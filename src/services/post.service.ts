import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { generateSlug } from "../utils/slug.js";
import { CreatePostSchema } from "../validators/post.service.js";

export const createPostService = async (
  body: CreatePostSchema,
  userId: number,
) => {
  const blog = await prisma.post.findUnique({
    where: { title: body.title },
  });

  if (blog) {
    throw new ApiError(400, "Title already exist!");
  }

  const slug = generateSlug(body.title);

  await prisma.post.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      slug: slug,
      content: body.content,
      thumbnail: body.thumbnail,
      userId: userId,
    },
  });

  return { message: "create post success" };
};

export const createPostService = async (body: CreatePostSchema) => {
  const blog = await prisma.post.findUnique({
    where: { title: body.title },
  });

  if (blog) {
    throw new ApiError(400, "Title already exist!");
  }

  const slug = generateSlug(body.title);

  await prisma.post.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      slug: slug,
      content: body.content,
      thumbnail: body.thumbnail,
      userId: body.userId,
    },
  });

  return { message: "create post success" };
};
