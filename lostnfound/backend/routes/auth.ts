import express, { Request, Response, NextFunction } from "express";
import { db, auth } from "../firebase";

const router = express.Router();

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized." });
  try {
    const decoded = await auth.verifyIdToken(token);
    res.locals.uid = decoded.uid;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token." });
  }
};

router.post("/signup", verifyToken, async (req: Request, res: Response) => {
  const uid = res.locals.uid;
  const { email } = req.body;
  try {
    await db.collection("users").doc(uid).set({
      email,
      createdAt: new Date(),
    });
    res.status(201).json({ message: "User created successfully", uid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;