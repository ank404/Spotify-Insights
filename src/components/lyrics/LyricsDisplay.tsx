import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LyricsDisplayProps {
  trackName: string;
  artistName: string;
}

const LyricsDisplay = ({ trackName, artistName }: LyricsDisplayProps) => {
  const [lyrics, setLyrics] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        // Note: You would need to implement an actual lyrics API service
        // This is a placeholder to show the component structure
        const response = await fetch(
          `https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(
            trackName
          )}`
        );
        const data = await response.json();
        setLyrics(data.lyrics || "Lyrics not found");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch lyrics",
          variant: "destructive",
        });
        setLyrics("Lyrics not available");
      }
    };

    if (trackName && artistName) {
      fetchLyrics();
    }
  }, [trackName, artistName, toast]);

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Lyrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line text-sm">
          {lyrics || "Loading lyrics..."}
        </div>
      </CardContent>
    </Card>
  );
};

export default LyricsDisplay;