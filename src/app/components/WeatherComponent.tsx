"use client"

import { useState, useEffect } from 'react'
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Loader } from 'lucide-react'

const API_KEY = 'f45e2b1289bc1ae9ebbb718fa129fbb5' // Replace with your actual API key

interface WeatherData {
  main: {
    temp: number
  }
  weather: [{
    main: string
    description: string
  }]
  name: string
}

export default function WeatherComponent() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          fetchWeather(latitude, longitude)
        },
        () => {
          setError("Unable to retrieve your location")
          setLoading(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
    }
  }, [])

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      )
      if (!response.ok) {
        throw new Error('Weather data not available')
      }
      const data: WeatherData = await response.json()
      setWeather(data)
    } catch (err) {
      setError('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-400" />
      case 'clouds': return <Cloud className="w-8 h-8 text-gray-400" />
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />
      case 'snow': return <CloudSnow className="w-8 h-8 text-blue-200" />
      case 'thunderstorm': return <CloudLightning className="w-8 h-8 text-yellow-600" />
      default: return <Cloud className="w-8 h-8 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
        <Loader className="w-6 h-6 animate-spin text-purple-500" />
        <span className="ml-2">Loading weather data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md text-red-500">
        {error}
      </div>
    )
  }

  if (!weather) {
    return null
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{weather.name}</h2>
          <p className="text-gray-600">{weather.weather[0].description}</p>
        </div>
        <div className="flex items-center">
          {getWeatherIcon(weather.weather[0].main)}
          <span className="text-3xl ml-2">{Math.round(weather.main.temp)}°C</span>
        </div>
      </div>
    </div>
  )
}