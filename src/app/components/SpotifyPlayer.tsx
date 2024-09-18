"use client"

import { useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTY_KEY;

export default function SpotifyPlayer() {
  const [token, setToken] = useState<string | null>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1] ?? null
      window.location.hash = ""
      window.localStorage.setItem("token", token ?? "")
    }

    setToken(token)
  }, [])

  useEffect(() => {
    if (token) {
      getCurrentTrack()
    }
  }, [token])

  const getCurrentTrack = async () => {
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 204) {
      console.log("No track currently playing")
      return
    }

    const data = await response.json()
    setCurrentTrack(data.item)
    setIsPlaying(data.is_playing)
  }

  const handlePlayPause = async () => {
    const url = `https://api.spotify.com/v1/me/player/${isPlaying ? 'pause' : 'play'}`
    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setIsPlaying(!isPlaying)
  }

  const handleSkip = async (direction: 'next' | 'previous') => {
    const url = `https://api.spotify.com/v1/me/player/${direction}`
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    getCurrentTrack()
  }

  if (!token) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Spotify Player</h2>
        <a href={`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&scope=user-read-currently-playing,user-modify-playback-state&response_type=token`} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300">
          Login to Spotify
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Spotify Player</h2>
      {currentTrack ? (
        <div className="flex items-center space-x-4">
          <img src={currentTrack.album.images[0].url} alt={currentTrack.name} className="w-16 h-16 rounded-md" />
          <div>
            <p className="font-semibold">{currentTrack.name}</p>
            <p className="text-gray-500">{currentTrack.artists.map(artist => artist.name).join(', ')}</p>
          </div>
        </div>
      ) : (
        <p>No track currently playing</p>
      )}
      <div className="flex justify-center space-x-4 mt-4">
        <button onClick={() => handleSkip('previous')} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300">
          <SkipBack size={24} />
        </button>
        <button onClick={handlePlayPause} className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={() => handleSkip('next')} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300">
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  )
}