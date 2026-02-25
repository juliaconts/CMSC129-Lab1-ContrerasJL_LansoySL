import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import postsRouter from "./routes/posts";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/posts", postsRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Lost & Found API is running.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});