import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, X } from 'lucide-react';
import { GITHUB_MASTER_PROMPT } from '../data/certificate07Data';

interface GitHubCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubCommandModal: React.FC<GitHubCommandModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(GITHUB_MASTER_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([GITHUB_MASTER_PROMPT], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'COMANDO_GITHUB_CERTIFICADO_07_INCLUSAO_VISUAL_IDOSO.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 no-print">
      <div className="bg-[#FDFBF7] border-2 border-[#0B3B49] rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="bg-[#0B3B49] text-white px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#FCD34D]" />
            <div>
              <div className="text-xs font-mono-tabular text-[#FCD34D] uppercase">
                ESPECIFICAÇÃO TÉCNICA COMPLETA PARA REPOSITÓRIO GITHUB / DEPLOY VERCEL
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Comando Operacional — Plataforma & Certificado Nº 07 (Modelo 07)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action sub-bar */}
        <div className="bg-[#F5F1E8] px-6 py-3 border-b border-[#E2DCCE] flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#334E58]">
            Copie o comando abaixo para documentar seu repositório no GitHub ou replicar a
            arquitetura completa do Certificado Nº 07.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2 rounded-lg border border-[#0B3B49] text-[#0B3B49] hover:bg-[#0B3B49] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar .MD</span>
            </button>
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Comando Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Comando Completo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Prompt Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0E1E26] text-[#F8FAFC]">
          <pre className="font-mono-tabular text-xs sm:text-sm whitespace-pre-wrap leading-relaxed select-all">
            {GITHUB_MASTER_PROMPT}
          </pre>
        </div>
      </div>
    </div>
  );
};
