import express from "express";
import {
  createPostController,
  getPostBySlugController,
  getPostsController,
} from "../controllers/post.controller.js";
import { createPostSchema } from "../validators/post.service.js";
import { validate } from "../middlewares/validation.middleware.js";

const postRoutes = express.Router();

postRoutes.get("/", getPostsController);
postRoutes.get("/:slug", getPostBySlugController);
postRoutes.get("/", validate(createPostSchema), createPostController);

export { postRoutes };
