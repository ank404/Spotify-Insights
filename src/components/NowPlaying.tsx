import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentlyPlaying, fetchQueue } from "@/lib/spotify/playback";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import PlaybackControls from "./PlaybackControls";
import VolumeControl from "./VolumeControl";
import QueueDisplay from "./QueueDisplay";

const NowPlaying = () => {
  const token = localStorage.getItem("spotify_token");
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: currentTrack, refetch } = useQuery({
    queryKey: ["currently-playing"],
    queryFn: () => fetchCurrentlyPlaying(token!),
    enabled: !!token,
    refetchInterval: 5000,
  });

  const { data: queueData } = useQuery({
    queryKey: ["queue"],
    queryFn: () => fetchQueue(token!),
    enabled: !!token,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (currentTrack?.is_playing !== undefined) {
      setIsPlaying(currentTrack.is_playing);
    }
  }, [currentTrack]);

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
    <div className="space-y-2 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-spotify-green to-blue-400 bg-clip-text text-transparent animate-fade-in">
        Your currently playing track on {currentTrack?.device?.name || "Spotify"}
      </h2>
      <div className="bg-gradient-to-br from-spotify-darkgray to-spotify-black p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-spotify-lightgray animate-fade-in">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {currentTrack.item?.album?.images?.[0] && (
            <img
              src={currentTrack.item.album.images[0].url}
              alt="Album art"
              className="w-32 h-32 md:w-16 md:h-16 rounded-md animate-fade-in hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-semibold truncate text-lg md:text-base animate-fade-in">
              {currentTrack.item?.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {currentTrack.item?.artists?.map((a: any) => a.name).join(", ")}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="hidden md:block">
              <VolumeControl initialVolume={50} />
            </div>
            <QueueDisplay queue={queueData?.queue || []} />
            <PlaybackControls isPlaying={isPlaying} onPlaybackChange={refetch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;