import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTopTracks } from "@/lib/spotify/user";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { controlPlayback } from "@/lib/spotify/playback";
import { useToast } from "@/hooks/use-toast";

const MusicRecommendations = () => {
  const token = localStorage.getItem("spotify_token");
  const { toast } = useToast();
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => fetchTopTracks(token!, "medium_term"),
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

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recommendations?.items?.slice(0, 6).map((track: any) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors group"
            >
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className="w-12 h-12 rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{track.name}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {track.artists.map((artist: any) => artist.name).join(", ")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePlayPause(track.id, track.uri)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {playingTrackId === track.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendations;