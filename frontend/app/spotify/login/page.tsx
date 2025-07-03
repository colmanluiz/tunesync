"use client";
import { ProtectedRoute } from "@/components/protected-route";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SpotifyLoginPage() {
  const router = useRouter();
  useEffect(() => {
    // Auto-trigger Spotify login when component mounts
    handleSpotifyLogin();

    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "SPOTIFY_AUTH_SUCCESS") {
        console.log("Spotify auth success", event.data);
        router.push(`/spotify/success?token=${event.data.token}`);
      } else {
        console.log("Spotify auth error", event.data);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSpotifyLogin = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3001";

      // Get state param
      const { data } = await api.post(`${backendUrl}/auth/spotify/state`);
      const state = data.state;

      const spotifyAuthUrl = `${backendUrl}/auth/spotify/login?state=${state}`;

      // Open popup centered, mobile size (e.g. 400x700)
      const width = 400;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      window.open(
        spotifyAuthUrl,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
      );
    } catch (error) {
      console.error("Spotify login error:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connecting to Spotify...</h1>
          <p className="text-gray-600">
            Please wait while we redirect you to Spotify.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
