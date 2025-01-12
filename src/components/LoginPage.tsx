import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLoginURL } from "@/lib/spotify/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Spotify App</h1>
        <p className="text-xl text-gray-600">Log in to access your music</p>
        <a
          href={createLoginURL()}
          className="mt-4 inline-block bg-spotify-green text-white py-2 px-4 rounded hover:bg-spotify-darkgreen transition"
        >
          Login with Spotify
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
