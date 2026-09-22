import { log } from "console";
import { db } from "../config/db.js";
import { Prisma, User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { Query } from "pg";

interface GetUsersQuery {
  page: number;
  take: number;
  sortOrder: string; //asc or desc
  sortBy: string; //base on columns
  search: string;
}

export const getUsersService = async (query: GetUsersQuery) => {
  const { page, take, sortOrder, sortBy, search } = query;

  const whereClause: Prisma.UserWhereInput = {
    deletedAt: null,
  };
  if (search) {
    whereClause.email = { contains: search, mode: "insensitive" };
  }
  console.log("ini isi parameter query:", query);
  const users = await prisma.user.findMany({
    where: whereClause,
    include: { posts: { select: { id: true, content: true } } },
    skip: (page - 1) * query.take,
    take: take,
    orderBy: { [sortBy]: sortOrder },
    omit: { password: true },
  });

  const total = await prisma.user.count({ where: whereClause });
  return {
    data: users,
    meta: { page, take, total },
  };
};

export const getUserByIdService = async (id: number) => {
  const users = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!users) {
    throw new ApiError(404, "User not found");
  }

  return users;
};

export const createUserService = async (body: User) => {
  await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({ data: body });

    await tx.post.create({
      data: {
        content: "lorem ipsum",
        userId: newUser.id,
      },
    });
  });

  return { message: "create user success" };
};
// export const createUserService = async (body: User) => {
//   const newUser = await prisma.user.create({ data: body });

//   return { message: "created user success" };
// };

export const updateUserService = async (id: number, body: Partial<User>) => {
  await getUserByIdService(id);

  await prisma.user.update({
    where: { id: id },
    data: body,
  });
  return { message: "create user success" };
};

export const deleteUserService = async (id: number) => {
  await getUserByIdService(id);

  //soft delete -> datanya tidak benar-benar hilang tapi kita mengisi kolom deleteAt
  await prisma.user.delete({
    where: { id: id },
    data: { deletedAt: new Date() },
  });

  //hard delete -> datanya beneran hilang di db
  // await prisma.user.delete({
  //   where: { id: id },
  // });

  return { message: "user deleted success" };
};
