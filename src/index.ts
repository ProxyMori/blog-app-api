import express from "express";
import { userRoutes } from "./routes/user.routes.js";
import { GlobalError, notFoundError } from "./utils/errors.js";
import { postRoutes } from "./routes/post.routes.js";
import cors from "cors";
<<<<<<< HEAD
import { authRoutes } from "./routes/auth.routes.js";
=======
>>>>>>> 0647a248e0af189aa46f9a5a5d8b62c7af8e8a80

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
<<<<<<< HEAD
app.use("/auth", authRoutes);
=======
>>>>>>> 0647a248e0af189aa46f9a5a5d8b62c7af8e8a80

app.use(GlobalError);
app.use(notFoundError);

app.listen(PORT, () => {
  console.log(`Server is running on : ${PORT}`);
});
