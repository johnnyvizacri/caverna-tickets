import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Buscar eventos
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: { batches: true }
    })
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 })
  }
}

// POST: Criar evento
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const event = await prisma.event.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        description: data.description,
        imageUrl: data.imageUrl,
        location: data.location || 'A Caverna',
        status: 'ACTIVE'
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 })
  }
}

// DELETE: Apagar evento (COM LIMPEZA COMPLETA)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const eventId = String(id)

    // 1. Apagar TODOS os Ingressos (Tickets) desse evento primeiro
    // (O erro que você viu era aqui: table "tickets")
    try {
        await prisma.ticket.deleteMany({
            where: { eventId: eventId }
        })
    } catch (e) {
        // Ignora se não tiver tickets
    }

    // 2. Apagar os Lotes (Batches)
    try {
        await prisma.batch.deleteMany({
            where: { eventId: eventId }
        })
    } catch (e) {
        // Ignora se não tiver lotes
    }

    // 3. Finalmente, apaga o Evento
    await prisma.event.delete({
      where: { id: eventId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar:', error)
    return NextResponse.json(
      { error: 'Erro fatal ao excluir. Verifique o console.' }, 
      { status: 500 }
    )
  }
}