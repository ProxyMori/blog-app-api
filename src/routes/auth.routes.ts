import express from "express";
<<<<<<< HEAD
import {
  loginController,
  registerController,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
=======
import { registerController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";
>>>>>>> origin/main

const authRoutes = express.Router();

authRoutes.post("/register", validate(registerSchema), registerController);
<<<<<<< HEAD
authRoutes.post("/login", validate(loginSchema), loginController);
=======
>>>>>>> origin/main

export { authRoutes };
