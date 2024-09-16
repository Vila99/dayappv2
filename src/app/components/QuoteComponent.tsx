"use client"

import { useState, useEffect } from 'react'

const quotes = [
  { text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.', author: 'Robert Collier' },
  { text: 'La única forma de hacer un gran trabajo es amar lo que haces.', author: 'Steve Jobs' },
  { text: 'El futuro pertenece a quienes creen en la belleza de sus sueños.', author: 'Eleanor Roosevelt' },
  { text: 'La vida es lo que pasa mientras estás ocupado haciendo otros planes.', author: 'John Lennon' },
  { text: 'No cuentes los días, haz que los días cuenten.', author: 'Muhammad Ali' },
]

export default function QuoteComponent() {
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem('quoteDate')

    if (storedDate !== today) {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setQuote(newQuote)
      localStorage.setItem('quoteDate', today)
      localStorage.setItem('dailyQuote', JSON.stringify(newQuote))
    } else {
      const storedQuote = localStorage.getItem('dailyQuote')
      if (storedQuote) {
        setQuote(JSON.parse(storedQuote))
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">Frase del día</h2>
      <blockquote className="italic text-gray-600">{quote.text}</blockquote>
      <p className="text-right mt-2">- {quote.author}</p>
    </div>
  )
}