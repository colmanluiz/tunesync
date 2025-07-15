"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import api from "@/lib/api";
import { ServiceType } from "@/types/services";
import { MdMusicNote } from "react-icons/md";

const serviceConfig = {
  SPOTIFY: {
    name: "Spotify",
    icon: "/spotify_green.svg",
    color: "var(--spotify-primary)",
    endpoint: "/auth/spotify/login",
  },
  YOUTUBE: {
    name: "YouTube Music",
    icon: "/youtube.svg",
    color: "var(--youtube-primary)",
    endpoint: "/auth/youtube/login",
  },
  "APPLE-MUSIC": {
    name: "Apple Music",
    icon: "/apple-music.svg",
    color: "#fa243c",
    endpoint: "/auth/apple/login",
  },
  "AMAZON-MUSIC": {
    name: "Amazon Music",
    icon: "/amazon-music.svg",
    color: "#232F3E",
    endpoint: "/auth/amazon/login",
  },
  DEEZER: {
    name: "Deezer",
    icon: "/deezer_purple.svg",
    color: "var(--deezer-primary)",
    endpoint: "/auth/deezer/login",
  },
  SOUNDCLOUD: {
    name: "SoundCloud",
    icon: "/soundcloud.svg",
    color: "#ff5500",
    endpoint: "/auth/soundcloud/login",
  },
  TIDAL: {
    name: "Tidal",
    icon: "/tidal.svg",
    color: "#000000",
    endpoint: "/auth/tidal/login",
  },
} as const;

export default function ServiceConnectPage({
  params,
}: {
  params: { service: ServiceType };
}) {
  const router = useRouter();
  const service = serviceConfig[params.service];

  useEffect(() => {
    if (!service) {
      router.push("/services");
      return;
    }

    // Auto-trigger service login when component mounts
    handleServiceLogin();

    function handleMessage(event: MessageEvent) {
      if (event.data?.type === `${params.service}_AUTH_SUCCESS`) {
        console.log(`${service.name} auth success`, event.data);
        router.push(
          `/services/${params.service.toLowerCase()}/success?token=${
            event.data.token
          }`
        );
      } else {
        console.log(`${service.name} auth error`, event.data);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [service]);

  const handleServiceLogin = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3001";

      // Get state param
      const { data } = await api.post(
        `${backendUrl}/auth/${params.service.toLowerCase()}/state`
      );
      const state = data.state;

      const authUrl = `${backendUrl}${service.endpoint}?state=${state}`;

      // Open popup centered
      const width = 400;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      window.open(
        authUrl,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
      );
    } catch (error) {
      console.error(`${service.name} login error:`, error);
    }
  };

  if (!service) return null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-(--background-light)">
        <div className="text-center">
          <div
            className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl"
            style={{ backgroundColor: service.color }}
          >
            {service.icon.endsWith(".svg") ? (
              <img src={service.icon} alt={service.name} className="size-8" />
            ) : (
              <MdMusicNote className="size-8 text-white" />
            )}
          </div>
          <h1 className="mb-4 text-2xl font-bold">
            Connecting to {service.name}...
          </h1>
          <p className="text-(--silver-600)">
            Please wait while we redirect you to {service.name}.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
