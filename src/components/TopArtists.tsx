import { Crown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { fetchTopArtists } from "@/lib/spotify/user";

interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  genres: string[];
}

interface TopArtistsProps {
  timeRange: string;
}

const TopArtists = ({ timeRange }: TopArtistsProps) => {
  const token = localStorage.getItem("spotify_token");
  
  const { data: artistsData } = useQuery({
    queryKey: ["top-artists", timeRange],
    queryFn: () => fetchTopArtists(token!, timeRange),
    enabled: !!token,
  });

  const artists = artistsData?.items || [];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="bg-card shadow-md dark:hover:bg-spotify-lightgray group animate-fade-in p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="relative">
            <img
              src={artist.images[0]?.url}
              alt={artist.name}
              className="w-full aspect-square object-cover rounded-full"
            />
            {index === 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -top-2 -right-2 bg-spotify-green p-2 rounded-full animate-pulse">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Top Artist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-black dark:text-white">#{index + 1}</span>
            <h3 className="text-lg font-semibold text-black dark:text-white mt-2 truncate">
              {artist.name}
            </h3>
            <p className="text-gray-700 dark:text-gray-400 text-sm mt-1 truncate">
              {artist.genres.slice(0, 2).join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopArtists;