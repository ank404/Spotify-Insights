import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, User, Album } from "lucide-react";
import TopTracks from "../TopTracks";
import TopArtists from "../TopArtists";
import TopAlbums from "../TopAlbums";
import SavedTracks from "../SavedTracks";
import UserAnalytics from "../analytics/UserAnalytics";
import MusicRecommendations from "../recommendations/MusicRecommendations";

interface DashboardContentProps {
  timeRange: string;
}

const DashboardContent = ({ timeRange }: DashboardContentProps) => {
  return (
    <Tabs defaultValue="tracks" className="space-y-6">
      <TabsList className="bg-card w-full justify-start flex-wrap h-auto gap-2 p-2">
        <TabsTrigger
          value="tracks"
          className="data-[state=active]:bg-spotify-green transition-all duration-300"
        >
          <Music className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Top</span> Tracks
        </TabsTrigger>
        <TabsTrigger
          value="artists"
          className="data-[state=active]:bg-spotify-green transition-all duration-300"
        >
          <User className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Top</span> Artists
        </TabsTrigger>
        <TabsTrigger
          value="albums"
          className="data-[state=active]:bg-spotify-green transition-all duration-300"
        >
          <Album className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Top</span> Albums
        </TabsTrigger>
        <TabsTrigger
          value="saved"
          className="data-[state=active]:bg-spotify-green transition-all duration-300"
        >
          <Music className="w-4 h-4 mr-2" />
          Saved
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
  );
};

export default DashboardContent;