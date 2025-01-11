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
          <div className="mx-auto w-60 h-40 relative animate-slide-up shadow-lg">
            <img src="/Spotify.png" alt="Spotify Logo" className="w-full h-full object-contain" />
          </div>
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white mb-2">Welcome to Spotify Stats</h1>
          <p className="text-white text-3xl font-semibold mb-8">
            Discover your top tracks and artists
          </p>
        </div>
        <Button
          onClick={handleLogin}
          className="w-full bg-spotify-green hover:bg-spotify-green/90 text-white px-8 py-6 text-lg rounded-full hover:animate-none animate-slide-up transition-all duration-300 flex items-center space-x-2 hover:scale-105 shadow-lg"
        >
          <LogIn className="w-5 h-5" />
          <span>Login with Spotify</span>
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;