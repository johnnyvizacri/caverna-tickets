'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full h-20 bg-black flex items-center justify-between px-6 border-b border-white/10">
      
      {/* --- LADO ESQUERDO: APENAS O LOGO --- */}
      <Link href="/" className="relative h-100 w-50"> 
        {/* Ajuste h-16 e w-16 para o tamanho que quiser do logo */}
        <Image 
          src="/logo.png"  // Certifique-se que o nome do arquivo na pasta public está igual
          alt="A Caverna"
          fill
          className="object-contain" // Isso garante que o logo não estique
        />
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