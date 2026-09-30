import { Request, Response } from "express";
<<<<<<< HEAD
import { loginService, registerService } from "../services/auth.service.js";
=======
import { registerService } from "../services/auth.service.js";
>>>>>>> origin/main

export const registerController = async (req: Request, res: Response) => {
  const result = await registerService(req.body);

  res.status(200).send(result);
};
<<<<<<< HEAD
export const loginController = async (req: Request, res: Response) => {
  const result = await loginService(req.body);

  res.status(200).send(result);
};
=======
>>>>>>> origin/main
