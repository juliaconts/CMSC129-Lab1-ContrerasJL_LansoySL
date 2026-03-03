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
        <div>
            {posts.map((post) => (
                <div key={post.id} style={{ border: "1px solid #ccc", marginBottom: "16px", padding: "12px" }}>
                    {post.image && (
                        <img src={post.image} alt={post.title} style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
                    )}
                    <p><strong>Type:</strong> {post.type === 1 ? "Lost" : "Found"}</p>
                    <p><strong>Title:</strong> {post.title}</p>
                    <p><strong>Description:</strong> {post.description}</p>
                    <p><strong>Location:</strong> {post.location}</p>
                    <p><strong>Claim/Return at:</strong> {post.returnClaimLocation}</p>
                </div>
            ))}
        </div>
    );
}