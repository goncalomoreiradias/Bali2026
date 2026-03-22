import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
                    <h1 className="text-4xl sm:text-5xl font-black font-outfit uppercase tracking-tighter">Política de Privacidade</h1>
                    <p className="text-text-medium font-medium">Última atualização: Março de 2026</p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-accent">1. Introdução e Compromisso RGPD</h2>
                    <p className="text-text-high leading-relaxed font-medium">
                        A Viatio respeita a privacidade de todos os seus utilizadores e compromete-se a proteger as informações pessoais que lhe são confiadas, em estrita conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD - Regulamento (UE) 2016/679). Esta política de privacidade dita como recolhemos, guardamos e processamos os seus dados pessoais.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-accent">2. Dados Recolhidos</h2>
                    <p className="text-text-high leading-relaxed font-medium">
                        Na utilização da Viatio, recolhemos as seguintes categorias de dados:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 font-medium text-text-medium mt-4">
                        <li><strong className="text-text-high">Dados de Registo:</strong> Nome, endereço de e-mail e palavra-passe (armazenada sob forte encriptação hash).</li>
                        <li><strong className="text-text-high">Dados de Utilização:</strong> Roteiros de viagem criados, destinos pesquisados, locais marcados, despesas registadas e interações com o nosso motor de inteligência artificial.</li>
                        <li><strong className="text-text-high">Dados de Autenticação (OAuth):</strong> Quando autorizado via Google, recebemos as informações base de autenticação (nome completo e e-mail).</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-accent">3. Utilização da Inteligência Artificial</h2>
                    <p className="text-text-high leading-relaxed font-medium">
                        Para fornecer o serviço de "Arquitetura de Roteiros" (AI Planner), as informações relativas aos pedidos de viagens (como cidade, dias e preferências) são enviadas temporariamente para os servidores do nosso fornecedor de modelos de linguagem (Gemini/Google). <strong className="text-text-high">A Viatio nunca comercializa os seus dados com terceiros nem envia identificadores pessoais</strong> (nomes ou e-mails) para o fornecedor de IA em conformidade com o princípio de minimização de dados do RGPD.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tight text-accent">4. Os Seus Direitos</h2>
                    <p className="text-text-high leading-relaxed font-medium">
                        De acordo com o RGPD, o utilizador detém os direitos de:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 font-medium text-text-medium mt-4">
                        <li>Aceder, retificar ou atualizar as suas informações através das definições de conta.</li>
                        <li>Direito ao Esquecimento: Pode solicitar a eliminação completa e irreversível da sua conta e de todos os dados associados a qualquer momento através do suporte.</li>
                        <li>Limitar ou opor-se ao processamento das suas informações pessoais para finalidades não essenciais ao serviço que contratou.</li>
                    </ul>
                </section>
                
                <section className="space-y-4 border-t border-stroke pt-12 mt-12">
                    <p className="text-text-medium text-sm font-bold">
                        Para exercer os seus direitos ou solicitar esclarecimentos adicionais, poderá contactar-nos através do suporte interno (Tickets de Suporte) disponibilizado no seu Perfil.
                    </p>
                </section>
            </article>
        </main>
    );
}
