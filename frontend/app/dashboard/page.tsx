import { Plus } from "lucide-react";
import {
  MdMusicNote,
  MdRefresh,
  MdPeople,
  MdFeaturedPlayList,
} from "react-icons/md";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ServiceCard } from "@/components/dashboard/service-card";
import { PlaylistCard } from "@/components/dashboard/playlist-card";
import { ServiceType } from "@/types/services";
import { SiYoutubemusic } from "react-icons/si";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";

// Mock data - replace with real data later
const stats = [
  {
    title: "Total Playlists",
    value: 12,
    description: "Across all services",
    icon: MdFeaturedPlayList,
    trend: { value: 20, isPositive: true },
  },
  {
    title: "Synced Playlists",
    value: 8,
    description: "Last 30 days",
    icon: MdRefresh,
    trend: { value: 10, isPositive: true },
  },
  {
    title: "Total Tracks",
    value: "1,234",
    description: "Unique tracks",
    icon: MdMusicNote,
  },
  {
    title: "Active Services",
    value: 3,
    description: "Connected platforms",
    icon: MdPeople,
  },
];

const services = [
  {
    name: "Spotify",
    serviceId: "SPOTIFY" as ServiceType,
    isConnected: true,
    lastSync: "2 hours ago",
    icon: <img src="/spotify_green.svg" alt="Spotify" className="size-6" />,
  },
  {
    name: "Apple Music",
    serviceId: "APPLE-MUSIC" as ServiceType,
    isConnected: false,
    icon: <img src="/apple-music.svg" alt="Apple Music" className="size-6" />,
  },
  {
    name: "YouTube Music",
    serviceId: "YOUTUBE" as ServiceType,
    isConnected: true,
    lastSync: "1 day ago",
    icon: <SiYoutubemusic className="size-6 text-(--youtube-primary)" />,
  },
];

const playlists = [
  {
    name: "Workout Mix",
    trackCount: 45,
    source: "Spotify",
    imageUrl: "https://picsum.photos/200",
  },
  {
    name: "Chill Vibes",
    trackCount: 82,
    source: "YouTube Music",
    imageUrl: "https://picsum.photos/201",
  },
  {
    name: "Road Trip",
    trackCount: 120,
    source: "Spotify",
    imageUrl: "https://picsum.photos/202",
  },
  {
    name: "Focus Flow",
    trackCount: 65,
    source: "YouTube Music",
    imageUrl: "https://picsum.photos/203",
  },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center gap-4 px-8">
              <h1 className="text-lg font-medium flex-1">Dashboard</h1>
              <div className="flex justify-end">
                <Button variant="primary" size="default">
                  <Plus className="size-4" />
                  Add Playlist
                </Button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
              ))}
            </div>

            {/* Connected Services */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Connected Services</h2>
                <Link
                  href="/services"
                  className="text-sm text-(--silver-600) hover:text-(--silver-800) hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid gap-4">
                {services.map((service) => (
                  <ServiceCard key={service.name} {...service} />
                ))}
              </div>
            </div>

            {/* Recent Playlists */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Recent Playlists</h2>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {playlists.map((playlist) => (
                  <PlaylistCard key={playlist.name} {...playlist} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
