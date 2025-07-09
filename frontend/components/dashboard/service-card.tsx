import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceType } from "@/types/services";

interface ServiceCardProps {
  name: string;
  serviceId: ServiceType;
  icon: React.ReactNode;
  isConnected?: boolean;
  lastSync?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function ServiceCard({
  name,
  icon,
  isConnected = false,
  lastSync,
  onConnect,
  onDisconnect,
}: ServiceCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-(--silver-900)">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            {isConnected ? (
              <span className="flex items-center gap-1 rounded-full bg-(--jonquil-100) px-2 py-0.5 text-xs font-medium text-(--jonquil-950)">
                <Check className="size-3" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-(--silver-50) px-2 py-0.5 text-xs font-medium text-(--silver-600)">
                <X className="size-3" />
                Not Connected
              </span>
            )}
          </div>
          {lastSync && (
            <p className="text-sm text-(--silver-500)">
              Last synced: {lastSync}
            </p>
          )}
        </div>
      </div>
      <div>
        {isConnected ? (
          <Button variant="destructiveOutline" size="sm" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={onConnect}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
