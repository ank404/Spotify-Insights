import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../ThemeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

const DashboardHeader = ({ userName, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="flex justify-between items-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-spotify-green to-blue-400 bg-clip-text text-transparent animate-fade-in">
          Welcome, {userName}
        </h1>
        <p className="text-muted-foreground">Check out your top music</p>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onLogout}
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
  );
};

export default DashboardHeader;