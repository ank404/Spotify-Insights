import { useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  preview_url: string | null;
}

interface TopTracksProps {
  tracks: Track[];
}

const TopTracks = ({ tracks }: TopTracksProps) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handlePlay = async (previewUrl: string | null, trackId: string) => {
    if (!previewUrl) return;

    if (playing === trackId) {
      audio?.pause();
      setPlaying(null);
      setAudio(null);
      setProgress(0);
    } else {
      if (audio) {
        audio.pause();
      }
      setLoading(trackId);
      const newAudio = new Audio(previewUrl);
      
      newAudio.addEventListener('timeupdate', () => {
        const percentage = (newAudio.currentTime / newAudio.duration) * 100;
        setProgress(percentage);
      });

      newAudio.addEventListener('canplaythrough', () => {
        setLoading(null);
        newAudio.play();
        setPlaying(trackId);
        setAudio(newAudio);
      });

      newAudio.addEventListener('ended', () => {
        setPlaying(null);
        setAudio(null);
        setProgress(0);
      });

      // Start loading the audio
      try {
        await newAudio.load();
      } catch (error) {
        console.error('Error loading audio:', error);
        setLoading(null);
      }
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
            {track.preview_url && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handlePlay(track.preview_url, track.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"
                      disabled={loading === track.id}
                    >
                      {loading === track.id ? (
                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                      ) : playing === track.id ? (
                        <Pause className="w-12 h-12 text-white" />
                      ) : (
                        <Play className="w-12 h-12 text-white" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{playing === track.id ? 'Pause' : 'Play Preview'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {playing === track.id && (
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <Progress value={progress} className="h-1 bg-white/20" />
              </div>
            )}
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