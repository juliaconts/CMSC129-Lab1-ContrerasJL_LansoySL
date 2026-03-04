import { useState } from "react";
import imageCompression from "browser-image-compression";
import PostsFeed from "./PostFeed";
import { auth } from "../firebase";

export default function Homepage() {
    const [userEmail] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [returnClaimLocation, setReturnClaimLocation] = useState("");
    const [type, setType] = useState<1 | 2 | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [compressing, setCompressing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        } catch (err) {
            setError("Failed to process image. Please try another.");
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!type) { setError("Please select a status (lost or found)."); return; }
        setLoading(true);
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) { setError("You must be logged in to post."); setLoading(false); return; }
            const token = await user.getIdToken();
            const res = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, location, returnClaimLocation, type, image: image ?? null }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Something went wrong."); return; }
            alert("Successfully posted!");
            setTitle(""); setDescription(""); setLocation("");
            setReturnClaimLocation(""); setType(null); setImage(null);
            const modal = document.getElementById("add-post-modal") as HTMLInputElement;
            if (modal) modal.checked = false;
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const initials = userEmail ? userEmail[0].toUpperCase() : "U";

    return (
        <div>
            <div className="sticky top-0 z-0 bg-white pb-3 flex justify-center mb-5"> 
                <div className="avatar avatar-placeholder mt-5 mr-3">
                    <div className="bg-[#f34700] text-white h-12 w-12 rounded-full">
                        <span>{initials}</span>
                    </div>
                </div>
                <label htmlFor="add-post-modal" className="block cursor-pointer w-200">
                    <fieldset className="fieldset bg-white shadow-lg p-3 rounded-xl border border-[#f34700] w-full">
                        <legend className="fieldset-legend text-[#f34700]">Create a post</legend>
                            
                            <input
                                type="text"
                                className="input h-5 w-full pointer-events-none text-[#3d4451]"
                                placeholder="What did you lose or find?"
                                readOnly
                            />
                    </fieldset>
                </label>
            </div>

            <input type="checkbox" id="add-post-modal" className="modal-toggle" />
            <div className="modal">
                <label
                    htmlFor="add-post-modal"
                    className="modal-overlay absolute bg-black/50 inset-0 cursor-pointer">
                </label>
                <div className="modal-box bg-[#f34700] text-white relative border-0 rounded-lg">
                    <label htmlFor="add-post-modal" className="btn btn-sm btn-circle absolute right-2 top-2 text-black text-lg border-none">X</label>
                    <h3 className="text-lg font-bold mb-4">Create New Post</h3>
                    {error && <div className="bg-red-800 text-white text-sm rounded-lg px-3 py-2 mb-3">{error}</div>}
                    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Title</legend>
                            <input type="text" className="input input-bordered w-full text-[#3d4451]" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Description</legend>
                            <textarea className="textarea h-20 w-full bg-white text-[#3d4451] rounded-lg" placeholder="Describe the item..." value={description} onChange={(e) => setDescription(e.target.value)} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Location</legend>
                            <input type="text" className="input input-bordered w-full text-[#3d4451]" placeholder="Enter Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Where to Claim/Return?</legend>
                            <textarea className="textarea h-15 w-full bg-white text-[#3d4451] rounded-lg" placeholder="Add retrieval details..." value={returnClaimLocation} onChange={(e) => setReturnClaimLocation(e.target.value)} />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Status</legend>
                            <div className="flex justify-center gap-30">
                                <label className="flex items-center gap-2 text-[15px]">
                                    <input type="radio" name="radio-1" className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600" checked={type === 1} onChange={() => setType(1)} />
                                    lost item
                                </label>
                                <label className="flex items-center gap-2 text-[15px]">
                                    <input type="radio" name="radio-1" className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600" checked={type === 2} onChange={() => setType(2)} />
                                    found item
                                </label>
                            </div>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Photo (optional)</legend>
                            <input type="file" accept="image/*" className="file-input w-full text-black rounded-lg hover:border-[#f34700]" onChange={handleFileChange} />
                            {compressing && <p className="text-sm mt-1 opacity-80">Compressing image...</p>}
                            {image && !compressing && (
                                <img src={image} alt="Preview" className="mt-2 rounded-lg max-h-32 object-cover w-full" />
                            )}
                        </fieldset>
                        <button type="submit" disabled={loading || compressing} className="btn bg-black text-white border-none rounded-lg w-full text-[15px] hover:bg-gray-800 disabled:opacity-60">
                            {loading ? "Posting..." : "Post"}
                        </button>
                    </form>
                </div>
            </div>
            <PostsFeed />
        </div>
    );
}