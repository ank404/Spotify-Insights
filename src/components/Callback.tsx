import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromUrl } from "@/lib/spotify/auth";
import { useToast } from "@/hooks/use-toast";

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { access_token, token_type, expires_in, state } = getTokenFromUrl();

    if (access_token) {
      localStorage.setItem("spotify_token", access_token);
      navigate("/dashboard");
    } else {
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate with Spotify. Please try again.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);

  return null;
};

export default Callback;
