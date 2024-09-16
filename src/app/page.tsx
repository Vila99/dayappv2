"use client"

import TareasComponent from './components/TareasComponent'
import StockComponent from './components/StockComponent'
import QuoteComponent from './components/QuoteComponent'
import WeatherComponent from './components/WeatherComponent'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">My Daily App</h1>
        </div>
      </nav>
      <div className="container mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <WeatherComponent />
            <StockComponent />
            <QuoteComponent />
          </div>
          <TareasComponent />
        </div>
      </div>
    </div>
  )
}