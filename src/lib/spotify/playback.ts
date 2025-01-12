const BASE_URL = "https://api.spotify.com/v1";

export const fetchCurrentlyPlaying = async (token: string) => {
  const response = await fetch(`${BASE_URL}/me/player`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch currently playing");
  return response.json();
};

export const fetchQueue = async (token: string) => {
  const response = await fetch(`${BASE_URL}/me/player/queue`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch queue");
  return response.json();
};

export const controlPlayback = async (token: string, action: string, trackUri?: string) => {
  const deviceResponse = await fetch(`${BASE_URL}/me/player/devices`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!deviceResponse.ok) throw new Error('Failed to fetch devices');
  const devices = await deviceResponse.json();

  const activeDevice = devices.devices.find((d: any) => d.is_active) || devices.devices[0];
  if (!activeDevice) throw new Error('No active device found');

  const deviceId = activeDevice.id;
  let endpoint = `${BASE_URL}/me/player/${action}`;
  let method = 'POST';
  let body = null;

  switch (action) {
    case 'play':
      endpoint = `${BASE_URL}/me/player/play?device_id=${deviceId}`;
      method = 'PUT';
      body = JSON.stringify({ uris: [trackUri] });
      break;
    case 'pause':
      endpoint = `${BASE_URL}/me/player/pause?device_id=${deviceId}`;
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
    body,
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