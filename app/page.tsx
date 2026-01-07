import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Essa linha garante que a página sempre mostre os eventos mais novos (não faz cache)
export const revalidate = 0

export default async function Home() {
  // Busca os eventos no banco de dados
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('active', true)
    .order('date', { ascending: true })

  return (
    // Fundo Amarelo Principal (Cor aproximada da imagem: #FFC107 ou similar)
    <main className="min-h-screen bg-[#FFB300] text-black font-sans flex flex-col">
      
      {/* --- CABEÇALHO PERSONALIZADO DA HOME --- */}
      <header className="flex flex-col md:flex-row justify-between items-center pt-8 px-8 max-w-7xl mx-auto w-full gap-4">
        {/* Logo (Coloque seu arquivo logo.png na pasta 'public') */}
        <div className="w-32 h-auto">
           {/* Se a imagem não carregar, mostra um texto alternativo */}
           <img src="/logo.png" alt="A Caverna Logo" className="object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
           {/* Fallback caso não tenha imagem ainda */}
           <div className="logo-placeholder hidden font-bold text-2xl tracking-tighter border-4 border-black p-2 rounded-xl">A CAVERNA</div>
        </div>

        {/* Título Central */}
        <h1 className="text-xl font-extrabold uppercase tracking-widest text-center md:text-left">
          Agenda da Semana
        </h1>

        {/* Links da Direita (Localização e Conta) */}
        <div className="flex items-center gap-6 font-bold text-sm uppercase">
          {/* Botão de Localização (Link Externo) */}
          {/* ATENÇÃO: Substitua o link abaixo pelo link correto do seu Google Maps */}
          <a 
            href="https://www.google.com/maps/search/?api=1&query=A+Caverna+Rio+Preto" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Localização
          </a>

          {/* Botão Minha Conta (Arredondado Branco) */}
          <Link href="/meus-ingressos" className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition shadow-sm">
            Minha Conta
          </Link>
        </div>
      </header>


      {/* --- LISTA DE EVENTOS --- */}
      <div className="flex-grow"> {/* Ocupa o espaço disponível para empurrar o footer */}
        <div className="max-w-6xl mx-auto p-8 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {!events || events.length === 0 ? (
            <p className="col-span-full text-center text-xl font-bold py-20 bg-[#0F172A] text-white rounded-xl shadow-xl">
              Nenhum evento agendado no momento.
            </p>
          ) : (
            events.map((event) => (
              // CARD DO EVENTO (Estilo Dark)
              <div key={event.id} className="bg-[#0F172A] rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition flex flex-col">
                {/* Imagem do Evento (Topo Claro) */}
                <div 
                  className="h-56 bg-gray-300 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${event.image_url})` }}
                >
                   {!event.image_url && <span className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-2xl">600 x 400</span>}
                </div>

                {/* Conteúdo do Card (Parte Escura) */}
                <div className="p-6 text-white flex flex-col flex-grow">
                  <h2 className="text-xl font-extrabold mb-1">{event.title}</h2>
                  <p className="text-sm text-gray-400 mb-3">
                    {new Date(event.date).toLocaleDateString('pt-BR')} às {new Date(event.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-6 flex-grow">
                    {event.description}
                  </p>
                  
                  {/* Botão Roxo de Comprar */}
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

      {/* --- RODAPÉ (Footer) --- */}
      <footer className="text-center p-6 text-xs font-bold uppercase tracking-widest mt-8">
        <p>Compra 100% Segura • A Caverna Rio Preto© • Desenvolvido por Agência Crave®</p>
      </footer>

    </main>
  )
}