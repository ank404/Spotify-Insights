import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "@/lib/spotify/user";
import { useToast } from "@/hooks/use-toast";
import NowPlaying from "./NowPlaying";
import DashboardHeader from "./dashboard/DashboardHeader";
import TimeRangeSelector from "./dashboard/TimeRangeSelector";
import TotalListeningTime from "./analytics/TotalListeningTime";
import DashboardContent from "./dashboard/DashboardContent";

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
        <DashboardContent timeRange={timeRange} />
      </div>
    </div>
  );
};

export default Dashboard;