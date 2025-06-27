import { ServiceCard } from "@/components/service-card";
import { ServiceType } from "@/types/services";
import { FaSpotify, FaYoutube, FaApple, FaDeezer } from "react-icons/fa6";

export default function ServicesPage() {
  const services = [
    {
      id: "SPOTIFY" as ServiceType,
      name: "Spotify",
      description: "Connect your Spotify account",
      icon: <FaSpotify className="w-10 h-10" />,
      connectUrl: "/auth/spotify/login",
    },
    {
      id: "YOUTUBE" as ServiceType,
      name: "YouTube Music",
      description: "Connect your YouTube Music account",
      icon: <FaYoutube className="w-10 h-10" />,
      connectUrl: "/auth/youtube/login",
    },
    {
      id: "APPLE-MUSIC" as ServiceType,
      name: "Apple Music",
      description: "Connect your Apple Music account",
      icon: <FaApple className="w-10 h-10" />,
      connectUrl: "/auth/apple/login",
    },
    {
      id: "DEEZER" as ServiceType,
      name: "Deezer",
      description: "Connect your Deezer account",
      icon: <FaDeezer className="w-10 h-10" />,
      connectUrl: "/auth/deezer/login",
    },
  ];

  return (
    <div className="flex flex-col gap-4 items-center pt-4">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          name={service.name}
          serviceId={service.id}
          connectUrl={service.connectUrl}
          icon={service.icon}
        />
      ))}
    </div>
  );
}
