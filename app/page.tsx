import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0

export default async function Home() {
  let events = []
  let errorMsg = null

  // Tenta buscar os eventos com proteção contra falhas
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('active', true)
      .order('date', { ascending: true })
    
    if (error) throw error
    events = data || []
  } catch (err: any) {
    console.error('Erro ao carregar eventos:', err)
    errorMsg = 'Erro de conexão com o banco de dados.'
  }

  return (
    <main className="min-h-screen bg-[#FFB300] text-black font-sans flex flex-col">
      
      
      {/* --- LISTA DE EVENTOS --- */}
      <div className="flex-grow">
        <div className="max-w-6xl mx-auto p-8 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Se deu erro no banco, avisa aqui em vez de tela branca */}
          {errorMsg && (
            <div className="col-span-full bg-red-600 text-white p-4 rounded text-center">
              {errorMsg} (Veja o terminal para detalhes)
            </div>
          )}

          {!errorMsg && events.length === 0 ? (
            <p className="col-span-full text-center text-xl font-bold py-20 bg-[#0F172A] text-white rounded-xl shadow-xl">
              Nenhum evento agendado no momento.
            </p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-[#0F172A] rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition flex flex-col">
                <div 
                  className="h-56 bg-gray-300 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${event.image_url})` }}
                >
                   {!event.image_url && <span className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-2xl">600 x 400</span>}
                </div>

                <div className="p-6 text-white flex flex-col flex-grow">
                  <h2 className="text-xl font-extrabold mb-1">{event.title}</h2>
                  <p className="text-sm text-gray-400 mb-3">
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-6 flex-grow">
                    {event.description}
                  </p>
                  
                  <Link 
                    href={`/evento/${event.id}`}
                    className="block w-full text-center bg-[#8B00F6] hover:bg-[#7a00d8] text-white font-bold py-4 rounded transition uppercase tracking-wider text-sm"
                  >
                    Comprar Ingressos
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <footer className="text-center p-6 text-xs font-bold uppercase tracking-widest mt-8">
        <p>A Caverna Rio Preto©</p>
      </footer>
    </main>
  )
}