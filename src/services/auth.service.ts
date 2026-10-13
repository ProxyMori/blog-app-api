import { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import argon from "argon2";
import {
  forgotPasswordSchema,
  GoogleSchema,
  LoginSchema,
  ResetPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../lib/mail.js";
import { number } from "zod";
import { getUserByIdService } from "./user.service.js";
import axios from "axios";

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

  // 5. kirim email welcoming
  await sendMail({
    to: body.email,
    subject: "Welcome to Blog App",
    templateName: "welcome.hbs",
    context: {
      name: body.name,
    },
  });

  // 6. return success
  return { message: "register success!" };
};

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
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH!, {
    expiresIn: "7d",
  });

  // 6. return message login success + data user + access tokennya
  return {
    message: "Login success",
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    },
  };
};

export const forgotPasswordService = async (body: forgotPasswordSchema) => {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    return { message: "Send email success" };
  }

  const payload = { id: user.id, role: user.role };

  const token = jwt.sign(payload, process.env.JWT_SECRET_RESET!, {
    expiresIn: "15m",
  });

  await sendMail({
    to: body.email,
    subject: "Reset Password Request",
    templateName: "reset-password.hbs",
    context: {
      linkReset: `http://localhost:5173/reset-password?token=${token}`,
    },
  });

  return { message: "Send email success" };
};

export const resetPasswordService = async (
  body: ResetPasswordSchema,
  userId: number,
) => {
  await getUserByIdService(userId);

  const hashedPassword = await argon.hash(body.password);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Reset password success" };
};

export const googleService = async (body: GoogleSchema) => {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
      },
    },
  );

  let user = await prisma.user.findUnique({
    where: { email: response.data.email },
  });

  if (user) {
    // Soft deleted account
    if (user.deletedAt) {
      throw new ApiError(403, "This account has been deleted");
    }

    // Existing credentials account
    if (user.provider !== "GOOGLE") {
      throw new ApiError(400, "Please login using credentials");
    }
  }

  // kalo emailnya belum kepake sama sekali
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: response.data.name,
        email: response.data.email,
        password: "",
        profilePic: response.data.picture,
        provider: "GOOGLE",
      },
    });
  }

  // generate accessToken (jwt)
  const payload = { id: user.id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH!, {
    expiresIn: "15m",
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // return message login success + data user + access tokennya
  return {
    message: "Login success",
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    },
  };
};

export const refreshService = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new ApiError(400, "No refresh token");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {
      user: true,
    },
  });

  if (!storedToken) {
    throw new ApiError(400, "Refresh token not found");
  }

  if (storedToken.expiredAt < new Date()) {
    throw new ApiError(400, "Refresh token expired");
  }

  const payload = {
    id: storedToken.user.id,
    role: storedToken.user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  return { accessToken };
};

export const logoutService = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new ApiError(400, "No refresh token");
  }

  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });

  return { message: "logout success" };
};
