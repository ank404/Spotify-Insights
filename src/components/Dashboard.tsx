import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopTracks, fetchTopArtists, fetchUserProfile, fetchCurrentlyPlaying, fetchTopAlbums, controlPlayback } from "@/lib/spotify";
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
