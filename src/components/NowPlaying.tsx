import { useEffect, useState, useRef } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Visualization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{x: number, y: number, radius: number, color: string, velocity: {x: number, y: number}}> = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: isPlaying ? '#1DB954' : '#cccccc',
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        }
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0 || particle.x > canvas.width) particle.velocity.x *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.velocity.y *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = isPlaying ? '#1DB954' : '#cccccc';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  if (!currentTrack) {
    return (
      <div className="bg-card dark:bg-spotify-darkgray p-4 rounded-lg shadow-lg animate-fade-in">
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
      <div className="relative bg-card dark:bg-spotify-darkgray p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-border dark:border-spotify-lightgray animate-fade-in">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full rounded-lg opacity-30"
        />
        <div className="relative flex flex-col md:flex-row items-center gap-4">
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