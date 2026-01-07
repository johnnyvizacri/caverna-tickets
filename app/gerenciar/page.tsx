'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Gerenciar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Formulário Novo Evento
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '', image_url: '' })
  
  // Formulário Novo Lote (Fica guardado por ID do evento)
  const [newBatch, setNewBatch] = useState<{ [key: string]: any }>({})

  // --- 1. LOGIN SIMPLES ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'Caverna69@') { // <--- SUA SENHA AQUI
      setIsAuthenticated(true)
      fetchEvents()
    } else {
      alert('Senha incorreta')
    }
  }

  // --- 2. CARREGAR DADOS ---
  const fetchEvents = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*, batches(*)')
      .order('date', { ascending: false })
    
    setEvents(data || [])
    setLoading(false)
  }

  // --- 3. CRIAR EVENTO ---
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title || !newEvent.date) return alert('Preencha título e data')

    const { error } = await supabase
      .from('events')
      .insert({
        title: newEvent.title,
        description: newEvent.description,
        date: new Date(newEvent.date).toISOString(),
        image_url: newEvent.image_url || 'https://placehold.co/600x400/png' // Imagem padrão se não tiver
      })

    if (error) alert('Erro: ' + error.message)
    else {
      setNewEvent({ title: '', date: '', description: '', image_url: '' })
      fetchEvents()
      alert('Evento Criado!')
    }
  }

  // --- 4. DELETAR EVENTO ---
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('TEM CERTEZA? Isso apaga todos os ingressos e dados desse evento.')) return
    
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) alert('Erro: ' + error.message)
    else fetchEvents()
  }

  // --- 5. CRIAR LOTE ---
  const handleCreateBatch = async (e: React.FormEvent, eventId: string) => {
    e.preventDefault()
    const batchData = newBatch[eventId]
    if (!batchData || !batchData.name || !batchData.price || !batchData.link) {
      return alert('Preencha Nome, Preço e Link do Pagamento')
    }

    const { error } = await supabase
      .from('batches')
      .insert({
        event_id: eventId,
        name: batchData.name,
        price: parseFloat(batchData.price),
        quantity_total: parseInt(batchData.quantity || '100'),
        payment_link: batchData.link
      })

    if (error) alert('Erro: ' + error.message)
    else {
      setNewBatch({ ...newBatch, [eventId]: {} }) // Limpa formulário
      fetchEvents()
    }
  }

  // --- TELA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-xl border border-gray-700">
          <h1 className="text-white text-xl mb-4 font-bold">Acesso Restrito - A Caverna</h1>
          <input 
            type="password" 
            placeholder="Senha de Admin" 
            className="w-full p-3 rounded mb-4 text-black"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded font-bold">Entrar</button>
        </form>
      </div>
    )
  }

  // --- TELA DO PAINEL ---
  return (
    <main className="min-h-screen bg-gray-100 text-black p-8 pb-32">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gerenciar Eventos</h1>

        {/* --- FORMULÁRIO CRIAR EVENTO --- */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-10 border-l-4 border-purple-600">
          <h2 className="text-xl font-bold mb-4">Novo Evento</h2>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Nome da Festa (ex: K-Pop Night)" 
              className="p-3 border rounded" required
              value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
            />
            <input 
              type="datetime-local" 
              className="p-3 border rounded" required
              value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
            />
            <input 
              type="text" placeholder="URL da Imagem (Link direto)" 
              className="p-3 border rounded md:col-span-2"
              value={newEvent.image_url} onChange={e => setNewEvent({...newEvent, image_url: e.target.value})}
            />
            <textarea 
              placeholder="Descrição do evento..." 
              className="p-3 border rounded md:col-span-2 h-24"
              value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}
            />
            <button type="submit" className="bg-green-600 text-white font-bold p-3 rounded md:col-span-2 hover:bg-green-700">
              Criar Evento
            </button>
          </form>
        </div>

        {/* --- LISTA DE EVENTOS EXISTENTES --- */}
        <div className="space-y-8">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <button onClick={() => handleDeleteEvent(event.id)} className="text-red-400 hover:text-red-300 text-sm underline">
                  Apagar Evento
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  Data: {new Date(event.date).toLocaleDateString('pt-BR')} | 
                  ID: {event.id}
                </p>

                {/* Lista de Lotes desse evento */}
                <h4 className="font-bold text-gray-700 mb-2 border-b pb-2">Ingressos / Lotes</h4>
                <div className="space-y-2 mb-6">
                  {event.batches && event.batches.map((batch: any) => (
                    <div key={batch.id} className="flex justify-between bg-gray-50 p-2 rounded">
                      <span>{batch.name}</span>
                      <span className="font-mono text-green-600">R$ {batch.price}</span>
                      <a href={batch.payment_link} target="_blank" className="text-blue-500 text-xs truncate w-32">
                        {batch.payment_link}
                      </a>
                    </div>
                  ))}
                  {(!event.batches || event.batches.length === 0) && <p className="text-gray-400 italic">Nenhum lote criado ainda.</p>}
                </div>

                {/* Form para adicionar Lote neste evento */}
                <form onSubmit={(e) => handleCreateBatch(e, event.id)} className="bg-gray-100 p-4 rounded flex flex-wrap gap-2 items-end">
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-xs font-bold text-gray-500">Nome do Lote</label>
                    <input 
                      type="text" placeholder="Ex: 1º Lote" className="w-full p-2 border rounded text-sm" required
                      value={newBatch[event.id]?.name || ''}
                      onChange={e => setNewBatch({...newBatch, [event.id]: { ...newBatch[event.id], name: e.target.value }})}
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-bold text-gray-500">Preço</label>
                    <input 
                      type="number" placeholder="0.00" step="0.01" className="w-full p-2 border rounded text-sm" required
                      value={newBatch[event.id]?.price || ''}
                      onChange={e => setNewBatch({...newBatch, [event.id]: { ...newBatch[event.id], price: e.target.value }})}
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-bold text-gray-500">Link InfinitePay</label>
                    <input 
                      type="text" placeholder="https://..." className="w-full p-2 border rounded text-sm" required
                      value={newBatch[event.id]?.link || ''}
                      onChange={e => setNewBatch({...newBatch, [event.id]: { ...newBatch[event.id], link: e.target.value }})}
                    />
                  </div>
                  <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-purple-700 h-[38px]">
                    + Add
                  </button>
                </form>

              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}