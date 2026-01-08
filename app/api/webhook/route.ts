import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ⚠️ IMPORTANTE: Use a SERVICE_ROLE_KEY para operações de backend/webhook
// Nunca exponha essa chave no frontend (NEXT_PUBLIC_...)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Log para depuração: Verifique exatamente o que a InfinitePay está mandando
    console.log('Webhook InfinitePay recebido:', JSON.stringify(data, null, 2))

    // Tenta pegar o ID. Verifique na documentação se o campo é 'order_nsu', 'metadata' ou outro.
    const ticketId = data.metadata?.ticket_id || data.order_nsu

    // Verifique se o status que a InfinitePay manda é realmente 'approved' (às vezes é 'paid' ou 'confirmed')
    if (ticketId && data.status === 'approved') { 
      
      const { error } = await supabase
        .from('tickets')
        .update({ 
            status: 'paid', 
            payment_id: data.id,
            updated_at: new Date().toISOString() // Boa prática atualizar a data
        })
        .eq('id', ticketId)

      if (error) {
        console.error('Erro ao atualizar Supabase:', error)
        throw error
      }
 
      console.log(`Ingresso ${ticketId} confirmado com sucesso!`)
    } else {
        console.log(`Ignorado: Status '${data.status}' ou ID não encontrado.`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro crítico no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}