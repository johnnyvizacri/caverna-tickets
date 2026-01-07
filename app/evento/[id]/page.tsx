import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import BuyButton from '@/components/BuyButton'

type Props = {
  params: Promise<{ id: string }>
}

export const revalidate = 0

export default async function EventoDetalhes({ params }: Props) {
  const { id } = await params

  // 1. Buscar detalhes do evento
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  // 2. Buscar os lotes
  const { data: batches } = await supabase
    .from('batches')
    .select('*')
    .eq('event_id', id)
    .eq('active', true)
    .order('price', { ascending: true })

  if (!event) {
    return <div className="text-white p-10">Evento não encontrado.</div>
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Botão Voltar */}
      <div className="p-4">
        <Link href="/" className="text-gray-400 hover:text-white mb-4 inline-block">
          &larr; Voltar para Agenda
        </Link>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        {/* Cabeçalho do Evento */}
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 mb-8">
          <div 
            className="h-64 bg-gray-700 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image_url})` }}
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-purple-400 font-bold text-lg mb-4">
               {new Date(event.date).toLocaleDateString('pt-BR')} • {new Date(event.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
            </p>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>

        {/* Área de Compra (Lotes) */}
        <h2 className="text-2xl font-bold mb-6">Escolha seu ingresso</h2>
        
        <div className="space-y-4">
          {batches && batches.length > 0 ? (
            batches.map((batch) => (
              <div key={batch.id} className="bg-gray-900 border border-gray-700 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center hover:border-purple-500 transition">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-lg">{batch.name}</h3>
                  <p className="text-sm text-gray-400">
                    Restam {batch.quantity_total} unidades
                  </p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className="text-xl font-bold text-green-400">
                    R$ {Number(batch.price).toFixed(2).replace('.', ',')}
                  </span>
                  
                  <BuyButton 
                    batchId={batch.id} 
                    eventId={event.id} 
                    price={batch.price} 
                    batchName={batch.name}
                    paymentLink={batch.payment_link}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8 bg-gray-900 rounded-lg">
              Nenhum ingresso disponível no momento.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}