import express from "express";
import { db, auth } from "../firebase";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await auth.createUser({ email, password });
    await db.collection("users").doc(user.uid).set({
      email: user.email,
      createdAt: new Date(),
    });
    res.status(201).json({ message: "User created successfully", uid: user.uid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;