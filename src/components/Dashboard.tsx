import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "@/lib/spotify/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Music, User, Album } from "lucide-react";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtists";
import TopAlbums from "./TopAlbums";
import SavedTracks from "./SavedTracks";
import NowPlaying from "./NowPlaying";
import DashboardHeader from "./dashboard/DashboardHeader";
import TimeRangeSelector from "./dashboard/TimeRangeSelector";
import UserAnalytics from "./analytics/UserAnalytics";
import MusicRecommendations from "./recommendations/MusicRecommendations";
import TotalListeningTime from "./analytics/TotalListeningTime";

const timeRanges = [
  { value: "short_term", label: "Last 3 Months" },
  { value: "medium_term", label: "Last 6 Months" },
  { value: "long_term", label: "All Time" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("medium_term");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserProfile(token);
        setUser(userData);
      } catch (error) {
        // Clear token and redirect to login if the request fails
        localStorage.removeItem("spotify_token");
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

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
        <DashboardHeader userName={user?.display_name} onLogout={handleLogout} />
        <TotalListeningTime />
        <NowPlaying />
        <TimeRangeSelector
          timeRanges={timeRanges}
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
        />

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
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-spotify-green transition-all duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-4 focus-visible:outline-none">
            <TopTracks timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="artists" className="space-y-4 focus-visible:outline-none">
            <TopArtists timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="albums" className="space-y-4 focus-visible:outline-none">
            <TopAlbums timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 focus-visible:outline-none">
            <SavedTracks />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 focus-visible:outline-none">
            <UserAnalytics />
            <MusicRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;