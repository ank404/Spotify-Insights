import { Button } from "@/components/ui/button";
import { createLoginURL } from "@/lib/spotify";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = createLoginURL();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to Spotify Stats</h1>
          <p className="text-gray-400 mb-8">
            Discover your top tracks and artists
          </p>
        </div>
        <Button
          onClick={handleLogin}
          className="w-full bg-spotify-green hover:bg-opacity-80 text-white py-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <LogIn className="w-5 h-5" />
          <span>Login with Spotify</span>
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;