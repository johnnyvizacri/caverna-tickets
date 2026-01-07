import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar' // <--- Importamos o menu

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'A Caverna Tickets',
  description: 'Venda de ingressos oficial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* O Menu fica aqui em cima */}
        <Navbar />
        
        {/* O conteúdo das páginas (Home, Admin, etc) carrega aqui embaixo */}
        {children}
      </body>
    </html>
  )
}