'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-black border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo / Home */}
        <Link href="/" className="font-bold text-2xl text-purple-600 tracking-tighter hover:text-purple-400 transition">
          A CAVERNA
        </Link>

        {/* Links do Menu */}
        <div className="flex items-center gap-4 md:gap-6 text-sm font-bold">
          
          <Link href="/meus-ingressos" className="text-gray-300 hover:text-white transition">
            MEUS INGRESSOS
          </Link>

          {/* Divisória visual */}
          <div className="h-4 w-px bg-gray-700 hidden md:block"></div>

          {/* --- BOTÃO STAFF (Menu Suspenso) --- */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-purple-900/50 border border-purple-500/30 text-purple-200 px-4 py-2 rounded hover:bg-purple-900 transition"
            >
              🔐 STAFF <span className="text-xs">▼</span>
            </button>

            {/* A lista que aparece quando clica */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex flex-col overflow-hidden z-50">
                <Link 
                  href="/portaria" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 hover:bg-gray-800 text-yellow-500 border-b border-gray-800 flex items-center gap-2"
                >
                  📷 Portaria
                </Link>
                <Link 
                  href="/gerenciar" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 hover:bg-gray-800 text-white flex items-center gap-2"
                >
                  ⚙️ Gerenciar
                </Link>
              </div>
            )}
          </div>
          {/* ----------------------------------- */}

        </div>
      </div>

      {/* Clicar fora fecha o menu (máscara invisível) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  )
}