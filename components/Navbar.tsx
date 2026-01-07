'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleStaffClick = () => {
    if (isAuthenticated) {
      setIsOpen(!isOpen)
    } else {
      setShowPasswordModal(true)
    }
  }

  const verifyPassword = () => {
    if (password === 'Caverna69@') {
      setIsAuthenticated(true)
      setShowPasswordModal(false)
      setIsOpen(true)
      setPassword('')
    } else {
      alert('Senha incorreta!')
    }
  }

  return (
    <>
      {/* MUDANÇA AQUI: bg-yellow-500 e border-black/10 */}
      <nav className="w-full h-20 bg-yellow-500 flex items-center justify-between px-6 border-b border-black/10 relative z-30">
        
        {/* --- LADO ESQUERDO: LOGO --- */}
        <Link href="/"> 
          <img 
            src="/logo.png" 
            alt="A Caverna"
            className="h-14 w-auto object-contain hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* --- LADO DIREITO: MENU --- */}
        <div className="flex items-center gap-4 md:gap-6 text-sm font-bold">
            
            {/* MUDANÇA AQUI: Text-black para aparecer no amarelo */}
            <Link href="/meus-ingressos" className="text-black hover:text-gray-700 transition">
              MEUS INGRESSOS
            </Link>

            <div className="h-4 w-px bg-black/20 hidden md:block"></div>

            {/* --- BOTÃO STAFF --- */}
            <div className="relative">
              {/* Botão roxo mantém destaque */}
              <button 
                onClick={handleStaffClick}
                className="flex items-center gap-2 bg-black-900 border border-black-900 text-white px-4 py-2 rounded hover:bg-black-800 transition shadow-md"
              >
                {isAuthenticated ? '🔓' : '🔐'} STAFF <span className="text-xs">▼</span>
              </button>

              {/* MENU SUSPENSO */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden z-50">
                  <Link 
                    href="/portaria" 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 hover:bg-gray-100 text-black border-b border-gray-100 flex items-center gap-2"
                  >
                    📷 Portaria
                  </Link>
                  <Link 
                    href="/gerenciar" 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 hover:bg-gray-100 text-black flex items-center gap-2"
                  >
                    ⚙️ Gerenciar
                  </Link>
                </div>
              )}
            </div>
        </div>
      </nav>

      {/* --- MODAL DE SENHA --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white border border-yellow-500 p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4">
            <h3 className="text-xl font-bold text-black mb-4 text-center">Área Restrita 🔒</h3>
            <p className="text-gray-600 text-sm mb-4 text-center">Digite a senha da equipe para acessar.</p>
            
            <input 
              type="password"
              placeholder="Senha"
              className="w-full bg-gray-100 border border-gray-300 text-black px-4 py-3 rounded mb-4 focus:outline-none focus:border-yellow-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
            />

            <div className="flex gap-2">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={verifyPassword}
                className="flex-1 bg-purple-900 text-white py-2 rounded hover:bg-purple-800 transition font-bold"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clicar fora fecha o menu suspenso */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}