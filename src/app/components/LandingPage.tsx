"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sun, Moon, Calendar, BarChart2 } from 'lucide-react'

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col items-center justify-center text-white p-4">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to MYAPP
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl mb-12 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Your personal dashboard for productivity, finance, and daily inspiration.
      </motion.p>

      <motion.button
        className="bg-white text-purple-700 px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-purple-100 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onStart}
      >
        Start Daily
      </motion.button>

      <motion.div 
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <FeatureIcon icon={<Sun size={40} />} label="Weather" />
        <FeatureIcon icon={<BarChart2 size={40} />} label="Stocks" />
        <FeatureIcon icon={<Calendar size={40} />} label="Tasks" />
        <FeatureIcon icon={<Moon size={40} />} label="Quotes" />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-white"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

function FeatureIcon({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <motion.div 
      className="flex flex-col items-center"
      whileHover={{ scale: 1.1 }}
    >
      {icon}
      <span className="mt-2 text-sm">{label}</span>
    </motion.div>
  )
}