import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  returnClaimLocation: string;
  type: 1 | 2;
  image: string | null;
  deletedAt: { _seconds: number } | null;
}

function getDaysLeft(deletedAt: { _seconds: number } | null): number {
  if (!deletedAt) return 30;
  const deleted = new Date(deletedAt._seconds * 1000);
  const now = new Date();
  const diff = 30 - Math.floor((now.getTime() - deleted.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export default function DeletedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { setError("Not logged in."); setLoading(false); return; }
      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:3000/posts/deleted", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Failed to load deleted posts."); return; }
        setPosts(data);
      } catch {
        setError("Network error. Could not load deleted posts.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRestore = async (postId: string) => {
    setProcessing(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/posts/${postId}/restore`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert("Failed to restore post."); return; }
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("Network error.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePermanentDelete = async (postId: string) => {
    setProcessing(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/posts/${postId}/permanent`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert("Failed to delete post."); return; }
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setConfirmDeleteId(null);
    } catch {
      alert("Network error.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Recently Deleted</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Posts are permanently deleted after 30 days. You can restore or delete them early.
          </p>
        </div>
      </div>

      {loading && <p className="text-center py-16 text-gray-400 text-lg">Loading...</p>}
      {error && <p className="text-center py-16 text-red-500 text-lg">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">No recently deleted posts.</p>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-16">
        {posts.map((post) => {
          const daysLeft = getDaysLeft(post.deletedAt);
          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden opacity-80 hover:opacity-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              {post.image && (
                <div className="relative w-full h-64 bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale"
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
                {!post.image && (
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      post.type === 1 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}
                  >
                    {post.type === 1 ? "Lost Item" : "Found Item"}
                  </span>
                )}

                {/* Days left badge */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">{post.title}</h2>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    daysLeft <= 3 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {daysLeft}d left
                  </span>
                </div>

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

                {/* Restore / Delete Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleRestore(post.id)}
                    disabled={processing}
                    className="flex-1 btn btn-sm bg-[#f34700] text-white border-none hover:bg-orange-600 rounded-xl text-sm font-semibold disabled:opacity-60"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(post.id)}
                    className="flex-1 btn btn-sm bg-gray-100 text-gray-700 border-none hover:bg-red-100 hover:text-red-600 rounded-xl text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permanent Delete Confirm Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl z-10 p-8 max-w-sm mx-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Permanently delete?</h3>
            <p className="text-gray-500 mb-6 text-sm">This cannot be undone. The post will be gone forever.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 btn bg-gray-100 text-gray-700 border-none hover:bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePermanentDelete(confirmDeleteId)}
                disabled={processing}
                className="flex-1 btn bg-red-500 text-white border-none hover:bg-red-600 rounded-xl disabled:opacity-60"
              >
                {processing ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}