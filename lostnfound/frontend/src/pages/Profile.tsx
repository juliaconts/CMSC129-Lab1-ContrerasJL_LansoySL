import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import EditPostModal from "./EditPost";

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  returnClaimLocation: string;
  type: 1 | 2;
  image: string | null;
}

export default function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { setError("Not logged in."); setLoading(false); return; }
      setUserEmail(user.email ?? "");
      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:3000/posts/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Failed to load posts."); return; }
        setPosts(data);
      } catch {
        setError("Network error. Could not load posts.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (postId: string) => {
    setDeleting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert("Failed to delete post."); return; }
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setDeleteConfirmId(null);
    } catch {
      alert("Network error. Could not delete post.");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const initials = userEmail ? userEmail[0].toUpperCase() : "U";

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-10">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="bg-[#f34700] text-white h-20 w-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-md flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{userEmail}</h1>
            {/* <p className="text-lg font-semibold text-[#f34700] mt-0.5">Your Posts</p> */}
            <p className="text-gray-500 mt-1">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>
           {/* <h2 className="text-xl font-bold text-gray-800 mb-6">My Posts</h2> */}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Posts</h2>
      </div>

      {/* States */}
      {loading && <p className="text-center py-16 text-gray-400 text-lg">Loading your posts...</p>}
      {error && <p className="text-center py-16 text-red-500 text-lg">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">You haven't posted anything yet.</p>
        </div>
      )}


      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-16">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            {post.image && (
              <div className="relative w-full h-64 bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-bold rounded-full tracking-wide shadow ${
                    post.type === 1 ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                  }`}
                >
                  {post.type === 1 ? "Lost Item" : "Found Item"}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-4">

              {/* if post no image */}
              {!post.image && (
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    post.type === 1 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  {post.type === 1 ? "Lost Item" : "Found Item"}
                </span>
              )}

              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{post.title}</h2>
              <p className="text-gray-500 text-base leading-relaxed line-clamp-3">{post.description}</p>

              <hr className="border-gray-100" />

              <div className="space-y-2.5">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Location:</span> {post.location}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {post.type === 1 ? "If found:" : "Claim in:"}
                  </span>{" "}
                  {post.returnClaimLocation}
                </p>
              </div>

              {/* Edit / Delete Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setEditPost(post)}
                  className="flex-1 btn btn-sm bg-[#f34700] text-white border-none hover:bg-orange-600 rounded-xl text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(post.id)}
                  className="flex-1 btn btn-sm bg-gray-100 text-gray-700 border-none hover:bg-red-100 hover:text-red-600 rounded-xl text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <EditPostModal
        post={editPost}
        isOpen={!!editPost}
        onClose={() => setEditPost(null)}
        onUpdated={handleUpdated}
      />

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl z-10 p-8 max-w-sm mx-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete this post?</h3>
            <p className="text-gray-500 mb-6 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 btn bg-gray-100 text-gray-700 border-none hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 btn bg-red-500 text-white border-none hover:bg-red-600 rounded-xl disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}