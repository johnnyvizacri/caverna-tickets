'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Html5QrcodeScanner } from 'html5-qrcode'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Portaria() {
  // Estados para controlar Evento e Lista
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  
  const [tickets, setTickets] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  // 1. Carregar a lista de eventos ativos ao abrir a página
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .order('date', { ascending: false }) // Eventos mais recentes primeiro
      setEvents(data || [])
    }
    fetchEvents()
  }, [])

  // 2. Busca ingressos APENAS do evento selecionado
  const fetchTickets = async (eventId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('tickets')
      .select('*, events(title), batches(name)')
      .eq('event_id', eventId) // <--- O PULO DO GATO: Filtra pelo evento!
      .or('status.eq.paid,status.eq.used')
      .order('customer_name', { ascending: true })
    
    setTickets(data || [])
    setLoading(false)
  }

  // Quando escolhe um evento, carrega a lista dele
  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id)
    fetchTickets(id)
  }

  // Configura o Scanner (igual antes)
  useEffect(() => {
    if (showScanner && !scannerRef.current) {
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          "reader", 
          { fps: 10, qrbox: 250 },
          false
        )
        
        scanner.render((decodedText) => {
          setSearch(decodedText) 
          setShowScanner(false)  
          scanner.clear()        
          scannerRef.current = null
          // Toca um som ou vibra se possível (opcional)
          if (navigator.vibrate) navigator.vibrate(200)
        }, (error) => { console.warn(error) })

        scannerRef.current = scanner
      }, 100)
    }
  }, [showScanner])

  // Função de Check-in
  const handleCheckIn = async (id: string, currentStatus: boolean) => {
    // Se tentar dar check-in em alguém que já entrou, pede confirmação para desfazer
    if (currentStatus) {
      if(!confirm('ATENÇÃO: Essa pessoa JÁ ENTROU. Deseja cancelar a entrada dela?')) return
    }

    const { error } = await supabase
      .from('tickets')
      .update({ checked_in: !currentStatus })
      .eq('id', id)

    if (error) alert('Erro ao atualizar')
    else if (selectedEventId) fetchTickets(selectedEventId) // Recarrega a lista
  }

  // Filtro de busca na tela
  const filteredTickets = tickets.filter(t => {
    const term = search.toLowerCase().trim()
    return (
      t.customer_name.toLowerCase().includes(term) || 
      t.id.toLowerCase().includes(term) ||
      t.customer_email.toLowerCase().includes(term)
    )
  })

  // --- TELA 1: SELEÇÃO DE EVENTO ---
  if (!selectedEventId) {
    return (
      <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-purple-500 mb-8 mt-10">Portaria A Caverna</h1>
        <p className="text-gray-400 mb-6">Selecione o evento de hoje:</p>
        
        <div className="w-full max-w-md space-y-4">
          {events.map(event => (
            <button
              key={event.id}
              onClick={() => handleSelectEvent(event.id)}
              className="w-full bg-gray-900 border border-gray-700 hover:border-purple-500 p-6 rounded-xl text-left transition transform hover:scale-105"
            >
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(event.date).toLocaleDateString('pt-BR')}
              </p>
            </button>
          ))}
          
          {events.length === 0 && (
            <p className="text-center text-gray-500">Nenhum evento ativo encontrado.</p>
          )}
        </div>
      </main>
    )
  }

  // --- TELA 2: LISTA E SCANNER (Check-in) ---
  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho com botão de voltar */}
        <div className="flex justify-between items-center mb-6 bg-black p-4 rounded-lg">
          <div>
            <p className="text-xs text-gray-400">Controlando:</p>
            <h1 className="text-xl font-bold text-purple-500">
              {events.find(e => e.id == selectedEventId)?.title}
            </h1>
          </div>
          <button 
            onClick={() => { setSelectedEventId(null); setSearch(''); }}
            className="text-sm bg-gray-800 text-gray-300 px-3 py-2 rounded hover:bg-gray-700"
          >
            ← Trocar Evento
          </button>
        </div>

        {/* Botão Câmera */}
        {!showScanner ? (
           <button 
             onClick={() => { setSearch(''); setShowScanner(true); }}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mb-6 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
           >
             📷 LER QR CODE
           </button>
        ) : (
          <div className="mb-6 bg-black p-4 rounded-lg border border-gray-700">
             <div id="reader" className="w-full"></div>
             <button 
               onClick={() => { setShowScanner(false); window.location.reload(); }} 
               className="mt-4 w-full bg-red-600 py-2 rounded text-white font-bold"
             >
               FECHAR CÂMERA
             </button>
          </div>
        )}

        {/* Campo de Busca Manual */}
        <input 
          type="text" 
          placeholder="Digitar nome ou código..." 
          className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-lg mb-6 focus:border-purple-500 outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Lista de Pessoas */}
        <div className="space-y-3">
          {/* Contador */}
          <div className="flex justify-between text-sm text-gray-400 px-2 mb-2">
            <span>Na lista: {tickets.length}</span>
            <span className="text-green-400 font-bold">Já entraram: {tickets.filter(t => t.checked_in).length}</span>
          </div>

          {filteredTickets.map((t) => (
            <div key={t.id} className={`p-4 rounded-lg border flex justify-between items-center ${t.checked_in ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-800 border-gray-700'}`}>
              <div>
                <h3 className={`font-bold text-lg ${t.checked_in ? 'text-green-400' : 'text-white'}`}>
                  {t.customer_name}
                </h3>
                <p className="text-sm text-gray-400">{t.batches?.name}</p>
                <p className="text-xs text-gray-600 font-mono mt-1">ID: ...{t.id.slice(-6)}</p>
              </div>
              
              <button 
                onClick={() => handleCheckIn(t.id, t.checked_in)}
                className={`px-4 py-3 rounded font-bold transition shadow-lg min-w-[100px] ${
                  t.checked_in 
                    ? 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-red-900/50 hover:text-red-400' 
                    : 'bg-green-600 text-white hover:bg-green-500 hover:scale-105'
                }`}
              >
                {t.checked_in ? 'DESFAZER' : 'ENTRAR'}
              </button>
            </div>
          ))}
          
          {search && filteredTickets.length === 0 && (
             <div className="text-center p-8 bg-red-900/20 text-red-400 rounded-lg border border-red-900/50">
                <p className="font-bold text-xl mb-2">❌ Não encontrado</p>
                <p className="text-sm">Verifique se a pessoa comprou para ESTE evento.</p>
             </div>
          )}
        </div>
      </div>
    </main>
  )
}