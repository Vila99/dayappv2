"use client"

import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, Search, Trash2, Loader } from 'lucide-react'

const API_KEY = '0109TWSLWT1Y9RN2' // Replace with your actual API key

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export default function StockComponent() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteStocks')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  useEffect(() => {
    if (favorites.length > 0) {
      fetchStockData(favorites)
    }
  }, [favorites])

  const fetchStockData = async (symbols: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const promises = symbols.map(symbol =>
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`)
          .then(response => response.json())
      )
      const results = await Promise.all(promises)
      const stockData: StockData[] = results.map(result => {
        const quote = result['Global Quote']
        return {
          symbol: quote['01. symbol'],
          name: quote['01. symbol'], // Alpha Vantage doesn't provide company name in this endpoint
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
        }
      })
      setStocks(stockData)
    } catch (err) {
      setError('Failed to fetch stock data')
    } finally {
      setLoading(false)
    }
  }

  const searchStock = async () => {
    if (!searchTerm) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${API_KEY}`)
      const data = await response.json()
      if (data.bestMatches && data.bestMatches.length > 0) {
        const symbol = data.bestMatches[0]['1. symbol']
        if (!favorites.includes(symbol)) {
          const newFavorites = [...favorites, symbol]
          setFavorites(newFavorites)
          localStorage.setItem('favoriteStocks', JSON.stringify(newFavorites))
          fetchStockData([symbol])
        }
      } else {
        setError('No matching stocks found')
      }
    } catch (err) {
      setError('Failed to search for stock')
    } finally {
      setLoading(false)
      setSearchTerm('')
    }
  }

  const removeFavorite = (symbol: string) => {
    const newFavorites = favorites.filter(fav => fav !== symbol)
    setFavorites(newFavorites)
    localStorage.setItem('favoriteStocks', JSON.stringify(newFavorites))
    setStocks(stocks.filter(stock => stock.symbol !== symbol))
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">Stocks</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stocks..."
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={searchStock}
          className="bg-purple-500 text-white p-2 rounded-r-md hover:bg-purple-600 transition duration-300 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" size={24} /> : <Search size={24} />}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {stocks.map(stock => (
          <div key={stock.symbol} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
            <div>
              <h3 className="font-semibold">{stock.symbol}</h3>
              <p className="text-sm text-gray-500">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${stock.price.toFixed(2)}</p>
              <p className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center justify-end`}>
                {stock.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {Math.abs(stock.change).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeFavorite(stock.symbol)}
              className="ml-4 text-red-500 hover:text-red-700"
              aria-label={`Remove ${stock.symbol} from favorites`}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}