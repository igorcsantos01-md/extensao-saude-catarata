/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Terminal,
  BookOpen,
  Eye,
  Volume2,
  ArrowDownToLine,
  Copy,
  Check,
} from 'lucide-react';
import {
  CERTIFICATE_07_DATA,
  SURVEY_POPULATION_METRICS,
  GITHUB_MASTER_PROMPT,
} from './data/certificate07Data';
import { Certificate07Viewer } from './components/Certificate07Viewer';
import { VisionSimulator } from './components/VisionSimulator';
import { AudioAndLeafletsHub } from './components/AudioAndLeafletsHub';
import { PublicAuthenticator } from './components/PublicAuthenticator';
import { GitHubCommandModal } from './components/GitHubCommandModal';
import {
  LogoEditoraMenteSaude,
  LogoCentroMariaDalva,
} from './components/CertificateAssets';

export default function App() {
  const [baseUrl, setBaseUrl] = useState<string>(
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://extensao-saude-inclusao-visual-idoso.vercel.app'
  );
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [copiedInlinePrompt, setCopiedInlinePrompt] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
      const params = new URLSearchParams(window.location.search);
      if (params.get('codigo') || window.location.hash === '#validador') {
        setTimeout(() => {
          document.getElementById('validador')?.scrollIntoView({ behavior: 'smooth' });
        }, 250);
      }
    }
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyInlinePrompt = () => {
    navigator.clipboard.writeText(GITHUB_MASTER_PROMPT);
    setCopiedInlinePrompt(true);
    setTimeout(() => setCopiedInlinePrompt(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#112A34]">
      {/* =====================================================================
          STRICT 3-ZONE TOP NAVIGATION BAR
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0B3B49] text-[#FDFBF7] border-b border-white/10 px-6 py-4 flex items-center justify-between gap-8 no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#topo"
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Inclusão Visual do Idoso
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#E2DCCE]">
          <a
            href="#certificado-pdf"
            className="hover:text-[#FCD34D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Certificado Nº 07
          </a>
          <a
            href="#simulador-visual"
            className="hover:text-[#FCD34D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Simulador Visual
          </a>
          <a
            href="#materiais-acessiveis"
            className="hover:text-[#FCD34D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Folhetos & Áudio-Guias
          </a>
          <a
            href="#validador"
            className="hover:text-[#FCD34D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Autenticador Público
          </a>
          <a
            href="#comando-github"
            className="hover:text-[#FCD34D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Comando GitHub
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => scrollToSection('certificado-pdf')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#D97706] hover:bg-[#B45309] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Baixar Certificado PDF
          </button>
        </div>
      </header>

      {/* =====================================================================
          HERO SECTION & INSTITUTIONAL CREDENTIALS
         ===================================================================== */}
      <main id="topo" className="flex-1">
        <section className="bg-[#0B3B49] text-[#FDFBF7] border-b border-[#145365] py-12 lg:py-16 px-6 no-print">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left 7 Cols: Editorial Title, Context & CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Unboxed clean metadata line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#FCD34D]">
                    <span>PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO EM SAÚDE</span>
                    <span aria-hidden="true">·</span>
                    <span>CERTIFICADO Nº 07</span>
                    <span aria-hidden="true">·</span>
                    <span>CÓD. {CERTIFICATE_07_DATA.codigoAutenticidade}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.14] tracking-tight text-balance">
                    Atividade Comunitária de Inclusão Visual do Idoso: Folhetos em Fonte Ampliada e
                    Áudio-Guias sobre Catarata e Degeneração Macular
                  </h1>

                  <p className="text-base sm:text-lg text-[#E2DCCE] leading-relaxed max-w-2xl">
                    Memória técnica, acervo acessível de materiais em alto contraste (≥ 24pt),
                    pílulas sonoras para WhatsApp e registro público de autenticidade da ação
                    extensionista executada em <strong>fevereiro de 2025 (14 horas)</strong> pelo
                    médico <strong>Lucas Gonçalves Silveira</strong>.
                  </p>
                </div>

                {/* Primary & Secondary Action Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('certificado-pdf')}
                    className="px-5 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Inspecionar e Baixar Certificado Nº 07 (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('validador')}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#FCD34D]" />
                    <span>Validar Autenticidade</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPromptModalOpen(true)}
                    className="px-4 py-3 rounded-xl bg-[#072630] hover:bg-black/40 text-[#FCD34D] border border-[#FCD34D]/30 text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Abrir Comando p/ GitHub</span>
                  </button>
                </div>
              </div>

              {/* Right 5 Cols: Official Institutional Dossier Summary Card */}
              <div className="lg:col-span-5 bg-[#072630] border border-white/15 rounded-2xl p-6 flex flex-col justify-between space-y-5">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#FAF9F6] p-1.5 rounded-lg">
                      <LogoEditoraMenteSaude size={42} />
                    </div>
                    <div className="bg-[#FAF9F6] p-1.5 rounded-lg">
                      <LogoCentroMariaDalva size={42} />
                    </div>
                  </div>
                  <div className="text-right font-mono-tabular">
                    <div className="text-[11px] text-[#E2DCCE]">ENQUADRAMENTO EDITAL</div>
                    <div className="text-xs font-bold text-[#FCD34D]">ITEM 08 — EXTENSÃO (14H)</div>
                  </div>
                </div>

                <dl className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between gap-4 py-1 border-b border-white/10">
                    <dt className="text-[#94A3B8]">Profissional Certificado:</dt>
                    <dd className="font-bold text-white text-right">
                      {CERTIFICATE_07_DATA.titular.nome}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-1 border-b border-white/10">
                    <dt className="text-[#94A3B8]">Qualificação e CPF:</dt>
                    <dd className="font-mono-tabular text-white text-right">
                      Médico · {CERTIFICATE_07_DATA.titular.cpf}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-1 border-b border-white/10">
                    <dt className="text-[#94A3B8]">Instituição de Origem:</dt>
                    <dd className="text-white text-right">UNIFAN (Anápolis - GO)</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-1 border-b border-white/10">
                    <dt className="text-[#94A3B8]">Emissora 1 (Editorial):</dt>
                    <dd className="font-mono-tabular text-[#E2DCCE] text-right">
                      Editora Mente e Saúde (51.372.335/0001-71)
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-1 border-b border-white/10">
                    <dt className="text-[#94A3B8]">Emissora 2 (Ensino):</dt>
                    <dd className="font-mono-tabular text-[#E2DCCE] text-right">
                      Centro M. Dalva de Araújo (51.269.112/0001-83)
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 pt-1">
                    <dt className="text-[#94A3B8]">Código & Chave Oficial:</dt>
                    <dd className="font-mono-tabular font-bold text-[#FCD34D] text-right">
                      {CERTIFICATE_07_DATA.codigoAutenticidade} / {CERTIFICATE_07_DATA.chaveControle}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Full-Width 4-Column Quantitative Proof Strip Below Hero Split */}
            <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SURVEY_POPULATION_METRICS.indicadores.map((item, idx) => (
                <div key={idx} className="bg-[#072630]/80 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl sm:text-3xl font-mono-tabular font-extrabold text-[#FCD34D]">
                    {item.percentual}
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{item.rotulo}</div>
                  <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">{item.detalhe}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 1: OFFICIAL CERTIFICATE Nº 07 (PDF READER + DOWNLOAD)
           ===================================================================== */}
        <section
          id="certificado-pdf"
          className="py-14 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-16"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6 no-print">
            <div>
              <div className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#D97706]">
                01. DOCUMENTO OFICIAL DE FÉ PÚBLICA INTERINSTITUCIONAL (FRENTE E VERSO)
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3B49] mt-1">
                Certificado de Atividade de Extensão Nº 07 — Modelo PDF Acessível
              </h2>
              <p className="text-sm text-[#334E58] mt-1 max-w-3xl">
                Visualize abaixo as 2 laudas oficiais (Página 1: Frente com logotipos higienizados,
                assinaturas transparentes, selo de fé pública e QR Code dinâmico; Página 2: Verso
                com Memorial Descritivo, Matriz de 14 horas e Hash SHA-256) ou baixe diretamente em
                PDF.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#0F4C3A] font-bold">
              <ArrowDownToLine className="w-4 h-4" />
              <span>Pronto para Impressão A4 Paisagem e Download Direto</span>
            </div>
          </div>

          <Certificate07Viewer
            baseUrl={baseUrl}
            onJumpToValidator={() => scrollToSection('validador')}
          />
        </section>

        {/* =====================================================================
            SECTION 2: INTERACTIVE OPTICAL SIMULATOR (CATARACT VS DMRI)
           ===================================================================== */}
        <section
          id="simulador-visual"
          className="py-14 px-4 sm:px-6 bg-[#F5F1E8] border-y border-[#E2DCCE] scroll-mt-16 no-print"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="max-w-3xl">
              <div className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#D97706]">
                02. FUNDAMENTAÇÃO OFTALMOLÓGICA E EMPATIA VISUAL NA TERCEIRA IDADE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3B49] mt-1">
                Por Que Folhetos em Fonte Ampliada e Áudio-Guias Salvam a Autonomia do Idoso?
              </h2>
              <p className="text-sm sm:text-base text-[#334E58] mt-2 leading-relaxed">
                A <strong>Catarata Senil</strong> (principal causa de cegueira reversível) e a{' '}
                <strong>Degeneração Macular Relacionada à Idade — DMRI</strong> (principal causa de
                perda visual central irreversível em idosos) comprometem severamente a leitura de
                impressos convencionais. Experimente no simulador abaixo como o paciente idoso
                enxerga e como o design de alto contraste restaura a capacidade de leitura.
              </p>
            </div>

            <VisionSimulator />
          </div>
        </section>

        {/* =====================================================================
            SECTION 3: AUDIO-GUIDES PLAYER & LARGE-PRINT LEAFLETS
           ===================================================================== */}
        <section
          id="materiais-acessiveis"
          className="py-14 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-16 no-print"
        >
          <div className="mb-8 max-w-3xl">
            <div className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#0F4C3A]">
              03. PRODUÇÃO EDITORIAL E COMUNICAÇÃO CIENTÍFICA COMUNITÁRIA
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3B49] mt-1">
              Acervo Interativo: Pílulas de Áudio no WhatsApp e Folhetos em Letras Gigantes
            </h2>
            <p className="text-sm sm:text-base text-[#334E58] mt-2 leading-relaxed">
              Ouça as 4 pílulas sonoras gravadas para idosos com baixa visão severa e navegue pelas
              páginas dos folhetos impressos distribuídos gratuitamente à comunidade, testando os
              modos de escala tipográfica (18pt, 24pt e 30pt) e polaridade cromática.
            </p>
          </div>

          <AudioAndLeafletsHub />

          {/* 4 Eixos Methodological Breakdown Cards */}
          <div className="mt-12 pt-10 border-t border-[#E2DCCE]">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-mono-tabular font-bold uppercase text-[#D97706]">
                  DETALHAMENTO METODOLÓGICO DA AÇÃO EXTENSIONISTA
                </div>
                <h3 className="text-xl font-bold text-[#0B3B49]">
                  Estrutura Curricular dos 4 Eixos Práticos (Total: 14 Horas)
                </h3>
              </div>
              <span className="text-xs font-mono-tabular font-bold text-[#0B3B49]">
                18 a 21 de fevereiro de 2025 · Goiânia/Anápolis - GO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {CERTIFICATE_07_DATA.eixosMetodologicos.map((eixo, index) => (
                <div
                  key={eixo.id}
                  className="bg-white border border-[#E2DCCE] rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono-tabular font-bold text-[#D97706] mb-2">
                      <span>0{index + 1}. EIXO PRÁTICO</span>
                      <span className="text-[#0F4C3A]">{eixo.cargaHoraria}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#0B3B49] leading-snug">
                      {eixo.eixoTitulo}
                    </h4>
                    <p className="text-xs text-[#334E58] mt-2 leading-relaxed">{eixo.descricao}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F5F1E8] text-[11px] font-medium text-[#526670]">
                    {eixo.subtitulo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 4: PUBLIC AUTHENTICATOR & QR VERIFICATION
           ===================================================================== */}
        <section
          id="validador"
          className="py-14 px-4 sm:px-6 bg-[#F5F1E8] border-t border-[#E2DCCE] scroll-mt-16 no-print"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="max-w-3xl">
              <div className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#0F4C3A]">
                04. CONFERÊNCIA PÚBLICA PARA BANCAS EXAMINADORAS DE RESIDÊNCIA MÉDICA
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3B49] mt-1">
                Autenticador Oficial de Certificados e Validação de QR Code
              </h2>
              <p className="text-sm sm:text-base text-[#334E58] mt-2 leading-relaxed">
                Este portal opera como validador oficial do <strong>Certificado Nº 07</strong>. Ao
                escanear o QR Code impresso no documento PDF ou digitar o código{' '}
                <strong className="font-mono-tabular">EMS-EXT-2025-0714</strong>, os dados de
                registro, CNPJ das instituições promotoras e o Hash SHA-256 são confirmados em tempo
                real.
              </p>
            </div>

            <PublicAuthenticator
              baseUrl={baseUrl}
              onViewCertificate={() => scrollToSection('certificado-pdf')}
            />
          </div>
        </section>

        {/* =====================================================================
            SECTION 5: GITHUB REPOSITORY MASTER COMMAND / PROMPT
           ===================================================================== */}
        <section
          id="comando-github"
          className="py-14 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-16 no-print"
        >
          <div className="bg-[#0B3B49] text-white rounded-2xl p-6 sm:p-8 border border-[#145365]">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15">
              <div>
                <div className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#FCD34D]">
                  05. COMANDO TÉCNICO PARA REPOSITÓRIO GITHUB / DEPLOY VERCEL
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Prompt e Especificação Completa do Sistema + Certificado Nº 07
                </h2>
                <p className="text-xs sm:text-sm text-[#E2DCCE] mt-1 max-w-2xl">
                  Copie o comando completo abaixo caso deseje utilizá-lo na documentação do seu
                  repositório GitHub ou em ferramentas externas de automação.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyInlinePrompt}
                  className="px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedInlinePrompt ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Comando Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Comando p/ GitHub</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Expandir em Tela Cheia</span>
                </button>
              </div>
            </div>

            <div className="mt-5 bg-[#071D26] border border-white/10 rounded-xl p-4 max-h-72 overflow-y-auto">
              <pre className="font-mono-tabular text-xs text-[#E2E8F0] whitespace-pre-wrap leading-relaxed select-all">
                {GITHUB_MASTER_PROMPT}
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          INSTITUTIONAL FOOTER
         ===================================================================== */}
      <footer className="bg-[#072630] text-[#CBD5E1] py-10 px-6 border-t border-white/10 text-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">
              Programa Interinstitucional de Extensão, Comunicação Científica e Educação em Saúde
            </div>
            <div>
              Editora Mente e Saúde (CNPJ: 51.372.335/0001-71) · Centro Profissionalizante Maria
              Dalva de Araújo (CNPJ: 51.269.112/0001-83)
            </div>
          </div>
          <div className="font-mono-tabular text-right">
            <div className="text-[#FCD34D] font-bold">
              Certificado Nº 07 · Cód. {CERTIFICATE_07_DATA.codigoAutenticidade}
            </div>
            <div>Chave de Controle: {CERTIFICATE_07_DATA.chaveControle}</div>
          </div>
        </div>
      </footer>

      {/* Modal for Full-Screen GitHub Prompt */}
      <GitHubCommandModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </div>
  );
}
