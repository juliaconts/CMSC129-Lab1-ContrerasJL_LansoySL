import { useState } from "react";

export default function Homepage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [returnClaimLocation, setReturnClaimLocation] = useState("");
    const [type, setType] = useState<1 | 2 | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!type) {
            setError("Please select a status (lost or found).");
            return;
        }

        const payload = { title, description, location, returnClaimLocation, type };
        console.log("Submitting payload:", payload);

        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Response status:", res.status);
            console.log("Response body:", data);

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
                return;
            }

            alert("Successfully posted!");
            // reset the form
            setTitle("");
            setDescription("");
            setLocation("");
            setReturnClaimLocation("");
            setType(null);
            const modal = document.getElementById("add-post-modal") as HTMLInputElement;
            if (modal) modal.checked = false;

        } catch (err) {
            console.error("Fetch error:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/*add post button*/}
            <label htmlFor="add-post-modal" className="btn bg-black text-white border-none rounded-lg text-[15px] mb-4">
                + Add Post
            </label>

            {/* modal */}
            <input type="checkbox" id="add-post-modal" className="modal-toggle" />
            <div className="modal fixed z-[100]">
                <div className="modal-box bg-[#f34700] text-white relative border-0 rounded-lg">
                    <label
                        htmlFor="add-post-modal"
                        className="btn btn-sm btn-circle absolute right-2 top-2 text-black text-lg border-none"
                    >
                        ✕
                    </label>

                    <h3 className="text-lg font-bold mb-4">Create New Post</h3>

                    {error && (
                        <div className="bg-red-800 text-white text-sm rounded-lg px-3 py-2 mb-3">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Title</legend>
                            <input
                                type="text"
                                className="input input-bordered w-full text-[#3d4451]"
                                placeholder="Enter Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                className="textarea h-15 w-full bg-white text-[#3d4451] rounded-lg"
                                placeholder="Add retrieval details..."
                                value={returnClaimLocation}
                                onChange={(e) => setReturnClaimLocation(e.target.value)}
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Status</legend>
                            <div className="flex justify-center gap-30">
                                <label className="flex items-center gap-2 text-[15px]">
                                    <input
                                        type="radio"
                                        name="radio-1"
                                        className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600"
                                        checked={type === 1}
                                        onChange={() => setType(1)}
                                    />
                                    lost item
                                </label>
                                <label className="flex items-center gap-2 text-[15px]">
                                    <input
                                        type="radio"
                                        name="radio-1"
                                        className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600"
                                        checked={type === 2}
                                        onChange={() => setType(2)}
                                    />
                                    found item
                                </label>
                            </div>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Pick a file</legend>
                            <input type="file" className="file-input w-full text-black rounded-lg hover:border-[#f34700]" />
                        </fieldset>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn bg-black text-white border-none rounded-lg w-full text-[15px] hover:bg-gray-800 disabled:opacity-60"
                        >
                            {loading ? "Posting..." : "Post"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}