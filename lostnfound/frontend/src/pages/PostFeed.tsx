import { useEffect, useState } from "react";

interface Post {
    id: string;
    title: string;
    description: string;
    location: string;
    returnClaimLocation: string;
    type: 1 | 2;
    image: string | null;
}

export default function PostsFeed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("http://localhost:3000/posts");
                const data = await res.json();
                if (!res.ok) { setError("Failed to load posts."); return; }
                setPosts(data);
            } catch (err) {
                setError("Network error. Could not load posts.");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>{error}</p>;
    if (posts.length === 0) return <p>No posts yet.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-16">
            {posts.map((post) => (
            <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
                {/* Image */}
                {post.image && (
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-110 object-cover"
                />
                )}

                {/* Content */}
                <div className="p-5 space-y-3">
                
                {/* Status Badge */}
                <span
                    className={`inline-block px-3 py-1 text-md font-semibold rounded-full ${
                    post.type === 1
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                >
                    {post.type === 1 ? "Lost Item" : "Found Item"}
                </span>

                {/* Title */}
                <h2 className="text-gray-800"
                style={{ fontSize: "38px", fontFamily: "Nerko One, cursive" }}>
                    {post.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-m">
                    {post.description}
                </p>

                {/* Location */}
                <p className="text-m text-gray-700">
                    <span className="font-semibold">Location:</span> {post.location}
                </p>

                {/* Claim */}
                <p className="text-m text-gray-700">
                    <span className="font-semibold">
                    {post.type === 1 ? "If found:" : "Claim in:"}
                    </span>{" "}
                    {post.returnClaimLocation}
                </p>
                </div>
            </div>
            ))}
        </div>
);
}