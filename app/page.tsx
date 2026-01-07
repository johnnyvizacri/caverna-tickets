import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Esta função diz ao Next.js para não salvar cache, assim sempre mostra dados novos
export const revalidate = 0

export default async function Home() {
  // 1. Buscamos os eventos no Supabase
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('active', true) // Apenas eventos ativos
    .order('date', { ascending: true })

  if (error) {
    return <div className="p-10 text-red-500">Erro ao carregar eventos.</div>
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-500">
          Agenda A Caverna
        </h1>

        {/* Lista de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events?.map((event) => (
            <div key={event.id} className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900 hover:border-purple-500 transition">
              {/* Imagem (Placeholder por enquanto) */}
              <div 
                className="h-48 bg-gray-700 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image_url})` }}
              />
              
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <p className="text-gray-400 text-sm mb-4">
                  {new Date(event.date).toLocaleDateString('pt-BR')} às {new Date(event.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <Link 
                  href={`/evento/${event.id}`} 
                  className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Comprar Ingressos
                </Link>
              </div>
            </div>
          ))}
        </div>

        {events?.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Nenhum evento encontrado.</p>
        )}
      </div>
    </main>
  )
}
