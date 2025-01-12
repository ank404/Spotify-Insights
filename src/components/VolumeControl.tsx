import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import { setVolume } from "@/lib/spotify";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface VolumeControlProps {
  initialVolume: number;
}

const VolumeControl = ({ initialVolume }: VolumeControlProps) => {
  const { toast } = useToast();
  const token = localStorage.getItem("spotify_token");
  const [volume, setVolumeState] = useState(initialVolume);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleVolumeChange = async (value: number[]) => {
    if (!token || isAdjusting) return;
    setVolumeState(value[0]);
    setIsAdjusting(true);
    
    try {
      await setVolume(token, value[0]);
      toast({
        title: "Success",
        description: "Volume updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update volume",
        variant: "destructive",
      });
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Volume2 className="w-4 h-4" />
      <Slider
        value={[volume]}
        min={0}
        max={100}
        step={1}
        className="w-24"
        onValueChange={handleVolumeChange}
      />
    </div>
  );
};

export default VolumeControl;