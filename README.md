# Spotlytics Dashboard  
*Visualize Your Spotify Listening Habits in Style*

Spotlytics Dashboard is an interactive web application designed to give you detailed insights into your Spotify listening habits. Discover your top tracks, favorite artists, and much more in a beautifully designed interface. Powered by the Spotify Web API, React, and Tailwind CSS, it brings your music statistics to life.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Building for Production](#building-for-production)
- [Deploying](#deploying)

---

## Features
- **View Your Top Tracks and Artists**: Ranked lists of your most-played songs and favorite artists.
- **Currently Playing Section**: See real-time information about the track you're listening to.
- **Playback Control**: Play, pause, or skip tracks directly from the dashboard.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Personalized Stats**: Custom insights based on your Spotify usage.

---

## Technologies Used
- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **API Integration**: Spotify Web API
- **Build Tool**: Vite

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ank404/spotify-session-dashboard.git
   cd spotify-session-dashboard

2. Install dependencies:
  ```sh
  npm install
  ```

3. Set up environment variables:
  ```sh
  VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
  VITE_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
  ```
## Running Locally

Start the development server:
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
- Using the `.env.example` file in the root of the project
- VITE_SPOTIFY_CLIENT_ID: Your Spotify client ID
- VITE_SPOTIFY_REDIRECT_URI: The redirect URI set in your Spotify developer dashboard
