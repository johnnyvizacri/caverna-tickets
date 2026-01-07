'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Html5QrcodeScanner } from 'html5-qrcode'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Portaria() {
  const [tickets, setTickets] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  // Busca ingressos
  const fetchTickets = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tickets')
      .select('*, events(title), batches(name)')
      .or('status.eq.paid,status.eq.used')
      .order('customer_name', { ascending: true })
    
    setTickets(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  // Configura o Scanner quando o botão é clicado
  useEffect(() => {
    if (showScanner && !scannerRef.current) {
      // Pequeno delay para o elemento HTML existir
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          "reader", 
          { fps: 10, qrbox: 250 },
          /* verbose= */ false
        )
        
        scanner.render((decodedText) => {
          // QUANDO LER O QR CODE:
          setSearch(decodedText) // Joga o código na busca
          setShowScanner(false)  // Fecha a câmera
          scanner.clear()        // Limpa o scanner
          scannerRef.current = null
          alert(`QR Code Lido: ${decodedText.slice(0,5)}...`) // Feedback visual
        }, (error) => {
          // Erros de leitura (normal enquanto procura) ignora
        })

        scannerRef.current = scanner
      }, 100)
    }
  }, [showScanner])

  // Função de Check-in
  const handleCheckIn = async (id: string, currentStatus: boolean) => {
    if (currentStatus) {
      if(!confirm('Essa pessoa já entrou. Desmarcar entrada?')) return
    }
    const { error } = await supabase
      .from('tickets')
      .update({ checked_in: !currentStatus })
      .eq('id', id)

    if (error) alert('Erro ao atualizar')
    else fetchTickets()
  }

  // Filtro
  const filteredTickets = tickets.filter(t => {
    const term = search.toLowerCase().trim()
    return (
      t.customer_name.toLowerCase().includes(term) || 
      t.id.toLowerCase().includes(term) ||
      t.customer_email.toLowerCase().includes(term)
    )
  })

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-500">Portaria</h1>
          <button onClick={fetchTickets} className="text-sm bg-gray-700 px-3 py-1 rounded">Atualizar</button>
        </div>

        {/* Botão para ativar Câmera */}
        {!showScanner ? (
           <button 
             onClick={() => { setSearch(''); setShowScanner(true); }}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mb-6 flex items-center justify-center gap-2"
           >
             📷 Abrir Câmera para Ler QR Code
           </button>
        ) : (
          <div className="mb-6 bg-black p-4 rounded-lg">
             <div id="reader" className="w-full"></div>
             <button 
               onClick={() => { setShowScanner(false); window.location.reload(); }} // Reload forçado para limpar a câmera se travar
               className="mt-4 w-full bg-red-600 py-2 rounded text-white"
             >
               Fechar Câmera
             </button>
          </div>
        )}

        <input 
          type="text" 
          placeholder="Ou digite nome / código aqui..." 
          className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-lg mb-6 focus:border-purple-500 outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div key={t.id} className={`p-4 rounded-lg border flex justify-between items-center ${t.checked_in ? 'bg-green-900/30 border-green-500' : 'bg-gray-800 border-gray-700'}`}>
              <div>
                <h3 className="font-bold text-lg">{t.customer_name}</h3>
                <p className="text-sm text-gray-400">{t.batches?.name}</p>
                <p className="text-xs text-gray-500">ID: ...{t.id.slice(-6)}</p>
              </div>
              <button 
                onClick={() => handleCheckIn(t.id, t.checked_in)}
                className={`px-6 py-3 rounded font-bold transition ${t.checked_in ? 'bg-red-900 text-red-200' : 'bg-green-600 text-white'}`}
              >
                {t.checked_in ? 'DESFAZER' : 'ENTROU'}
              </button>
            </div>
          ))}
          
          {search && filteredTickets.length === 0 && (
             <div className="text-center p-8 bg-red-900/20 text-red-400 rounded-lg">
                ❌ Ninguém encontrado com este código ou nome.
             </div>
          )}
        </div>
      </div>
    </main>
  )
}