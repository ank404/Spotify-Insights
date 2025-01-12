// Spotify API configuration and utility functions
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
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

export const fetchCurrentlyPlaying = async (token: string) => {
  const response = await fetch(`${BASE_URL}/me/player`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch currently playing");
  return response.json();
};

export const fetchTopAlbums = async (token: string, timeRange: string = "medium_term") => {
  const response = await fetch(
    `${BASE_URL}/me/top/tracks?limit=20&time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch top albums");
  const data = await response.json();
  // Extract unique albums from top tracks
  const uniqueAlbums = Array.from(
    new Map(data.items.map((track: any) => [track.album.id, track.album])).values()
  ).slice(0, 10);
  return uniqueAlbums;
};

export const controlPlayback = async (token: string, action: string) => {
  // First get the active device
  const deviceResponse = await fetch(`${BASE_URL}/me/player/devices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!deviceResponse.ok) throw new Error('Failed to fetch devices');
  const devices = await deviceResponse.json();
  
  // Get the active device ID
  const activeDevice = devices.devices.find((d: any) => d.is_active) || devices.devices[0];
  if (!activeDevice) throw new Error('No active device found');
  
  const deviceId = activeDevice.id;
  let endpoint = `${BASE_URL}/me/player/${action}`;
  let method = 'POST';
  
  // Handle different actions
  switch (action) {
    case 'play':
    case 'pause':
      endpoint = `${BASE_URL}/me/player/${action}?device_id=${deviceId}`;
      method = 'PUT';
      break;
    case 'next':
    case 'previous':
      endpoint = `${BASE_URL}/me/player/${action}`;
      method = 'POST';
      break;
    default:
      throw new Error(`Invalid action: ${action}`);
  }

  const response = await fetch(endpoint, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to ${action} playback`);
  }
  return response.status === 204;
};

export const setVolume = async (token: string, volumePercent: number) => {
  const response = await fetch(`${BASE_URL}/me/player/volume?volume_percent=${volumePercent}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to set volume');
  return response.status === 204;
};

export const fetchQueue = async (token: string) => {
  const response = await fetch(`${BASE_URL}/me/player/queue`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch queue');
  return response.json();
};