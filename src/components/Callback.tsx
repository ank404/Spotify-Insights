import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromUrl } from "@/lib/spotify";
import { useToast } from "@/hooks/use-toast";

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = () => {
      const { access_token, state } = getTokenFromUrl();
      const storedState = localStorage.getItem("spotify_auth_state");

      if (!access_token || state !== storedState) {
        toast({
          title: "Authentication Error",
          description: "Failed to log in with Spotify. Please try again.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      localStorage.setItem("spotify_token", access_token);
      localStorage.removeItem("spotify_auth_state");
      navigate("/dashboard");
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black">
      <div className="animate-pulse text-spotify-green text-xl">
        Logging you in...
      </div>
    </div>
  );
};

export default Callback;