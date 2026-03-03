import { Router, Request, Response } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../firebase";

const router = Router();

export type PostType = 1 | 2; // 1 for lost, 2 for found

export interface NewPost {
  title: string;
  description: string;
  type: PostType;
  location: string;
  returnClaimLocation: string;
  image?: string | null;
}

// POST /posts — Add a new post
router.post("/", async (req: Request, res: Response) => {
  const { title, description, type, location, returnClaimLocation, image } = req.body;

  const numericType = Number(type);

  if (!title?.trim())
    return res.status(400).json({ error: "Title is required." });

  if (!description?.trim())
    return res.status(400).json({ error: "Description is required." });

  if (!location?.trim())
    return res.status(400).json({ error: "Location is required." });

  if (!returnClaimLocation?.trim())
    return res.status(400).json({ error: "Return/Claim Location is required." });

  if (![1, 2].includes(numericType))
    return res.status(400).json({ error: "Type must be 1 (lost) or 2 (found)." });

  const docRef = await db.collection("posts").add({
    title: title.trim(),
    description: description.trim(),
    type: numericType, 
    location: location.trim(),
    returnClaimLocation: returnClaimLocation.trim(),
    image: image ?? null,
    createdAt: FieldValue.serverTimestamp(),
  });

  return res.status(201).json({ message: "Post created.", id: docRef.id });
});

// getting posts for feed
router.get("/", async (req: Request, res: Response) => {
    const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
    const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return res.status(200).json(posts);
});

// DELETE /posts/:id — Delete a post
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id?.trim()) return res.status(400).json({ error: "Post ID is required." });

  await db.collection("posts").doc(id).delete();

  return res.status(200).json({ message: "Post deleted.", id });
});

export default router;
