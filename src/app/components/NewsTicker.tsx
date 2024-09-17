"use client"

import { useState, useEffect } from 'react'

const API_KEY = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY || 'test';

interface NewsItem {
  title: string;
  url: string;
}

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('Fetching news...')
        const response = await fetch(
          `https://content.guardianapis.com/search?section=world&show-fields=headline&api-key=${API_KEY}`
        )
        console.log('Response status:', response.status)
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`)
        }
        const data = await response.json()
        console.log('Received data:', data)
        if (data.response && data.response.results) {
          const newsItems = data.response.results.map((article: any) => ({
            title: article.fields.headline,
            url: article.webUrl
          }))
          console.log('Processed news items:', newsItems)
          setNews(newsItems)
        } else {
          throw new Error('Invalid data structure received from API')
        }
      } catch (error) {
        console.error('Error fetching news:', error)
        setError(`No se pudieron cargar las noticias: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNews()
  }, [])

  if (isLoading) {
    return <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">Cargando noticias...</div>
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>
  }

  if (news.length === 0) {
    return <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">No se encontraron noticias.</div>
  }

  const renderNews = () => (
    <>
      {news.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 text-white hover:text-yellow-300 transition-colors duration-300"
        >
          {item.title}
        </a>
      ))}
    </>
  )

  return (
    <div className="bg-gray-800 py-2 overflow-hidden relative">
      <div className="news-label absolute left-0 top-0 bottom-0 bg-red-600 text-white px-4 py-2 flex items-center font-bold z-10">
        NEWS:
      </div>
      <div className="animate-ticker inline-block whitespace-nowrap pl-24"> {/* Added padding-left to make space for the NEWS label */}
        {renderNews()}
        {renderNews()} {/* Duplicamos el contenido para crear un efecto continuo */}
      </div>
    </div>
  )
}