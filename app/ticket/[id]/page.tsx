import { supabase } from '@/lib/supabase'
import QRCode from 'react-qr-code'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export const revalidate = 0

export default async function TicketPage({ params }: Props) {
  const { id } = await params

  // 1. Busca SÓ o ingresso primeiro (mais seguro)
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single()

  if (ticketError || !ticket) {
    return (
      <div className="min-h-screen bg-black text-white p-10 text-center">
        <h1 className="text-xl font-bold text-red-500">Erro ao carregar ingresso</h1>
        <p className="text-gray-400 mt-2">Verifique se o Link/ID está correto.</p>
        <p className="text-xs text-gray-600 mt-4">{ticketError?.message || 'Ingresso não encontrado'}</p>
      </div>
    )
  }

  // 2. Busca o Evento separadamente
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', ticket.event_id)
    .single()

  // 3. Busca o Lote separadamente
  const { data: batch } = await supabase
    .from('batches')
    .select('*')
    .eq('id', ticket.batch_id)
    .single()

  // Definir visual
  const isPaid = ticket.status === 'paid'
  const statusColor = isPaid ? 'bg-green-600' : 'bg-yellow-600'
  const statusText = isPaid ? 'CONFIRMADO' : 'AGUARDANDO PAGAMENTO'

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      
      <div className="bg-white text-black rounded-xl overflow-hidden max-w-sm w-full shadow-2xl relative">
        {/* Faixa de Status */}
        <div className={`p-4 text-center text-white font-bold tracking-widest ${statusColor}`}>
          {statusText}
        </div>

        <div className="p-6 text-center">
          {/* Dados do Evento */}
          <h1 className="text-2xl font-bold mb-1">{event?.title || 'Evento Carregando...'}</h1>
          <p className="text-gray-500 mb-4">
            {event?.date ? new Date(event.date).toLocaleDateString('pt-BR') : ''}
          </p>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <p className="font-bold text-lg">{ticket.customer_name}</p>
            <p className="text-gray-500 text-sm">{batch?.name || 'Ingresso Geral'}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center my-6">
            <div className="p-2 border-4 border-black rounded-lg">
              <QRCode 
                value={ticket.id} 
                size={180} 
                fgColor={isPaid ? "#000000" : "#d1d5db"} 
              />
            </div>
          </div>

          {!isPaid && (
            <p className="text-red-500 text-sm font-bold mt-2">
              Pagamento pendente.
            </p>
          )}

           <p className="text-xs text-gray-400 mt-4">
            ID: {ticket.id.slice(0, 8)}...
          </p>
        </div>
      </div>

      <Link href="/" className="mt-8 text-gray-500 hover:text-white underline">
        Voltar para Home
      </Link>
    </main>
  )
}