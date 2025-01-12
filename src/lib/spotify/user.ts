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

export const fetchTopAlbums = async (token: string, timeRange: string = "medium_term") => {
  const response = await fetch(
    `${BASE_URL}/me/top/tracks?limit=20&time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch top albums");
  const data = await response.json();
  const uniqueAlbums = Array.from(
    new Map(data.items.map((track: any) => [track.album.id, track.album])).values()
  ).slice(0, 10);
  return uniqueAlbums;
};

export const fetchSavedTracks = async (token: string, limit: number = 20, offset: number = 0) => {
  const response = await fetch(
    `${BASE_URL}/me/tracks?limit=${limit}&offset=${offset}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch saved tracks");
  return response.json();
};