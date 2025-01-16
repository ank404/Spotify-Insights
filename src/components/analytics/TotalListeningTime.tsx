import { useQuery } from "@tanstack/react-query";
import { fetchUserListeningHistory } from "@/lib/spotify/analytics";
import { Clock } from "lucide-react";

const TotalListeningTime = () => {
  const token = localStorage.getItem("spotify_token");

  const { data: listeningHistory } = useQuery({
    queryKey: ["listening-history"],
    queryFn: () => fetchUserListeningHistory(token!, 50),
    enabled: !!token,
  });

  const calculateTotalTime = () => {
    if (!listeningHistory?.items) return 0;
    return listeningHistory.items.reduce((total: number, track: any) => {
      return total + (track.track.duration_ms / 1000 / 60); // Convert to minutes
    }, 0);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours} hours and ${remainingMinutes} minutes`;
  };

  const totalMinutes = calculateTotalTime();

  if (!totalMinutes) return null;

  return (
    <div className="bg-card dark:bg-spotify-darkgray p-4 rounded-lg shadow-lg mb-4 animate-fade-in">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Clock className="w-5 h-5 text-spotify-green" />
        <span className="bg-gradient-to-r from-spotify-green to-blue-400 bg-clip-text text-transparent">
          Your Recent Listening Time: {formatTime(totalMinutes)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Based on your last 50 played tracks
      </p>
    </div>
  );
};

export default TotalListeningTime;