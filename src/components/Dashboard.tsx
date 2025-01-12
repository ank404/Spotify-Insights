import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopTracks, fetchTopArtists, fetchUserProfile, fetchCurrentlyPlaying, fetchTopAlbums, fetchSavedTracks, controlPlayback } from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Music, User, Album } from "lucide-react";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtists";
import { ThemeToggle } from "./ThemeToggle";
import NowPlaying from "./NowPlaying";
import TopAlbums from "./TopAlbums";
import SavedTracks from "./SavedTracks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const timeRanges = [
  { value: "short_term", label: "Last 3 Months" },
  { value: "medium_term", label: "Last 6 Months" },
  { value: "long_term", label: "All Time" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("medium_term");
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [tracksData, artistsData, userData] = await Promise.all([
          fetchTopTracks(token, timeRange),
          fetchTopArtists(token, timeRange),
          fetchUserProfile(token),
        ]);
        setTopTracks(tracksData.items);
        setTopArtists(artistsData.items);
        setUser(userData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try logging in again.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-500">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <header className="flex justify-between items-center">
          <div className="space-y-2">
            <svg viewBox="0 0 1134 340" className="text-spotify-green w-32 animate-fade-in">
              <title>Spotify Stats</title>
              <path fill="currentColor" d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-54-32-144-35-195-19zm379 91c-17 0-33-6-47-20-1 0-1 1-1 1l-16 19c-1 1-1 2 0 3 18 16 40 24 64 24 34 0 55-19 55-47 0-24-15-37-50-46-29-7-34-12-34-22s10-16 23-16 25 5 39 15c0 0 1 1 2 1s1-1 1-1l14-20c1-1 1-1 0-2-16-13-35-20-56-20-31 0-53 19-53 46 0 29 20 38 52 46 28 6 32 12 32 22 0 11-10 17-25 17zm95-77v-13c0-1-1-2-2-2h-26c-1 0-2 1-2 2v147c0 1 1 2 2 2h26c1 0 2-1 2-2v-46c10 11 21 16 36 16 27 0 54-21 54-61s-27-60-54-60c-15 0-26 5-36 17zm30 78c-18 0-31-15-31-35s13-34 31-34 30 14 30 34-12 35-30 35zm68-34c0 34 27 60 62 60s62-27 62-61-26-60-61-60-63 27-63 61zm30-1c0-20 13-34 32-34s33 15 33 35-13 34-32 34-33-15-33-35zm140-58v-29c0-1 0-2-1-2h-26c-1 0-2 1-2 2v29h-13c-1 0-2 1-2 2v22c0 1 1 2 2 2h13v58c0 23 11 35 34 35 9 0 18-2 25-6 1 0 1-1 1-2v-21c0-1 0-2-1-2h-2c-5 3-11 4-16 4-8 0-12-4-12-12v-54h30c1 0 2-1 2-2v-22c0-1-1-2-2-2h-30zm129-3c0-11 4-15 13-15 5 0 10 0 15 2h1s1-1 1-2V93c0-1 0-2-1-2-5-2-12-3-22-3-24 0-36 14-36 39v5h-13c-1 0-2 1-2 2v22c0 1 1 2 2 2h13v89c0 1 1 2 2 2h26c1 0 1-1 1-2v-89h25l37 89c-4 9-8 11-14 11-5 0-10-1-15-4h-1l-1 1-9 19c0 1 0 3 1 3 9 5 17 7 27 7 19 0 30-9 39-33l45-116v-2c0-1-1-1-2-1h-27c-1 0-1 1-1 2l-28 78-30-78c0-1-1-2-2-2h-44v-3zm-83 3c-1 0-2 1-2 2v113c0 1 1 2 2 2h26c1 0 1-1 1-2V134c0-1 0-2-1-2h-26zm-6-33c0 10 9 19 19 19s18-9 18-19-8-18-18-18-19 8-19 18zm245 69c10 0 19-8 19-18s-9-18-19-18-18 8-18 18 8 18 18 18zm0-34c9 0 17 7 17 16s-8 16-17 16-16-7-16-16 7-16 16-16zm4 18c3-1 5-3 5-6 0-4-4-6-8-6h-8v19h4v-6h4l4 6h5zm-3-9c2 0 4 1 4 3s-2 3-4 3h-4v-6h4z"/>
            </svg>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-spotify-green to-blue-400 bg-clip-text text-transparent animate-fade-in">
              Welcome, {user?.display_name}
            </h1>
            <p className="text-muted-foreground">Check out your top music</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="bg-transparent hover:bg-accent transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign out of your account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        <NowPlaying />

        <div className="relative">
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                variant={timeRange === range.value ? "default" : "outline"}
                className={`${
                  timeRange === range.value
                    ? "bg-spotify-green text-white transform scale-105"
                    : "bg-transparent hover:bg-accent"
                } transition-all duration-300`}
              >
                {range.label}
              </Button>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="bg-card w-full justify-start">
            <TabsTrigger
              value="tracks"
              className="data-[state=active]:bg-spotify-green transition-all duration-300"
            >
              <Music className="w-4 h-4 mr-2" />
              Top Tracks
            </TabsTrigger>
            <TabsTrigger
              value="artists"
              className="data-[state=active]:bg-spotify-green transition-all duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              Top Artists
            </TabsTrigger>
            <TabsTrigger
              value="albums"
              className="data-[state=active]:bg-spotify-green transition-all duration-300"
            >
              <Album className="w-4 h-4 mr-2" />
              Top Albums
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-spotify-green transition-all duration-300"
            >
              <Music className="w-4 h-4 mr-2" />
              Saved Tracks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-4 focus-visible:outline-none">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin text-spotify-green text-xl">
                  <Music className="w-8 h-8" />
                </div>
              </div>
            ) : (
              <TopTracks tracks={topTracks} />
            )}
          </TabsContent>

          <TabsContent value="artists" className="space-y-4 focus-visible:outline-none">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin text-spotify-green text-xl">
                  <User className="w-8 h-8" />
                </div>
              </div>
            ) : (
              <TopArtists artists={topArtists} />
            )}
          </TabsContent>

          <TabsContent value="albums" className="space-y-4 focus-visible:outline-none">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin text-spotify-green text-xl">
                  <Album className="w-8 h-8" />
                </div>
              </div>
            ) : (
              <TopAlbums timeRange={timeRange} />
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 focus-visible:outline-none">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin text-spotify-green text-xl">
                  <Music className="w-8 h-8" />
                </div>
              </div>
            ) : (
              <SavedTracks />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
