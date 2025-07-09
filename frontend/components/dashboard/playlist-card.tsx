import { Music2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlaylistCardProps {
  name: string;
  trackCount: number;
  source: string;
  imageUrl?: string;
  onSync?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PlaylistCard({
  name,
  trackCount,
  source,
  imageUrl,
  onSync,
  onEdit,
  onDelete,
}: PlaylistCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card">
      <div className="aspect-square">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted">
            <Music2 className="size-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {trackCount} tracks • {source}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSync}>Sync Now</DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
