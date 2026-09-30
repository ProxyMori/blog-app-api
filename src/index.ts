import express from "express";
import { userRoutes } from "./routes/user.routes.js";
import { GlobalError, notFoundError } from "./utils/errors.js";
import { postRoutes } from "./routes/post.routes.js";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes.js";

const PORT = 8000;

const app = express();

app.use(cors());
app.use(express.json()); // agar bisa menerima req.body

app.get("/api", (req, res) => {
  res.status(200).send("Welcome to my API");
});

// Entry point
app.use("/users", userRoutes);
app.use("/post", postRoutes);
app.use("/auth", authRoutes);

app.use(GlobalError);
app.use(notFoundError);

app.listen(PORT, () => {
  console.log(`Server is running on : ${PORT}`);
});
