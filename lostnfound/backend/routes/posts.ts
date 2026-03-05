import { Router, Request, Response, NextFunction } from "express";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { auth, db } from "../firebase";

const router = Router();

export type PostType = 1 | 2;

export interface NewPost {
  title: string;
  description: string;
  type: PostType;
  location: string;
  returnClaimLocation: string;
  image?: string | null;
}

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

// POST /posts — add a new post
router.post("/", verifyToken, async (req: Request, res: Response) => {
  const title = String(req.body.title ?? "");
  const description = String(req.body.description ?? "");
  const location = String(req.body.location ?? "");
  const returnClaimLocation = String(req.body.returnClaimLocation ?? "");
  const image = req.body.image ?? null;
  const type = req.body.type;
  const uid = res.locals.uid;

  const numericType = Number(type);

  if (!title.trim()) return res.status(400).json({ error: "Title is required." });
  if (!description.trim()) return res.status(400).json({ error: "Description is required." });
  if (!location.trim()) return res.status(400).json({ error: "Location is required." });
  if (!returnClaimLocation.trim()) return res.status(400).json({ error: "Return/Claim Location is required." });
  if (![1, 2].includes(numericType)) return res.status(400).json({ error: "Type must be 1 (lost) or 2 (found)." });

  const docRef = await db.collection("posts").add({
    title: title.trim(),
    description: description.trim(),
    type: numericType,
    location: location.trim(),
    returnClaimLocation: returnClaimLocation.trim(),
    image: image ?? null,
    userId: uid,
    createdAt: FieldValue.serverTimestamp(),
  });

  return res.status(201).json({ message: "Post created.", id: docRef.id });
});

// GET /posts/my — user's active posts
router.get("/my", verifyToken, async (req: Request, res: Response) => {
  const uid = res.locals.uid;
  const snapshot = await db.collection("posts")
    .where("userId", "==", uid)
    .orderBy("createdAt", "desc")
    .get();
  const posts = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((post: any) => !post.deletedAt);
  return res.status(200).json(posts);
});
// GET /posts/deleted — recently deleted posts
router.get("/deleted", verifyToken, async (req: Request, res: Response) => {
  const uid = res.locals.uid;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const snapshot = await db.collection("posts")
    .where("userId", "==", uid)
    .where("deletedAt", "!=", null)
    .orderBy("deletedAt", "desc")
    .get();

  const batch = db.batch();
  const posts: any[] = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const deletedAt = (data.deletedAt as Timestamp)?.toDate();
    if (deletedAt && deletedAt < thirtyDaysAgo) {
      // if deleted more than 30 days ago, permanently delete
      batch.delete(doc.ref);
    } else {
      posts.push({ id: doc.id, ...data });
    }
  });

  await batch.commit();
  return res.status(200).json(posts);
});

// GET /posts — get all active posts for feed
router.get("/", async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
    const posts = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((post: any) => !post.deletedAt);
    return res.status(200).json(posts);
  } catch (err: any) {
    console.error("GET /posts error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});
// DELETE /posts/:id — soft delete (move to recently deleted)
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = String(req.params.id ?? "");
  if (!id.trim()) return res.status(400).json({ error: "Post ID is required." });

  await db.collection("posts").doc(id).update({
    deletedAt: FieldValue.serverTimestamp(),
  });

  return res.status(200).json({ message: "Post moved to recently deleted.", id });
});

// PUT /posts/:id/restore — restore a soft-deleted post
router.put("/:id/restore", verifyToken, async (req: Request, res: Response) => {
  const id = String(req.params.id ?? "");
  if (!id.trim()) return res.status(400).json({ error: "Post ID is required." });

  await db.collection("posts").doc(id).update({
    deletedAt: null,
  });

  return res.status(200).json({ message: "Post restored.", id });
});

// DELETE /posts/:id/permanent — hard delete permanently
router.delete("/:id/permanent", verifyToken, async (req: Request, res: Response) => {
  const id = String(req.params.id ?? "");
  if (!id.trim()) return res.status(400).json({ error: "Post ID is required." });

  await db.collection("posts").doc(id).delete();
  return res.status(200).json({ message: "Post permanently deleted.", id });
});

// PUT /posts/:id — update a post
router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = String(req.params.id ?? "");
  const title = String(req.body.title ?? "");
  const description = String(req.body.description ?? "");
  const location = String(req.body.location ?? "");
  const returnClaimLocation = String(req.body.returnClaimLocation ?? "");
  const image = req.body.image ?? null;
  const type = req.body.type;

  if (!id.trim()) return res.status(400).json({ error: "Post ID is required." });

  const numericType = Number(type);
  if (![1, 2].includes(numericType)) return res.status(400).json({ error: "Type must be 1 (lost) or 2 (found)." });

  await db.collection("posts").doc(id).update({
    title: title.trim(),
    description: description.trim(),
    type: numericType,
    location: location.trim(),
    returnClaimLocation: returnClaimLocation.trim(),
    image: image ?? null,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.status(200).json({ message: "Post updated.", id });
});

export default router;