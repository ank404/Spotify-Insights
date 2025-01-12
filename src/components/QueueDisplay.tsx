import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause } from "lucide-react";
import { controlPlayback } from "@/lib/spotify/playback";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface QueueDisplayProps {
  queue: any[];
}

const QueueDisplay = ({ queue }: QueueDisplayProps) => {
  const { toast } = useToast();
  const token = localStorage.getItem("spotify_token");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handlePlayPause = async (trackId: string, trackUri: string) => {
    try {
      if (playingTrackId === trackId) {
        await controlPlayback(token!, "pause");
        setPlayingTrackId(null);
      } else {
        await controlPlayback(token!, "play", trackUri);
        setPlayingTrackId(trackId);
      }
      toast({
        title: "Success",
        description: playingTrackId === trackId ? "Paused track" : "Playing track from queue",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to control playback. Make sure Spotify is active.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Queue
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Up Next</SheetTitle>
          <SheetDescription>Songs in your queue</SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-1 space-y-1 h-full">
          {queue?.map((track: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              >
              {track.album?.images?.[2] && (
                <img
                  src={track.album.images[2].url}
                  alt="Album art"
                  className="w-16 h-16 rounded-md"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white text-sm truncate transition-colors duration-300">
                  {track.name}
                </h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-muted-foreground truncate transition-colors duration-300">
                  {track.artists?.map((a: any) => a.name).join(", ")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePlayPause(track.id, track.uri)}
                className="transition-opacity"
              >
                {playingTrackId === track.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default QueueDisplay;