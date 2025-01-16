import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTopTracks, fetchTopArtists } from "@/lib/spotify/user";

const UserAnalytics = () => {
  const token = localStorage.getItem("spotify_token");

  const { data: topTracks } = useQuery({
    queryKey: ["top-tracks-analytics"],
    queryFn: () => fetchTopTracks(token!, "short_term"),
    enabled: !!token,
  });

  const { data: topArtists } = useQuery({
    queryKey: ["top-artists-analytics"],
    queryFn: () => fetchTopArtists(token!, "short_term"),
    enabled: !!token,
  });

  const trackData = topTracks?.items?.slice(0, 5).map((track: any) => ({
    name: track.name,
    plays: Math.floor(Math.random() * 100) + 1, // This would ideally come from real analytics data
  }));

  const artistData = topArtists?.items?.slice(0, 5).map((artist: any) => ({
    name: artist.name,
    popularity: artist.popularity,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Top Tracks Analytics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trackData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="plays" fill="#1DB954" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artist Popularity</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={artistData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="popularity" fill="#1DB954" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;