import { Button } from "@/components/ui/button";

interface TimeRange {
  value: string;
  label: string;
}

interface TimeRangeSelectorProps {
  timeRanges: TimeRange[];
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const TimeRangeSelector = ({ timeRanges, selectedRange, onRangeChange }: TimeRangeSelectorProps) => {
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        {timeRanges.map((range) => (
          <Button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            variant={selectedRange === range.value ? "default" : "outline"}
            className={`${
              selectedRange === range.value
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
  );
};

export default TimeRangeSelector;