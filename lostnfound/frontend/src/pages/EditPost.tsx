import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { auth } from "../firebase";

interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  returnClaimLocation: string;
  type: 1 | 2;
  image: string | null;
}

interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: Post) => void;
}

export default function EditPostModal({ post, isOpen, onClose, onUpdated }: EditPostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [returnClaimLocation, setReturnClaimLocation] = useState("");
  const [type, setType] = useState<1 | 2 | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setLocation(post.location);
      setReturnClaimLocation(post.returnClaimLocation);
      setType(post.type);
      setImage(post.image);
      setError("");
    }
  }, [post]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setCompressing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(compressed);
    } catch {
      setError("Failed to process image. Please try another.");
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) { setError("Please select a status."); return; }
    if (!post) return;
    setLoading(true);
    setError("");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`http://localhost:3000/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, location, returnClaimLocation, type, image: image ?? null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      onUpdated({ ...post, title, description, location, returnClaimLocation, type, image });
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative bg-[#f34700] text-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-3 top-3 bg-black/20 border-none text-white hover:bg-black/40"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-5">Edit Post</h3>

        {error && (
          <div className="bg-red-800 text-white text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Title</legend>
            <input
              type="text"
              className="input input-bordered w-full text-[#3d4451]"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Description</legend>
            <textarea
              className="textarea h-20 w-full bg-white text-[#3d4451] rounded-lg"
              placeholder="Describe the item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Location</legend>
            <input
              type="text"
              className="input input-bordered w-full text-[#3d4451]"
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Where to Claim/Return?</legend>
            <textarea
              className="textarea h-16 w-full bg-white text-[#3d4451] rounded-lg"
              placeholder="Add retrieval details..."
              value={returnClaimLocation}
              onChange={(e) => setReturnClaimLocation(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Status</legend>
            <div className="flex justify-center gap-10">
              <label className="flex items-center gap-2 text-[15px]">
                <input
                  type="radio"
                  name="edit-radio"
                  className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600"
                  checked={type === 1}
                  onChange={() => setType(1)}
                />
                lost item
              </label>
              <label className="flex items-center gap-2 text-[15px]">
                <input
                  type="radio"
                  name="edit-radio"
                  className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600"
                  checked={type === 2}
                  onChange={() => setType(2)}
                />
                found item
              </label>
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Photo (optional)</legend>
            <input
              type="file"
              accept="image/*"
              className="file-input w-full text-black rounded-lg hover:border-[#f34700]"
              onChange={handleFileChange}
            />
            {compressing && <p className="text-sm mt-1 opacity-80">Compressing image...</p>}
            {image && !compressing && (
              <img src={image} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover w-full" />
            )}
          </fieldset>

          <button
            type="submit"
            disabled={loading || compressing}
            className="btn bg-black text-white border-none rounded-lg w-full text-[15px] hover:bg-gray-800 disabled:opacity-60 mt-1"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}