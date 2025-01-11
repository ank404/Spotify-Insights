import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopTracks, fetchTopArtists, fetchUserProfile } from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Music, User } from "lucide-react";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtists";
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
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <div className="animate-pulse text-spotify-green text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-black text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-spotify-green to-blue-400 bg-clip-text text-transparent">
              Welcome, {user?.display_name}
            </h1>
            <p className="text-gray-400">Check out your top music</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
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
        </header>

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
                    : "bg-transparent text-white hover:bg-white hover:text-black"
                } transition-all duration-300`}
              >
                {range.label}
              </Button>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
        </div>

        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="bg-spotify-darkgray w-full justify-start">
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
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;