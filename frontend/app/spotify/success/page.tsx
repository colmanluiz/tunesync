"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function SpotifySuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [profile, setProfile] = useState<any>(null);
  // Optionally, update your app state/context here
  useEffect(() => {
    if (token) {
      // Save token, refetch user, or update connection status
      // localStorage.setItem("spotifyToken", token);
      // Or call your backend to refresh the user's connection status
      api
        .get(
          `${
            process.env.BACKEND_URL || "http://127.0.0.1:3001"
          }/auth/spotify/profile`
        )
        .then((res) => {
          console.log("res", res.data);
          setProfile(res.data);
        });
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Spotify Connected!</h1>
        <p className="mb-4 text-green-600">
          Your Spotify account is now linked.
        </p>
        {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
        <Link href="/dashboard" className="text-blue-600 underline">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
