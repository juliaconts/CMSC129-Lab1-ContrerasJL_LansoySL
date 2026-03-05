import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "auth" | "unauth">("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setStatus(user ? "auth" : "unauth");
    });
    return () => unsub();
  }, []);

  if (status === "loading") return null;
  if (status === "unauth") return <Navigate to="/login" replace />;
  return <>{children}</>;
}