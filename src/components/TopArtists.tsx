import { Crown } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  genres: string[];
}

interface TopArtistsProps {
  artists: Artist[];
}

const TopArtists = ({ artists }: TopArtistsProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="bg-spotify-darkgray p-4 rounded-lg hover:bg-spotify-lightgray transition-colors duration-300"
        >
          <div className="relative">
            <img
              src={artist.images[0]?.url}
              alt={artist.name}
              className="w-full aspect-square object-cover rounded-full"
            />
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-spotify-green p-2 rounded-full">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-white">#{index + 1}</span>
            <h3 className="text-lg font-semibold text-white mt-2">{artist.name}</h3>
            <p className="text-gray-400 text-sm mt-1">
              {artist.genres.slice(0, 2).join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopArtists;