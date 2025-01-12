import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { controlPlayback } from "@/lib/spotify";
import { useToast } from "@/hooks/use-toast";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlaybackChange: () => void;
}

const PlaybackControls = ({ isPlaying, onPlaybackChange }: PlaybackControlsProps) => {
  const { toast } = useToast();
  const token = localStorage.getItem("spotify_token");

  const handlePlaybackControl = async (action: string) => {
    if (!token) return;
    try {
      await controlPlayback(token, action);
      onPlaybackChange();
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

  return (
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
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
  );
};

export default PlaybackControls;