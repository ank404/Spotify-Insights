import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLoginURL } from "@/lib/spotify/auth";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black p-4">
      <div className="max-w-md w-full space-y-2 animate-fade-in">
          <div className="mx-auto w-80 h-60 relative animate-slide-up shadow-lg">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">Welcome to Your Music Dashboard</h1>
          <p className="text-white text-2xl font-semibold mb-8">
            Discover your top tracks and artists
          </p>
        </div>
        <Button
          onClick={() => {
            window.location.href = createLoginURL();
          }}
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
