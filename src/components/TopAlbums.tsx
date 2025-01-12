import { useQuery } from "@tanstack/react-query";
import { fetchTopAlbums } from "@/lib/spotify";
import { Album } from "lucide-react";

interface TopAlbumsProps {
  timeRange: string;
}

const TopAlbums = ({ timeRange }: TopAlbumsProps) => {
  const token = localStorage.getItem("spotify_token");

  const { data: albums, isLoading } = useQuery({
    queryKey: ["top-albums", timeRange],
    queryFn: () => fetchTopAlbums(token!, timeRange),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin text-spotify-green text-xl">
          <Album className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
      {albums?.map((album: any) => (
        <div
          key={album.id}
          className="bg-white dark:bg-spotify-darkgray p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-spotify-lightgray transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group"
        >
          <div className="relative aspect-square">
            <img
              src={album.images[0]?.url}
              alt={album.name}
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
              <Album className="w-8 h-8 text-black dark:text-white" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-black dark:text-white truncate">
              {album.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
              {album.artists.map((a: any) => a.name).join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopAlbums;
