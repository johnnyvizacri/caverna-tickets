'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false) // Controla o menu suspenso
  const [showPasswordModal, setShowPasswordModal] = useState(false) // Controla a janelinha da senha
  const [password, setPassword] = useState('') // Guarda o que a pessoa digita
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Sabe se já digitou a senha certa

  // Função ao clicar no botão STAFF
  const handleStaffClick = () => {
    if (isAuthenticated) {
      // Se já acertou a senha antes, só abre/fecha o menu
      setIsOpen(!isOpen)
    } else {
      // Se não, pede a senha
      setShowPasswordModal(true)
    }
  }

  // Função para verificar a senha
  const verifyPassword = () => {
    if (password === 'Caverna69@') { // <--- AQUI VOCÊ MUDA A SENHA
      setIsAuthenticated(true)
      setShowPasswordModal(false)
      setIsOpen(true) // Abre o menu
      setPassword('') // Limpa o campo
    } else {
      alert('Senha incorreta!')
    }
  }

  return (
    <>
      <nav className="w-full h-20 bg-black flex items-center justify-between px-6 border-b border-white/10 relative z-30">
        
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
            
            <Link href="/meus-ingressos" className="text-gray-300 hover:text-white transition">
              MEUS INGRESSOS
            </Link>

            <div className="h-4 w-px bg-gray-700 hidden md:block"></div>

            {/* --- BOTÃO STAFF --- */}
            <div className="relative">
              <button 
                onClick={handleStaffClick}
                className="flex items-center gap-2 bg-purple-900/50 border border-purple-500/30 text-purple-200 px-4 py-2 rounded hover:bg-purple-900 transition"
              >
                {isAuthenticated ? '🔓' : '🔐'} STAFF <span className="text-xs">▼</span>
              </button>

              {/* MENU SUSPENSO (Só aparece se isOpen for true) */}
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
        </div>
      </nav>

      {/* --- MODAL DE SENHA (JANELINHA) --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-gray-900 border border-purple-500 p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Área Restrita 🔒</h3>
            <p className="text-gray-400 text-sm mb-4 text-center">Digite a senha da equipe para acessar.</p>
            
            <input 
              type="password"
              placeholder="Senha"
              className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded mb-4 focus:outline-none focus:border-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyPassword()} // Dá enter para entrar
            />

            <div className="flex gap-2">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={verifyPassword}
                className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition font-bold"
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