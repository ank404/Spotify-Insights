import { useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { controlPlayback } from "@/lib/spotify/playback";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchTopTracks } from "@/lib/spotify/user";

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  uri: string;
}

interface TopTracksProps {
  timeRange: string;
}

const TopTracks = ({ timeRange }: TopTracksProps) => {
  const { toast } = useToast();
  const token = localStorage.getItem("spotify_token");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const { data: tracksData } = useQuery({
    queryKey: ["top-tracks", timeRange],
    queryFn: () => fetchTopTracks(token!, timeRange),
    enabled: !!token,
  });

  const tracks = tracksData?.items || [];

  const handlePlayPause = async (trackId: string, trackUri: string) => {
    try {
      if (playingTrackId === trackId) {
        await controlPlayback(token!, "pause");
        setPlayingTrackId(null);
      } else {
        setLoading(trackId);
        await controlPlayback(token!, "play", trackUri);
        setPlayingTrackId(trackId);
        setLoading(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to control playback. Make sure Spotify is active.",
        variant: "destructive",
      });
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="bg-card shadow-md dark:hover:bg-spotify-lightgray group animate-fade-in p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="relative group">
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-full aspect-square object-cover rounded-md"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handlePlayPause(track.id, track.uri)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"
                    disabled={loading === track.id}
                  >
                    {loading === track.id ? (
                      <Loader2 className="w-12 h-12 text-white animate-spin" />
                    ) : playingTrackId === track.id ? (
                      <Pause className="w-12 h-12 text-white" />
                    ) : (
                      <Play className="w-12 h-12 text-white" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{playingTrackId === track.id ? 'Pause' : 'Play'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-black dark:text-white">#{index + 1}</span>
            <h3 className="text-lg font-semibold text-black dark:text-white mt-2 truncate">
              {track.name}
            </h3>
            <p className="text-gray-700 dark:text-gray-400 truncate">
              {track.artists.map(a => a.name).join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopTracks;