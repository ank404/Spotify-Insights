export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
export const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-top-read",
  "user-library-read",
].join(" ");

export const generateRandomString = (length: number) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

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