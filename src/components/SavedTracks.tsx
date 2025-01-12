import { useQuery } from "@tanstack/react-query";
import { fetchSavedTracks } from "@/lib/spotify/user";
import { controlPlayback } from "@/lib/spotify/playback";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SavedTracks = () => {
  const token = localStorage.getItem("spotify_token");
  const { toast } = useToast();
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const { data: savedTracks, isLoading } = useQuery({
    queryKey: ["saved-tracks"],
    queryFn: () => fetchSavedTracks(token!),
    enabled: !!token,
  });

  const handlePlayPause = async (trackId: string, trackUri: string) => {
    try {
      if (playingTrackId === trackId) {
        await controlPlayback(token!, "pause");
        setPlayingTrackId(null);
      } else {
        await controlPlayback(token!, "play", trackUri);
        setPlayingTrackId(trackId);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to control playback. Make sure Spotify is active.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading saved tracks...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {savedTracks?.items.map((item: any) => (
        <div
          key={item.track.id}
          className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group animate-fade-in"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.track.album.images[0]?.url}
              alt={item.track.name}
              className="w-16 h-16 rounded-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{item.track.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {item.track.artists.map((artist: any) => artist.name).join(", ")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePlayPause(item.track.id, item.track.uri)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {playingTrackId === item.track.id ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedTracks;