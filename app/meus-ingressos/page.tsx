'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MeusIngressosPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Aqui depois vamos colocar a logica para buscar no Supabase
    setTimeout(() => {
      alert('Em breve: Busca de ingressos por ' + email)
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-black text-white pt-10 px-4 flex flex-col items-center">
      
      <div className="w-full max-w-md">
        <Link href="/" className="text-gray-500 hover:text-white mb-6 block text-sm">
          ← Voltar para Home
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-yellow-500">Meus Ingressos 🎟️</h1>
        <p className="text-gray-400 mb-8">Digite o e-mail utilizado na compra para visualizar seus QR Codes.</p>

        <form onSubmit={handleBuscar} className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-purple-400">E-mail da compra</label>
            <input 
              type="email" 
              required
              placeholder="seu@email.com"
              className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:border-yellow-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 rounded transition flex justify-center items-center"
          >
            {loading ? 'Buscando...' : 'BUSCAR INGRESSOS'}
          </button>
        </form>

        <div className="mt-8 text-center">
           <p className="text-xs text-gray-600">Problemas para achar seu ingresso?</p>
           <a href="#" className="text-xs text-gray-500 underline hover:text-white">Fale com o suporte no WhatsApp</a>
        </div>
      </div>
    </main>
  )
}