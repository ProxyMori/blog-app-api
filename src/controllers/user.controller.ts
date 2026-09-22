import { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "../services/user.service.js";

export const getUsersController = async (req: Request, res: Response) => {
  const query = {
    page: parseInt(req.query.page as string) || 1,
    take: parseInt(req.query.page as string) || 3,
    sortOrder: (req.query.sortOrder as string) || "desc",
    sortBy: (req.query.sortBy as string) || "createdAt",
    search: (req.query.search as string) || "",
  };

  const result = await getUsersService(query);
  res.status(200).send(result);
};

export const getUserController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await getUserByIdService(id);
  res.status(200).send(result);
};

export const createUserController = async (req: Request, res: Response) => {
  const result = await createUserService(req.body);
  res.status(200).send(result);
};

export const updateUserController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const result = await updateUserService(id, name);

  res.status(200).send(result);
};

export const deleteUserController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await deleteUserService(id);

  res.status(200).send(result);
};
