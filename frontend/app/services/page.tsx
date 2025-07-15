"use client";

import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ServiceCard } from "@/components/dashboard/service-card";
import { ServiceType } from "@/types/services";
import { MdAdd } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { SiSoundcloud, SiYoutubemusic } from "react-icons/si";

const services = [
  {
    serviceId: "SPOTIFY" as ServiceType,
    name: "Spotify",
    description: "Stream and sync your Spotify playlists",
    icon: <img src="/spotify_green.svg" alt="Spotify" className="size-6" />,
    isConnected: false,
  },
  {
    serviceId: "YOUTUBE" as ServiceType,
    name: "YouTube Music",
    description: "Access your YouTube Music library",
    icon: <SiYoutubemusic className="size-6 text-(--youtube-primary)" />,
    isConnected: false,
  },
  {
    serviceId: "APPLE-MUSIC" as ServiceType,
    name: "Apple Music",
    description: "Sync with your Apple Music collection",
    icon: <img src="/apple-music.svg" alt="Apple Music" className="size-6" />,
    isConnected: false,
  },
  {
    serviceId: "AMAZON-MUSIC" as ServiceType,
    name: "Amazon Music",
    description: "Connect your Amazon Music playlists",
    icon: <img src="/amazon-music.svg" alt="Amazon Music" className="size-6" />,
    isConnected: false,
  },
  {
    serviceId: "DEEZER" as ServiceType,
    name: "Deezer",
    description: "Connect your Deezer playlists",
    icon: <img src="/deezer_purple.svg" alt="Deezer" className="size-6" />,
    isConnected: false,
  },
  {
    serviceId: "SOUNDCLOUD" as ServiceType,
    name: "SoundCloud",
    description: "Connect your SoundCloud playlists",
    icon: <SiSoundcloud className="size-6 text-[#ff5500]" />,
    isConnected: false,
  },
  {
    serviceId: "TIDAL" as ServiceType,
    name: "Tidal",
    description: "Connect your Tidal playlists",
    icon: <img src="/tidal.svg" alt="Tidal" className="size-6" />,
    isConnected: false,
  },
];

export default function ServicesPage() {
  const router = useRouter();

  const handleConnect = (serviceId: ServiceType) => {
    router.push(`/services/${serviceId.toLowerCase()}/connect`);
  };

  const handleDisconnect = (serviceId: ServiceType) => {
    // TODO: Implement service disconnection
    console.log("Disconnecting from", serviceId);
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <div className="border-b">
          <div className="flex h-16 items-center gap-4 px-8">
            <h1 className="text-lg font-medium flex-1">Music Services</h1>
            <div className="flex justify-end">
              <Button variant="primary" size="default">
                <MdAdd className="size-4" />
                Add Service
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-(--silver-800) dark:text-(--silver-200)">
              Connected Services
            </h2>
            <p className="text-sm text-(--silver-600)">
              Manage your music service connections and sync settings
            </p>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.serviceId}
                {...service}
                onConnect={() => handleConnect(service.serviceId)}
                onDisconnect={() => handleDisconnect(service.serviceId)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
