# Spotify Session Dashboard

Spotify Session Dashboard is a web application that provides users with insights into their Spotify listening habits. It displays top tracks, top artists, and other personalized statistics.

## Features

- View top tracks and artists
- See currently playing track
- Control playback (play, pause)
- Responsive design

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Spotify Web API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/ank404/spotify-session-dashboard.git
cd spotify-session-dashboard
```

2. Install dependencies:

```sh
npm install
```

3. Set up environment variables:

```sh
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
```
4. Start the development server:

```sh
npm run dev
```

## Building for Production

To create a production build, run:
```sh
npm run build
```

### Deploying 

You can deploy the contents of the dist folder to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Environment Variables
You can set environment variables in the following ways:
- Using the `.env` file in the root of the project
- VITE_SPOTIFY_CLIENT_ID: Your Spotify client ID
- VITE_SPOTIFY_REDIRECT_URI: The redirect URI set in your Spotify developer dashboard
