import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-canvas text-text-high selection:bg-accent/20 selection:text-accent pb-24">
            <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-stroke">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/login" className="flex items-center gap-3 text-text-medium hover:text-text-high transition-colors font-bold text-xs uppercase tracking-widest">
                        <ArrowLeft size={16} /> Voltar
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Viatio</span>
                </div>
            </header>

            <article className="max-w-3xl mx-auto px-6 py-16 space-y-12">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl sm:text-5xl font-black font-outfit uppercase tracking-tighter">Termos e Condições</h1>
                    <p className="text-text-medium font-medium">Última atualização: Março de 2026</p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-accent">1. Aceitação dos Termos</h2>
                    <p className="text-text-high leading-relaxed font-medium">
                        Ao aceder e utilizar a plataforma Viatio, concorda expressamente em ficar vinculado a estes Termos e Condições. Caso não concorde com alguma parte destes termos, não deverá utilizar os nossos serviços. A Viatio reserva-se o direito de atualizar ou modificar estes termos a qualquer momento sem aviso prévio. A continuação da utilização do serviço após a publicação de quaisquer alterações constitui aceitação dessas alterações.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-accent">2. Descrição do Serviço</h2>
                    <p className="text-text-high leading-relaxed font-medium">
                        A Viatio é uma plataforma digital que utiliza inteligência artificial para auxiliar os utilizadores no planeamento, organização e gestão dos seus roteiros de viagem e despesas partilhadas. A precisão, atualidade e exatidão das informações geradas por Inteligência Artificial (Arquiteto AI) ou fornecidas por terceiros (Google Maps) não são garantidas, cabendo ao utilizador o discernimento e verificação final antes e durante a viagem.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-accent">3. Contas de Utilizador e Assinaturas</h2>
                    <p className="text-text-high leading-relaxed font-medium">
                        O registo na Viatio pressupõe o fornecimento de informações verdadeiras, precisas e atualizadas. 
                        Temos disponíveis diferentes níveis de subscrição:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 font-medium text-text-medium mt-4">
                        <li><strong className="text-text-high">Plano Gratuito:</strong> Acesso limitado a um número restrito de viagens (máximo de 3 planeamentos ativos).</li>
                        <li><strong className="text-text-high">Plano Premium/Mensal:</strong> Acesso a ferramentas avançadas geradas por AI, exportação ilimitada de Bucket Lists e convite ilimitado a participantes.</li>
                    </ul>
                    <p className="text-text-high leading-relaxed font-medium mt-4">
                        É da inteira responsabilidade do utilizador manter a confidencialidade das credenciais de acesso, sendo este responsável por toda a atividade ocorrida na sua conta.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-accent">4. Limitação de Responsabilidade</h2>
                    <p className="text-text-high leading-relaxed font-medium">
                        A plataforma, a inteligência artificial adjacente e todos os conteúdos são fornecidos "tal como estão" (as is) e "conforme disponíveis" (as available). A Viatio rejeita expressamente todas as garantias, explícitas ou implícitas, incluindo, mas não se limitando a, garantias de comercialização ou adequação a um fim específico. A Viatio não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequentes resultantes da incapacidade de utilizar os roteiros ou por alterações não programadas nos locais turísticos propostos.
                    </p>
                </section>

            </article>
        </main>
    );
}
