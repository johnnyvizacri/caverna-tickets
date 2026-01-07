'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function BuyButton({ batchId, eventId, batchName, paymentLink }: any) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Segurança: Se você esqueceu de por o link no Supabase, ele avisa
    if (!paymentLink) {
      alert('ERRO: O link de pagamento deste lote não foi configurado no Banco de Dados.')
      setLoading(false)
      return
    }

    try {
      // 1. Salva o pedido no banco
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          event_id: eventId,
          batch_id: batchId,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          status: 'pending' // Começa pendente
        })
        .select()
        .single()

      if (error) throw error

      // 2. Prepara o redirecionamento
      // Adicionamos o ID do ticket no link para controle futuro
      // Ex: https://link.infinitepay.io...?metadata[ticket_id]=123
      const separator = paymentLink.includes('?') ? '&' : '?'
      const finalLink = `${paymentLink}${separator}metadata[ticket_id]=${data.id}`
      
      // 3. Manda o cliente para a InfinitePay
      window.location.href = finalLink

    } catch (err: any) {
      alert('Erro ao processar: ' + err.message)
      setLoading(false)
    }
  }

  // ... (O resto do visual do botão continua igual) ...
  if (!showModal) {
    return (
      <button 
        onClick={() => setShowModal(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition"
      >
        Comprar
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-gray-700">
        <h3 className="text-xl font-bold mb-4">Dados do Comprador</h3>
        <p className="text-sm text-gray-400 mb-4">Ingresso: {batchName}</p>
        
        <form onSubmit={handleBuy} className="space-y-3">
          <input 
            type="text" placeholder="Nome Completo" required
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Seu E-mail (Para receber o QR Code)" required
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          />
          <input 
            type="tel" placeholder="WhatsApp / Celular" required
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
          />

          <div className="flex gap-2 mt-4">
            <button 
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded text-white"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded text-white font-bold"
            >
              {loading ? 'Redirecionando...' : 'Pagar Agora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}