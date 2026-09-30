import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (secretKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token

    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    try {
      const payload = jwt.verify(token, secretKey);

      res.locals.user = payload;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new ApiError(401, "Token expired"));
      }

      return next(new ApiError(401, "Token invalid"));
    }
  };
};
