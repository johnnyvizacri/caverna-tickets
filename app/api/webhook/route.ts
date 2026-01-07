import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // A InfinitePay manda um campo chamado 'order_nsu' ou 'metadata' com o nosso ID
    // Vamos tentar pegar o ID do ingresso de várias formas possíveis para garantir
    const ticketId = data.order_nsu || data.metadata?.ticket_id

    console.log('Notificação recebida da InfinitePay:', data)

    if (ticketId && data.status === 'approved') { // 'approved' ou status equivalente da Infinite
      
      // Atualiza o ingresso para PAGO e gera o QR Code (simbolicamente)
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'paid', payment_id: data.id })
        .eq('id', ticketId)

      if (error) throw error
      console.log(`Ingresso ${ticketId} confirmado com sucesso!`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}