import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface QueueDisplayProps {
  queue: any[];
}

const QueueDisplay = ({ queue }: QueueDisplayProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Queue
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Up Next</SheetTitle>
          <SheetDescription>Songs in your queue</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {queue?.map((track: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              {track.album?.images?.[2] && (
                <img
                  src={track.album.images[2].url}
                  alt="Album art"
                  className="w-10 h-10 rounded"
                />
              )}
              <div>
                <p className="font-medium">{track.name}</p>
                <p className="text-sm text-muted-foreground">
                  {track.artists?.map((a: any) => a.name).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QueueDisplay;