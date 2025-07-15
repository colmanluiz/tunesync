"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ServiceType } from "@/types/services";
import api from "@/lib/api";
import { MdMusicNote, MdCheck } from "react-icons/md";
import { Button } from "@/components/ui/button";

const serviceConfig = {
  SPOTIFY: {
    name: "Spotify",
    icon: "/spotify_green.svg",
    color: "var(--spotify-primary)",
  },
  YOUTUBE: {
    name: "YouTube Music",
    icon: "/youtube.svg",
    color: "var(--youtube-primary)",
  },
  "APPLE-MUSIC": {
    name: "Apple Music",
    icon: "/apple-music.svg",
    color: "#fa243c",
  },
  "AMAZON-MUSIC": {
    name: "Amazon Music",
    icon: "/amazon-music.svg",
    color: "#232F3E",
  },
  DEEZER: {
    name: "Deezer",
    icon: "/deezer_purple.svg",
    color: "var(--deezer-primary)",
  },
  SOUNDCLOUD: {
    name: "SoundCloud",
    icon: "/soundcloud.svg",
    color: "#ff5500",
  },
  TIDAL: {
    name: "Tidal",
    icon: "/tidal.svg",
    color: "#000000",
  },
} as const;

export default function ServiceSuccessPage({
  params,
}: {
  params: { service: ServiceType };
}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [profile, setProfile] = useState<any>(null);
  const service = serviceConfig[params.service];

  useEffect(() => {
    if (token) {
      // Fetch user profile from the service
      api
        .get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3001"
          }/auth/${params.service.toLowerCase()}/profile`
        )
        .then((res) => {
          console.log("Profile data:", res.data);
          setProfile(res.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [token, params.service]);

  if (!service) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--background-light)">
      <div className="w-full max-w-md text-center">
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

        <div className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold">
          <MdCheck className="size-6 text-(--jonquil-600)" />
          <h1>{service.name} Connected!</h1>
        </div>

        {profile && (
          <div className="mb-8 rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">Account Information</h2>
            <div className="space-y-2 text-left">
              {profile.display_name && (
                <p className="text-sm">
                  <span className="text-(--silver-500)">Name:</span>{" "}
                  <span className="font-medium">{profile.display_name}</span>
                </p>
              )}
              {profile.email && (
                <p className="text-sm">
                  <span className="text-(--silver-500)">Email:</span>{" "}
                  <span className="font-medium">{profile.email}</span>
                </p>
              )}
              {profile.id && (
                <p className="text-sm">
                  <span className="text-(--silver-500)">ID:</span>{" "}
                  <span className="font-medium">{profile.id}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button asChild variant="primary">
            <Link href="/services">Return to Services</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
