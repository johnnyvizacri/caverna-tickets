import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo / Home */}
        <Link href="/" className="font-bold text-2xl text-purple-600 tracking-tighter hover:text-purple-400 transition">
          A CAVERNA
        </Link>

        {/* Links do Menu */}
        <div className="flex gap-6 text-sm font-bold items-center">
          
          <Link href="/meus-ingressos" className="text-gray-300 hover:text-white transition">
            MEUS INGRESSOS
          </Link>

          {/* Divisória visual para separar o que é de Staff */}
          <div className="h-4 w-px bg-gray-700 mx-2 hidden md:block"></div>

          <Link href="/portaria" className="text-yellow-500 hover:text-yellow-300 transition flex items-center gap-1">
            🔒 PORTARIA
          </Link>

          <Link href="/gerenciar" className="bg-purple-900 text-purple-200 px-3 py-1 rounded hover:bg-purple-800 transition">
            ⚙️ ADMIN
          </Link>
        </div>
      </div>
    </nav>
  )
}
