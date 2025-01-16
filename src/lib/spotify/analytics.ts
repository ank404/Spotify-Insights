const BASE_URL = "https://api.spotify.com/v1";

export const fetchUserListeningHistory = async (token: string, limit: number = 50) => {
  const response = await fetch(`${BASE_URL}/me/player/recently-played?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch listening history");
  return response.json();
};

export const fetchTrackAudioFeatures = async (token: string, trackId: string) => {
  const response = await fetch(`${BASE_URL}/audio-features/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch track audio features");
  return response.json();
};