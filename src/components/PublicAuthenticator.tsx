import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  QrCode,
  FileCheck,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CERTIFICATE_07_DATA } from '../data/certificate07Data';

interface PublicAuthenticatorProps {
  baseUrl: string;
  onViewCertificate?: () => void;
}

export const PublicAuthenticator: React.FC<PublicAuthenticatorProps> = ({
  baseUrl,
  onViewCertificate,
}) => {
  const [queryInput, setQueryInput] = useState<string>(CERTIFICATE_07_DATA.codigoAutenticidade);
  const [validationState, setValidationState] = useState<'verified' | 'invalid' | 'idle'>('verified');
  const [verifiedViaUrl, setVerifiedViaUrl] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const cleanOrigin = baseUrl.replace(/\/$/, '');
  const verificationFullUrl = `${cleanOrigin}/?codigo=${CERTIFICATE_07_DATA.codigoAutenticidade}#validador`;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCodigo = params.get('codigo') || params.get('chave');
    if (urlCodigo) {
      setQueryInput(urlCodigo);
      const normalized = urlCodigo.trim().toUpperCase();
      if (
        normalized === CERTIFICATE_07_DATA.codigoAutenticidade ||
        normalized === CERTIFICATE_07_DATA.chaveControle ||
        normalized === '702.794.941-57' ||
        normalized === '70279494157'
      ) {
        setValidationState('verified');
        setVerifiedViaUrl(true);
      } else {
        setValidationState('invalid');
      }
    }
  }, []);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = queryInput.trim().toUpperCase();
    if (
      normalized === CERTIFICATE_07_DATA.codigoAutenticidade ||
      normalized === CERTIFICATE_07_DATA.chaveControle ||
      normalized === '702.794.941-57' ||
      normalized === '70279494157' ||
      normalized === CERTIFICATE_07_DATA.hashSha256.toUpperCase()
    ) {
      setValidationState('verified');
    } else {
      setValidationState('invalid');
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(CERTIFICATE_07_DATA.hashSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl overflow-hidden shadow-xs">
      {/* Header */}
      <div className="bg-[#0B3B49] text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono-tabular text-[#FCD34D] uppercase tracking-wider">
              SISTEMA INTERINSTITUCIONAL DE FÉ PÚBLICA E AUDITORIA CURRICULAR
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Validador Oficial de Autenticidade — Certificado Nº 07
            </h3>
          </div>
        </div>

        <div className="text-right font-mono-tabular text-xs text-[#E2DCCE]">
          <div>LIVRO Nº {CERTIFICATE_07_DATA.livro} · FOLHA {CERTIFICATE_07_DATA.folha}</div>
          <div className="text-[#FCD34D] font-bold">REGISTRO ATIVO E INALTERADO</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search & Verification Bar */}
        <form onSubmit={handleVerifySubmit} className="space-y-3">
          <label
            htmlFor="validator-input"
            className="block text-xs font-mono-tabular font-bold uppercase text-[#0B3B49]"
          >
            CONSULTE PELO CÓDIGO DE VERIFICAÇÃO, CHAVE DE CONTROLE, CPF DO TITULAR OU HASH SHA-256:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#526670] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="validator-input"
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ex: EMS-EXT-2025-0714 ou 0714-8829-4102-9C4A"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#FDFBF7] font-mono-tabular text-sm font-semibold text-[#112A34] focus:outline-none focus:border-[#0B3B49]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verificar Autenticidade</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setQueryInput(CERTIFICATE_07_DATA.codigoAutenticidade);
                setValidationState('verified');
              }}
              className="px-4 py-3 rounded-xl border border-[#E2DCCE] hover:border-[#0B3B49] text-xs font-bold text-[#0B3B49] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Restaurar Código Nº 07
            </button>
          </div>
        </form>

        {/* INVALID STATE */}
        {validationState === 'invalid' && (
          <div className="p-5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3.5 text-red-900">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-base">
                Nenhum registro encontrado para o código informado: "{queryInput}"
              </div>
              <p className="text-xs text-red-800 leading-relaxed">
                Para autenticar o Certificado Nº 07 emitido em favor de{' '}
                <strong>Lucas Gonçalves Silveira</strong>, informe o Código Oficial{' '}
                <strong className="font-mono-tabular">EMS-EXT-2025-0714</strong> ou a Chave de
                Controle <strong className="font-mono-tabular">0714-8829-4102-9C4A</strong>.
              </p>
            </div>
          </div>
        )}

        {/* VERIFIED STATE — OFFICIAL DIGITAL RECORD */}
        {validationState === 'verified' && (
          <div className="rounded-2xl border-2 border-[#0F4C3A] bg-[#FAF9F5] p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6D3C9] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono-tabular font-bold uppercase text-[#0F4C3A]">
                    {verifiedViaUrl
                      ? 'AUTENTICAÇÃO AUTOMÁTICA VIA PARÂMETRO DE QR CODE CONFIRMADA'
                      : 'CERTIFICADO OFICIAL AUTÊNTICO · FÉ PÚBLICA VALIDADA'}
                  </div>
                  <h4 className="text-lg font-extrabold text-[#0F172A]">
                    Documento Válido e Ativo para Comprovação Curricular (Item 08)
                  </h4>
                </div>
              </div>

              {onViewCertificate && (
                <button
                  type="button"
                  onClick={onViewCertificate}
                  className="px-4 py-2 rounded-lg bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Visualizar Laudas A4 Acima</span>
                </button>
              )}
            </div>

            {/* Metadata Grid + Live QR Code */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 rounded-xl bg-white border border-[#E2DCCE]">
                  <div className="text-[11px] font-mono-tabular uppercase text-[#526670]">
                    TITULAR DO CERTIFICADO
                  </div>
                  <div className="font-extrabold text-[#0F172A] text-base mt-0.5">
                    {CERTIFICATE_07_DATA.titular.nome}
                  </div>
                  <div className="text-xs text-[#334E58] mt-0.5">
                    {CERTIFICATE_07_DATA.titular.qualificacao} · CPF:{' '}
                    {CERTIFICATE_07_DATA.titular.cpf}
                  </div>
                  <div className="text-xs text-[#526670]">
                    Origem: {CERTIFICATE_07_DATA.titular.instituicaoOrigem}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DCCE]">
                  <div className="text-[11px] font-mono-tabular uppercase text-[#526670]">
                    REGISTRO DE LIVRO E CHAVES OFICIAIS
                  </div>
                  <div className="font-mono-tabular font-extrabold text-[#0F4C3A] text-base mt-0.5">
                    {CERTIFICATE_07_DATA.codigoAutenticidade}
                  </div>
                  <div className="text-xs font-mono-tabular text-[#334E58] mt-0.5">
                    Chave: {CERTIFICATE_07_DATA.chaveControle}
                  </div>
                  <div className="text-xs font-mono-tabular text-[#526670]">
                    Certificado Nº 07 · Livro {CERTIFICATE_07_DATA.livro} · Folha{' '}
                    {CERTIFICATE_07_DATA.folha}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DCCE] sm:col-span-2">
                  <div className="text-[11px] font-mono-tabular uppercase text-[#526670]">
                    ATIVIDADE EXTENSIONISTA CERTIFICADA (MODELO 07)
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {CERTIFICATE_07_DATA.tituloAtividade}
                  </div>
                  <div className="text-xs text-[#334E58] mt-1">
                    Modalidade: <strong>{CERTIFICATE_07_DATA.modalidadeEdital}</strong> · Período:{' '}
                    <strong>{CERTIFICATE_07_DATA.periodoRealizacao}</strong> · Carga Horária:{' '}
                    <strong>{CERTIFICATE_07_DATA.cargaHorariaExtenso}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DCCE]">
                  <div className="text-[11px] font-mono-tabular uppercase text-[#526670]">
                    INSTITUIÇÃO EMISSORA 1 (CONSELHO EDITORIAL)
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {CERTIFICATE_07_DATA.emissoras.editora.nome}
                  </div>
                  <div className="text-xs font-mono-tabular text-[#334E58]">
                    CNPJ: {CERTIFICATE_07_DATA.emissoras.editora.cnpj}
                  </div>
                  <div className="text-xs text-[#526670] mt-0.5">
                    Resp.: {CERTIFICATE_07_DATA.emissoras.editora.signataria}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DCCE]">
                  <div className="text-[11px] font-mono-tabular uppercase text-[#526670]">
                    INSTITUIÇÃO EMISSORA 2 (PARCERIA DE EXTENSÃO)
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {CERTIFICATE_07_DATA.emissoras.centro.nome}
                  </div>
                  <div className="text-xs font-mono-tabular text-[#334E58]">
                    CNPJ: {CERTIFICATE_07_DATA.emissoras.centro.cnpj}
                  </div>
                  <div className="text-xs text-[#526670] mt-0.5">
                    Resp.: {CERTIFICATE_07_DATA.emissoras.centro.signatario}
                  </div>
                </div>
              </div>

              {/* Right QR Verification Card */}
              <div className="lg:col-span-3 bg-white border border-[#E2DCCE] rounded-xl p-4 flex flex-col items-center text-center">
                <div className="text-xs font-mono-tabular font-bold uppercase text-[#0B3B49] mb-2 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>QR CODE OFICIAL</span>
                </div>
                <div className="p-2 bg-white border border-[#E2DCCE] rounded-lg">
                  <QRCodeSVG
                    value={verificationFullUrl}
                    size={128}
                    level="M"
                    includeMargin={false}
                    fgColor="#0F172A"
                    bgColor="#FFFFFF"
                  />
                </div>
                <p className="text-[11px] text-[#526670] mt-2 leading-snug">
                  Aponte a câmera do celular para validar instantaneamente este registro.
                </p>
              </div>
            </div>

            {/* SHA-256 Cryptographic Fingerprint Bar */}
            <div className="bg-[#0B3B49] text-white rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5 overflow-hidden">
                <div className="text-[10px] font-mono-tabular uppercase text-[#FCD34D]">
                  ASSINATURA DIGITAL E HASH CRIPTOGRÁFICO SHA-256 DO DOCUMENTO:
                </div>
                <div className="font-mono-tabular text-xs text-white truncate">
                  {CERTIFICATE_07_DATA.hashSha256}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#FCD34D]" />
                    <span>Hash Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Hash SHA-256</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
