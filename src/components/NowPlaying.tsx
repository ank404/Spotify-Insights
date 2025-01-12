import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentlyPlaying, controlPlayback } from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NowPlaying = () => {
  const { toast } = useToast();
  const token = localStorage.getItem("spotify_token");
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: currentTrack, refetch } = useQuery({
    queryKey: ["currently-playing"],
    queryFn: () => fetchCurrentlyPlaying(token!),
    enabled: !!token,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (currentTrack?.is_playing !== undefined) {
      setIsPlaying(currentTrack.is_playing);
    }
  }, [currentTrack]);

  const handlePlaybackControl = async (action: string) => {
    if (!token) return;
    try {
      await controlPlayback(token, action);
      refetch();
      toast({
        title: "Success",
        description: `Playback ${action} successful`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to control playback. Make sure Spotify is active.",
        variant: "destructive",
      });
    }
  };

  if (!currentTrack) {
    return (
      <div className="bg-card p-4 rounded-lg shadow-lg animate-fade-in">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Music className="w-5 h-5" />
          <span>No track playing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center gap-4">
        {currentTrack.item?.album?.images?.[0] && (
          <img
            src={currentTrack.item.album.images[0].url}
            alt="Album art"
            className="w-16 h-16 rounded-md"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold truncate">{currentTrack.item?.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {currentTrack.item?.artists?.map((a: any) => a.name).join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlaybackControl("previous")}
                  className="hover:scale-110 transition-transform"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous track</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlaybackControl(isPlaying ? "pause" : "play")}
                  className="hover:scale-110 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlaybackControl("next")}
                  className="hover:scale-110 transition-transform"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next track</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;