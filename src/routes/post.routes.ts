import Express from "express";
import { getPostsController } from "../controllers/post.controller.js";

const postRoutes = Express.Router();

postRoutes.get("/", getPostsController);

export { postRoutes };
