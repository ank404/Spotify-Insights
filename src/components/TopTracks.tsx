import { useState } from "react";
import { Play, Pause } from "lucide-react";

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

  const handlePlay = (previewUrl: string | null, trackId: string) => {
    if (!previewUrl) return;

    if (playing === trackId) {
      audio?.pause();
      setPlaying(null);
      setAudio(null);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(previewUrl);
      newAudio.play();
      newAudio.onended = () => {
        setPlaying(null);
        setAudio(null);
      };
      setPlaying(trackId);
      setAudio(newAudio);
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="bg-spotify-darkgray p-4 rounded-lg hover:bg-spotify-lightgray transition-colors duration-300"
        >
          <div className="relative group">
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-full aspect-square object-cover rounded-md"
            />
            {track.preview_url && (
              <button
                onClick={() => handlePlay(track.preview_url, track.id)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {playing === track.id ? (
                  <Pause className="w-12 h-12 text-white" />
                ) : (
                  <Play className="w-12 h-12 text-white" />
                )}
              </button>
            )}
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">#{index + 1}</span>
            <h3 className="text-lg font-semibold text-white mt-2">{track.name}</h3>
            <p className="text-gray-400">{track.artists.map(a => a.name).join(", ")}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopTracks;