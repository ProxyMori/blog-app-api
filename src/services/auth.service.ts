import { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import argon from "argon2";
<<<<<<< HEAD
import { LoginSchema } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
=======
>>>>>>> origin/main

export const registerService = async (
  body: Pick<User, "name" | "email" | "password">,
) => {
  // 1. cek dulu emailnya sudah kepake atau belum
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  // 2. kalo sudah kepake, throw error
  if (user) {
    throw new ApiError(400, "Email already exist!");
  }

  // 3. kalo belom, hash passwordnya
  const hashedPassword = await argon.hash(body.password);

  // 4. create data usernya
  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    },
  });

  // 5. return success
  return { message: "register success!" };
};
<<<<<<< HEAD

export const loginService = async (body: LoginSchema) => {
  // 1. cek dulu emailnya udah ada di db atau tidak
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  // 2. kalo emailnya tidak ada di db, throw error
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  // 3. cek passwordnya, bener atau tidak
  const isPassMatch = await argon.verify(user.password, body.password);

  // 4. kalo passwordnya salah, throw error
  if (!isPassMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  // 5. generate accessToken (jwt)
  const payload = { id: user.id, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  // 6. return message login success + data user + access tokennya
  return {
    message: "Login success",
    accessToken: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    },
  };
};
=======
>>>>>>> origin/main
