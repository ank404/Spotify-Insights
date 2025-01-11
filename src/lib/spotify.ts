// Spotify API configuration and utility functions
const CLIENT_ID = "99d4093625df4103b288148d0a2007ab"; // Updated Client ID
const REDIRECT_URI = "http://localhost:8080/callback"; // Updated with /callback endpoint
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-library-read",
].join(" ");

// Generate random string for state
const generateRandomString = (length: number) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// Create login URL
export const createLoginURL = () => {
  const state = generateRandomString(16);
  localStorage.setItem("spotify_auth_state", state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "token",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    state: state,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Parse the access token from URL hash
export const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return {
    access_token: params.get("access_token"),
    token_type: params.get("token_type"),
    expires_in: params.get("expires_in"),
    state: params.get("state"),
  };
};

// API calls
const BASE_URL = "https://api.spotify.com/v1";

export const fetchUserProfile = async (token: string) => {
  const response = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
};

export const fetchTopTracks = async (token: string, timeRange: string = "medium_term") => {
  const response = await fetch(
    `${BASE_URL}/me/top/tracks?limit=10&time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch top tracks");
  return response.json();
};

export const fetchTopArtists = async (token: string, timeRange: string = "medium_term") => {
  const response = await fetch(
    `${BASE_URL}/me/top/artists?limit=10&time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch top artists");
  return response.json();
};