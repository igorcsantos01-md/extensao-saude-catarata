import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  FileCheck2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Edit3,
  RotateCcw,
  FileText,
  FileCode,
  SearchCheck,
} from 'lucide-react';
import { CERTIFICATE_07_DATA, CertificateEixo } from '../data/certificate07Data';
import { getEmbeddedGoogleFontsCss } from '../utils/pdfFontEmbedder';
import {
  LogoEditoraMenteSaude,
  LogoCentroMariaDalva,
  AssinaturaBarbaraLima,
  AssinaturaJamesAraujo,
  SeloOficialFePublica,
} from './CertificateAssets';

interface Certificate07ViewerProps {
  baseUrl: string;
  onJumpToValidator?: () => void;
}

interface EditableCertState {
  numero: string;
  livro: string;
  folha: string;
  codigoAutenticidade: string;
  chaveControle: string;
  hashSha256: string;
  titularNome: string;
  titularQualificacao: string;
  titularCpf: string;
  titularInstituicao: string;
  tituloAtividade: string;
  modalidadeEdital: string;
  periodoRealizacao: string;
  cargaHorariaExtenso: string;
  cargaHorariaCurta: string;
  dataEmissaoExtenso: string;
  eixos: CertificateEixo[];
}

const SERIF_FONT = "'Playfair Display', Georgia, serif";
const SANS_FONT = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
const MONO_FONT = "'JetBrains Mono', monospace";

const getInitialCertState = (): EditableCertState => ({
  numero: CERTIFICATE_07_DATA.numero,
  livro: CERTIFICATE_07_DATA.livro,
  folha: CERTIFICATE_07_DATA.folha,
  codigoAutenticidade: CERTIFICATE_07_DATA.codigoAutenticidade,
  chaveControle: CERTIFICATE_07_DATA.chaveControle,
  hashSha256: CERTIFICATE_07_DATA.hashSha256,
  titularNome: CERTIFICATE_07_DATA.titular.nome,
  titularQualificacao: CERTIFICATE_07_DATA.titular.qualificacao,
  titularCpf: CERTIFICATE_07_DATA.titular.cpf,
  titularInstituicao: CERTIFICATE_07_DATA.titular.instituicaoOrigem,
  tituloAtividade: CERTIFICATE_07_DATA.tituloAtividade,
  modalidadeEdital: CERTIFICATE_07_DATA.modalidadeEdital,
  periodoRealizacao: CERTIFICATE_07_DATA.periodoRealizacao,
  cargaHorariaExtenso: CERTIFICATE_07_DATA.cargaHorariaExtenso,
  cargaHorariaCurta: CERTIFICATE_07_DATA.cargaHorariaCurta,
  dataEmissaoExtenso: CERTIFICATE_07_DATA.dataEmissaoExtenso,
  eixos: CERTIFICATE_07_DATA.eixosMetodologicos.map((e) => ({ ...e })),
});

export const Certificate07Viewer: React.FC<Certificate07ViewerProps> = ({
  baseUrl,
  onJumpToValidator,
}) => {
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const containerWrapperRef = useRef<HTMLDivElement>(null);

  const [certState, setCertState] = useState<EditableCertState>(getInitialCertState);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showQuickForm, setShowQuickForm] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'both' | 'front' | 'back'>('both');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [autoScale, setAutoScale] = useState<number>(1);
  const [isCapturingUnscaled, setIsCapturingUnscaled] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const cleanOrigin = baseUrl.replace(/\/$/, '');
  const verificationFullUrl = `${cleanOrigin}/?codigo=${certState.codigoAutenticidade}#validador`;

  // Pre-warm embedded Google Fonts CSS in the background on mount so PDF generation is fast and exact
  useEffect(() => {
    getEmbeddedGoogleFontsCss().catch(() => {});
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (!containerWrapperRef.current) return;
      const availableWidth = containerWrapperRef.current.clientWidth - 32;
      const sheetWidth = 1122;
      if (availableWidth < sheetWidth) {
        setAutoScale(Math.max(0.32, Number((availableWidth / sheetWidth).toFixed(3))));
      } else {
        setAutoScale(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const effectiveScale = isCapturingUnscaled
    ? 1
    : Number((autoScale * zoomScale).toFixed(3));

  const injectSearchableLayerPage1 = (pdf: jsPDF) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    const searchableLinesPage1: Array<{ text: string; x: number; y: number; size?: number }> = [
      { text: 'EDITORA MENTE E SAUDE - CNPJ: 51.372.335/0001-71', x: 32, y: 18, size: 9 },
      { text: 'Conselho Editorial e Extensao Cientifica', x: 32, y: 23, size: 8 },
      {
        text: 'PROGRAMA INTERINSTITUCIONAL DE EXTENSAO, COMUNICACAO CIENTIFICA E EDUCACAO EM SAUDE',
        x: 105,
        y: 16,
        size: 8,
      },
      {
        text: `Certificado Nº ${certState.numero} · Livro de Extensao nº ${certState.livro} · Cod. ${certState.codigoAutenticidade}`,
        x: 110,
        y: 23,
        size: 8,
      },
      {
        text: 'CENTRO PROFISSIONALIZANTE MARIA DALVA DE ARAUJO - CNPJ: 51.269.112/0001-83',
        x: 200,
        y: 18,
        size: 9,
      },
      { text: 'CERTIFICADO DE ATIVIDADE DE EXTENSAO', x: 85, y: 44, size: 18 },
      {
        text: 'A Editora Mente e Saude (CNPJ: 51.372.335/0001-71), em parceria institucional com o Centro Profissionalizante Maria Dalva de Araujo (CNPJ: 51.269.112/0001-83), certifica para os devidos fins de comprovacao curricular e academica que',
        x: 25,
        y: 55,
        size: 9,
      },
      { text: certState.titularNome, x: 95, y: 74, size: 16 },
      {
        text: `${certState.titularQualificacao} | CPF: ${certState.titularCpf} | ${certState.titularInstituicao}`,
        x: 75,
        y: 82,
        size: 10,
      },
      {
        text: `participou de forma efetiva da Atividade de Extensao intitulada "${certState.tituloAtividade}", desenvolvida na modalidade de ${certState.modalidadeEdital}, realizada no periodo de ${certState.periodoRealizacao}, contabilizando carga horaria total de ${certState.cargaHorariaExtenso}.`,
        x: 22,
        y: 98,
        size: 10,
      },
      {
        text: 'No ambito desta acao extensionista, o profissional atuou na producao editorial acessivel e entrega comunitaria gratuita de materiais educativos (folhetos em fonte ampliada de alto contraste e audio-guias preventivos), aplicacao de enquete estruturada para coleta de dados populacionais sobre barreiras visuais na terceira idade, comunicacao cientifica para combate a desinformacao (fake news) contra colirios milagrosos sem evidencia cientifica, e divulgacao dos canais oficiais de assistencia oftalmologica e cirurgia de catarata pelo SUS.',
        x: 22,
        y: 118,
        size: 10,
      },
      { text: certState.dataEmissaoExtenso, x: 120, y: 142, size: 11 },
      {
        text: 'BARBARA LIMA DOS SANTOS - Editora-Chefe e Coordenadora de Extensao Editorial - Editora Mente e Saude (CNPJ: 51.372.335/0001-71)',
        x: 22,
        y: 178,
        size: 8,
      },
      {
        text: `SELO OFICIAL FE PUBLICA - AUTENTICACAO PUBLICA MANUAL - Cod.: ${certState.codigoAutenticidade} - Chave: ${certState.chaveControle} - ${verificationFullUrl}`,
        x: 105,
        y: 175,
        size: 8,
      },
      {
        text: 'JAMES ARAUJO DE SANTANA - Coordenador de Extensao e Projetos Educativos - Centro Profissionalizante Maria Dalva de Araujo (CNPJ: 51.269.112/0001-83)',
        x: 200,
        y: 178,
        size: 8,
      },
      {
        text: `Verifique via QR Code ou acesse ${cleanOrigin}/ informando o Codigo ${certState.codigoAutenticidade} ou Chave ${certState.chaveControle}`,
        x: 45,
        y: 198,
        size: 8,
      },
    ];

    searchableLinesPage1.forEach((item) => {
      pdf.setFontSize(item.size || 9);
      pdf.text(item.text, item.x, item.y, {
        renderingMode: 'invisible',
        maxWidth: 255,
      });
    });

    pdf.link(118, 152, 68, 32, { url: verificationFullUrl });
    pdf.link(35, 192, 225, 10, { url: verificationFullUrl });
  };

  const injectSearchableLayerPage2 = (pdf: jsPDF) => {
    pdf.setFont('helvetica', 'normal');
    const searchableLinesPage2: Array<{ text: string; x: number; y: number; size?: number }> = [
      {
        text: 'MEMORIAL DESCRITIVO E REGISTRO ACADEMICO DE ATIVIDADE DE EXTENSAO',
        x: 35,
        y: 18,
        size: 13,
      },
      {
        text: `Verso Oficial do Certificado Nº ${certState.numero} · Fe Publica Interinstitucional e Validacao Curricular`,
        x: 35,
        y: 24,
        size: 9,
      },
      {
        text: `1. DADOS DE IDENTIFICACAO DO PROFISSIONAL EXTENSIONISTA - Titular Certificado: ${certState.titularNome} - CPF Registrado: ${certState.titularCpf} - Qualificacao Profissional: ${certState.titularQualificacao} - Instituicao de Origem: ${certState.titularInstituicao}`,
        x: 18,
        y: 42,
        size: 9,
      },
      {
        text: `2. ENQUADRAMENTO CURRICULAR E PONTUACAO - Item 08 - Atividades de Extensao: Campanhas educativas, de vacinacao, coleta de dados populacionais e atividades comunitarias - Periodo: ${certState.periodoRealizacao} | Total: ${certState.cargaHorariaCurta}`,
        x: 152,
        y: 42,
        size: 9,
      },
      {
        text: '3. MATRIZ DE ATIVIDADES PRATICAS E METODOLOGIA EXTENSIONISTA (14 HORAS)',
        x: 18,
        y: 68,
        size: 9,
      },
      ...certState.eixos.map((eixo, idx) => ({
        text: `${eixo.eixoTitulo} (${eixo.subtitulo}): ${eixo.descricao} - Carga Horaria: ${eixo.cargaHoraria}`,
        x: 18,
        y: 78 + idx * 16,
        size: 8.5,
      })),
      {
        text: `4. REGISTRO OFICIAL DE FE PUBLICA, ENDERECO WEB E CHAVES DE VERIFICACAO DE AUTENTICIDADE - Certificado registrado sob o nº ${certState.numero} no Livro de Extensao nº ${certState.livro}, Folha ${certState.folha}, expedido pela Editora Mente e Saude (CNPJ: 51.372.335/0001-71) e Centro Profissionalizante Maria Dalva de Araujo (CNPJ: 51.269.112/0001-83).`,
        x: 18,
        y: 146,
        size: 8.5,
      },
      {
        text: `CODIGO DE AUTENTICIDADE: ${certState.codigoAutenticidade} | CHAVE DE CONTROLE / DIGITO: ${certState.chaveControle}`,
        x: 18,
        y: 156,
        size: 8.5,
      },
      {
        text: `ENDERECO PARA VERIFICACAO MANUAL (SEM QR CODE): ${verificationFullUrl}`,
        x: 18,
        y: 162,
        size: 8.5,
      },
      {
        text: `HASH SHA-256: ${certState.hashSha256}`,
        x: 18,
        y: 168,
        size: 8.5,
      },
    ];

    searchableLinesPage2.forEach((item) => {
      pdf.setFontSize(item.size || 9);
      pdf.text(item.text, item.x, item.y, {
        renderingMode: 'invisible',
        maxWidth: 255,
      });
    });

    pdf.link(16, 140, 265, 32, { url: verificationFullUrl });
  };

  const handleDownloadSearchablePdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setExportSuccessMessage(null);

    const prevTab = activeTab;
    const prevEditing = isEditing;

    try {
      // Ensure clean 1:1 unscaled render with both pages visible and no editing outlines
      setIsEditing(false);
      setIsCapturingUnscaled(true);
      if (prevTab !== 'both') {
        setActiveTab('both');
      }

      // Wait for fonts & DOM unscaled layout to settle
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const embeddedFontCss = await getEmbeddedGoogleFontsCss();
      await new Promise((r) => setTimeout(r, 180));

      if (!page1Ref.current || !page2Ref.current) {
        throw new Error('Elementos do certificado não encontrados.');
      }

      const captureOptions = {
        quality: 1,
        pixelRatio: 3, // Exact 3366 x 2379 resolution matching reference PDF
        backgroundColor: '#FAF9F6',
        width: 1122,
        height: 793,
        cacheBust: false,
        skipFonts: !embeddedFontCss,
        fontEmbedCSS: embeddedFontCss || '',
        style: {
          transform: 'none',
          width: '1122px',
          height: '793px',
        },
      };

      const [page1DataUrl, page2DataUrl] = await Promise.all([
        toPng(page1Ref.current, captureOptions),
        toPng(page2Ref.current, captureOptions),
      ]);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      pdf.setProperties({
        title: `Certificado de Extensão Nº ${certState.numero} - ${certState.titularNome}`,
        subject: certState.tituloAtividade,
        author: 'Editora Mente e Saúde & Centro Profissionalizante Maria Dalva de Araújo',
        keywords: `${certState.codigoAutenticidade}, ${certState.chaveControle}, ${certState.titularNome}, ${certState.titularCpf}, FUBOG, Extensão`,
        creator: 'Portal Interinstitucional de Fé Pública e Extensão em Saúde',
      });

      // Page 1: High-DPI 3x Visual Layer + Searchable Text Layer + Clickable Links
      pdf.addImage(page1DataUrl, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
      injectSearchableLayerPage1(pdf);

      // Page 2: High-DPI 3x Visual Layer + Searchable Text Layer + Clickable Links
      pdf.addPage('a4', 'landscape');
      pdf.addImage(page2DataUrl, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
      injectSearchableLayerPage2(pdf);

      pdf.save(
        `Certificado_Extensao_${certState.numero}_${certState.codigoAutenticidade}_Lucas_Goncalves_Silveira.pdf`
      );

      setExportSuccessMessage(
        'PDF em Alta Definição (3366×2379px) 100% Pesquisável (Ctrl+F) e com padrão tipográfico idêntico gerado!'
      );
      setTimeout(() => setExportSuccessMessage(null), 7000);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      window.print();
    } finally {
      setIsCapturingUnscaled(false);
      setIsEditing(prevEditing);
      if (prevTab !== 'both') {
        setActiveTab(prevTab);
      }
      setIsExportingPdf(false);
    }
  };

  // Export Editable HTML / Word (.doc) document
  const handleExportEditableDocument = (format: 'doc' | 'html') => {
    if (!page1Ref.current || !page2Ref.current) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Certificado Nº ${certState.numero} - ${certState.titularNome} (Editável e Pesquisável)</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    body { font-family: 'Plus Jakarta Sans', Georgia, sans-serif; background: #FAF9F6; color: #1E293B; margin: 0; padding: 20px; }
    .editable-notice { background: #0B3B49; color: #FFF; padding: 12px 20px; font-family: sans-serif; font-size: 13px; margin-bottom: 20px; border-radius: 8px; }
    .sheet { width: 277mm; min-height: 190mm; background: #FAF9F6; border: 3px double #0F4C3A; padding: 18px 28px; box-sizing: border-box; margin: 0 auto 24px auto; page-break-after: always; }
    h1 { font-family: 'Playfair Display', Georgia, serif; color: #0F4C3A; text-align: center; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; margin: 12px 0; }
    h2 { font-family: 'Playfair Display', Georgia, serif; color: #0F4C3A; font-size: 19px; text-transform: uppercase; margin: 8px 0; }
    .participant-box { background: #F3F1EA; border: 1px solid #D5CFC2; padding: 12px; text-align: center; margin: 14px 0; }
    .participant-name { font-family: 'Playfair Display', Georgia, serif; font-size: 25px; font-weight: bold; color: #0F172A; letter-spacing: 1.5px; }
    p { font-size: 13.5px; line-height: 1.55; text-align: justify; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; font-family: sans-serif; font-size: 12px; }
    th, td { border: 1px solid #CBD5E1; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #F2EFE9; color: #0F4C3A; }
    .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
  </style>
</head>
<body contenteditable="true">
  <div class="editable-notice" contenteditable="false">
    <strong>DOCUMENTO EDITÁVEL E PESQUISÁVEL (CERTIFICADO Nº ${certState.numero}):</strong> Clique em qualquer texto abaixo para editar diretamente ou pressione Ctrl+P para salvar como PDF vetorial.
  </div>
  <div class="sheet">
    <table>
      <tr>
        <td style="width:33%"><strong>EDITORA MENTE E SAÚDE</strong><br/><span class="mono">CNPJ: 51.372.335/0001-71</span><br/>Conselho Editorial e Extensão Científica</td>
        <td style="width:34%; text-align:center"><strong>PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO CIENTÍFICA E EDUCAÇÃO EM SAÚDE</strong><br/><span class="mono">Certificado Nº ${certState.numero} · Livro nº ${certState.livro} · Cód. ${certState.codigoAutenticidade}</span></td>
        <td style="width:33%; text-align:right"><strong>CENTRO PROFISSIONALIZANTE MARIA DALVA DE ARAÚJO</strong><br/><span class="mono">CNPJ: 51.269.112/0001-83</span></td>
      </tr>
    </table>
    <h1>CERTIFICADO DE ATIVIDADE DE EXTENSÃO</h1>
    <p style="text-align:center">A <strong>Editora Mente e Saúde</strong> (CNPJ: 51.372.335/0001-71), em parceria institucional com o <strong>Centro Profissionalizante Maria Dalva de Araújo</strong> (CNPJ: 51.269.112/0001-83), certifica para os devidos fins de comprovação curricular e acadêmica que</p>
    <div class="participant-box">
      <div class="participant-name">${certState.titularNome}</div>
      <div><strong>${certState.titularQualificacao} | CPF: ${certState.titularCpf} | ${certState.titularInstituicao}</strong></div>
    </div>
    <p>participou de forma efetiva da <strong>Atividade de Extensão</strong> intitulada <strong>“${certState.tituloAtividade}”</strong>, desenvolvida na modalidade de <strong>${certState.modalidadeEdital}</strong>, realizada no período de <strong>${certState.periodoRealizacao}</strong>, contabilizando carga horária total de <strong>${certState.cargaHorariaExtenso}</strong>.</p>
    <p>No âmbito desta ação extensionista, o profissional atuou na produção editorial acessível e entrega comunitária gratuita de <strong>materiais educativos (folhetos em fonte ampliada de alto contraste e áudio-guias preventivos)</strong>, aplicação de enquete estruturada para <strong>coleta de dados populacionais</strong> sobre barreiras visuais na terceira idade, <strong>comunicação científica para combate à desinformação (fake news)</strong> contra colírios milagrosos sem evidência científica, e <strong>divulgação dos canais oficiais de assistência oftalmológica e cirurgia de catarata pelo SUS</strong>.</p>
    <p style="text-align:center; font-style:italic; font-size:16px">${certState.dataEmissaoExtenso}</p>
    <table>
      <tr>
        <td style="text-align:center"><strong>BÁRBARA LIMA DOS SANTOS</strong><br/>Editora-Chefe e Coordenadora de Extensão Editorial<br/><span class="mono">Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)</span></td>
        <td style="text-align:center"><span class="mono"><strong>AUTENTICAÇÃO PÚBLICA</strong><br/>Cód.: ${certState.codigoAutenticidade}<br/>Chave: ${certState.chaveControle}<br/><a href="${verificationFullUrl}">${verificationFullUrl}</a></span></td>
        <td style="text-align:center"><strong>JAMES ARAÚJO DE SANTANA</strong><br/>Coordenador de Extensão e Projetos Educativos<br/><span class="mono">Centro Profissionalizante Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)</span></td>
      </tr>
    </table>
  </div>

  <div class="sheet">
    <h2>MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE DE EXTENSÃO (VERSO Nº ${certState.numero})</h2>
    <table>
      <tr>
        <td style="width:50%"><strong>1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL</strong><br/>Titular: <strong>${certState.titularNome}</strong><br/>CPF: <strong>${certState.titularCpf}</strong> | Qualificação: <strong>${certState.titularQualificacao}</strong><br/>Origem: <strong>${certState.titularInstituicao}</strong></td>
        <td style="width:50%"><strong>2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO</strong><br/><strong>Item 08 – Atividades de Extensão: Campanhas educativas, de vacinação, coleta de dados populacionais e atividades comunitárias</strong><br/><span class="mono">Período: ${certState.periodoRealizacao} | Total: ${certState.cargaHorariaCurta}</span></td>
      </tr>
    </table>
    <table>
      <thead>
        <tr>
          <th style="width:32%">Eixo Metodológico</th>
          <th style="width:56%">Descrição Prática e Entregas</th>
          <th style="width:12%">Carga Horária</th>
        </tr>
      </thead>
      <tbody>
        ${certState.eixos
          .map(
            (e) =>
              `<tr><td><strong>${e.eixoTitulo}</strong><br/><small>${e.subtitulo}</small></td><td>${e.descricao}</td><td class="mono"><strong>${e.cargaHoraria}</strong></td></tr>`
          )
          .join('')}
      </tbody>
    </table>
    <p class="mono" style="font-size:11px"><strong>4. REGISTRO DE FÉ PÚBLICA:</strong> Livro nº ${certState.livro}, Folha ${certState.folha} | CÓDIGO: ${certState.codigoAutenticidade} | CHAVE: ${certState.chaveControle}<br/>URL: <a href="${verificationFullUrl}">${verificationFullUrl}</a><br/>HASH SHA-256: ${certState.hashSha256}</p>
  </div>
</body>
</html>`;

    const mimeType =
      format === 'doc' ? 'application/msword;charset=utf-8' : 'text/html;charset=utf-8';
    const extension = format === 'doc' ? 'doc' : 'html';
    const blob = new Blob(['\ufeff', htmlContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado_Editavel_${certState.numero}_${certState.codigoAutenticidade}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccessMessage(
      format === 'doc'
        ? 'Arquivo Word Editável (.DOC) exportado com sucesso!'
        : 'Arquivo HTML Editável e Pesquisável exportado com sucesso!'
    );
    setTimeout(() => setExportSuccessMessage(null), 5000);
  };

  const editableOutlineClass = isEditing
    ? 'outline-1 outline-dashed outline-[#D97706] bg-[#FEF3C7]/40 px-1 rounded-xs cursor-text transition-colors'
    : '';

  const sheetBaseInlineStyle: React.CSSProperties = {
    width: '1122px',
    height: '793px',
    transform: `scale(${effectiveScale})`,
    transformOrigin: 'top left',
    backgroundColor: '#FAF9F6',
    fontFamily: SANS_FONT,
    color: '#1E293B',
    padding: '18px',
    boxSizing: 'border-box',
  };

  return (
    <div className="w-full">
      {/* Top PDF Reader & Live Editor Action Bar */}
      <div className="bg-[#0B3B49] text-[#FDFBF7] rounded-t-xl border border-[#0B3B49] px-4 py-3.5 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#F59E0B]">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[#E2DCCE]">
              <span>PADRÃO OFICIAL A4 (3366×2379px) · PESQUISÁVEL (CTRL+F)</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular text-[#FCD34D]">
                CÓD. {certState.codigoAutenticidade}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Certificado_Extensao_{certState.numero}_{certState.codigoAutenticidade}_Lucas_Goncalves_Silveira.pdf
            </h3>
          </div>
        </div>

        {/* View switcher, Live Edit toggle & Export controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsEditing((prev) => !prev);
              setShowQuickForm((prev) => !prev);
            }}
            className={`px-3 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isEditing
                ? 'bg-[#FCD34D] text-[#0B3B49] border-[#FCD34D]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Concluir Edição ao Vivo' : 'Editar Textos / Dados'}</span>
          </button>

          <div className="flex items-center bg-[#072630] p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('both')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'both'
                  ? 'bg-[#D97706] text-white'
                  : 'text-[#E2DCCE] hover:text-white'
              }`}
            >
              2 Laudas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('front')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'front'
                  ? 'bg-[#D97706] text-white'
                  : 'text-[#E2DCCE] hover:text-white'
              }`}
            >
              Frente
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('back')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'back'
                  ? 'bg-[#D97706] text-white'
                  : 'text-[#E2DCCE] hover:text-white'
              }`}
            >
              Verso
            </button>
          </div>

          <div className="hidden xl:flex items-center bg-[#072630] px-2 py-1 rounded-lg border border-white/10 gap-1">
            <button
              type="button"
              onClick={() => setZoomScale((z) => Math.max(0.75, Number((z - 0.1).toFixed(2))))}
              className="p-1 text-[#E2DCCE] hover:text-white transition-colors cursor-pointer"
              title="Reduzir Zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono-tabular px-1 text-white">
              {Math.round(effectiveScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale((z) => Math.min(1.15, Number((z + 0.1).toFixed(2))))}
              className="p-1 text-[#E2DCCE] hover:text-white transition-colors cursor-pointer"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleExportEditableDocument('doc')}
            className="px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/15 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Baixar documento editável para Microsoft Word / LibreOffice"
          >
            <FileText className="w-4 h-4 text-[#FCD34D]" />
            <span>Word (.DOC)</span>
          </button>

          <button
            type="button"
            onClick={() => handleExportEditableDocument('html')}
            className="px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/15 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Baixar arquivo HTML autônomo editável e pesquisável"
          >
            <FileCode className="w-4 h-4 text-[#FCD34D]" />
            <span>HTML Editável</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/15 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Imprimir ou Salvar como PDF Vetorial Nativo do Navegador"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Vetorial</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSearchablePdf}
            disabled={isExportingPdf}
            className="px-4 py-2 text-xs font-bold bg-[#D97706] hover:bg-[#B45309] disabled:opacity-60 text-white rounded-lg flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gerando PDF Oficial...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Baixar PDF Pesquisável (2 Laudas)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* LIVE EDITING STRUCTURED PANEL */}
      {showQuickForm && (
        <div className="bg-[#FDFBF7] border-x border-b border-[#0B3B49] p-5 space-y-4 no-print">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DCCE] pb-3">
            <div>
              <div className="text-xs font-mono-tabular font-bold uppercase text-[#D97706]">
                PAINEL DE EDIÇÃO EM TEMPO REAL · CERTIFICADO EDITÁVEL E PESQUISÁVEL
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0B3B49]">
                Altere qualquer campo abaixo (ou clique diretamente nos textos do certificado) antes
                de baixar o PDF
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setCertState(getInitialCertState())}
              className="px-3 py-1.5 rounded-lg border border-[#0B3B49] text-xs font-bold text-[#0B3B49] hover:bg-[#0B3B49] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Dados Originais (Certificado 07)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#0B3B49] mb-1">Nome do Titular:</label>
              <input
                type="text"
                value={certState.titularNome}
                onChange={(e) => setCertState({ ...certState, titularNome: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B3B49] mb-1">CPF do Titular:</label>
              <input
                type="text"
                value={certState.titularCpf}
                onChange={(e) => setCertState({ ...certState, titularCpf: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white font-mono-tabular"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B3B49] mb-1">
                Código de Autenticidade (QR):
              </label>
              <input
                type="text"
                value={certState.codigoAutenticidade}
                onChange={(e) =>
                  setCertState({ ...certState, codigoAutenticidade: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white font-mono-tabular font-bold text-[#0F4C3A]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B3B49] mb-1">Chave de Controle:</label>
              <input
                type="text"
                value={certState.chaveControle}
                onChange={(e) => setCertState({ ...certState, chaveControle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white font-mono-tabular"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0B3B49] mb-1">
                Título da Atividade de Extensão (Modelo 07):
              </label>
              <input
                type="text"
                value={certState.tituloAtividade}
                onChange={(e) => setCertState({ ...certState, tituloAtividade: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B3B49] mb-1">Período de Realização:</label>
              <input
                type="text"
                value={certState.periodoRealizacao}
                onChange={(e) => setCertState({ ...certState, periodoRealizacao: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0B3B49] mb-1">
                Local e Data de Emissão:
              </label>
              <input
                type="text"
                value={certState.dataEmissaoExtenso}
                onChange={(e) => setCertState({ ...certState, dataEmissaoExtenso: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Notification Banner */}
      {exportSuccessMessage && (
        <div className="bg-[#0F4C3A] text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between border-x border-[#0B3B49] no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FCD34D] shrink-0" />
            <span>{exportSuccessMessage}</span>
          </div>
          {onJumpToValidator && (
            <button
              type="button"
              onClick={onJumpToValidator}
              className="underline text-[#FCD34D] hover:text-white font-semibold ml-4 whitespace-nowrap cursor-pointer"
            >
              Testar Validador de Autenticidade →
            </button>
          )}
        </div>
      )}

      {/* PDF Viewer Stage */}
      <div
        ref={containerWrapperRef}
        className="bg-[#233138] border-x border-b border-[#0B3B49] rounded-b-xl py-8 px-4 flex flex-col items-center gap-8 overflow-x-auto"
      >
        {/* =====================================================================
            LAUDA 1 (FRENTE DO CERTIFICADO Nº 07) — Exact 1122px x 793px
           ===================================================================== */}
        {(activeTab === 'both' || activeTab === 'front') && (
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-between w-full max-w-[1122px] mb-2 px-1 text-xs text-[#E2DCCE] no-print gap-2">
              <span className="font-mono-tabular uppercase tracking-wider">
                PÁGINA 1 DE 2 — FRENTE DO CERTIFICADO OFICIAL (MODELO {certState.numero})
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#A7F3D0]">
                  <SearchCheck className="w-4 h-4" />
                  <span>Fontes Embutidas & Texto Pesquisável (Ctrl+F)</span>
                </span>
                <span className="flex items-center gap-1 text-[#FCD34D]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Padrão Estético 100% Idêntico ao PDF Oficial</span>
                </span>
              </span>
            </div>

            <div
              style={{
                width: `${Math.round(1122 * effectiveScale)}px`,
                height: `${Math.round(793 * effectiveScale)}px`,
              }}
              className="relative overflow-hidden shadow-2xl rounded-xs"
            >
              <div
                ref={page1Ref}
                contentEditable={isEditing}
                suppressContentEditableWarning
                style={sheetBaseInlineStyle}
                className="cert-page-sheet relative select-text"
              >
                {/* Outer Green Institutional Border (y=18 to y=775) */}
                <div
                  style={{ borderColor: '#0F4C3A', borderWidth: '2px', padding: '5px' }}
                  className="w-full h-full border box-border relative"
                >
                  {/* Inner Navy Border (y=24 to y=769) */}
                  <div
                    style={{
                      borderColor: '#1B365D',
                      borderWidth: '1.2px',
                      padding: '18px 34px 12px 34px',
                    }}
                    className="w-full h-full border box-border flex flex-col justify-between relative"
                  >
                    {/* TOP INSTITUTIONAL HEADER */}
                    <div
                      style={{ borderBottom: '1px solid #CBD6D1', paddingBottom: '12px' }}
                      className="grid grid-cols-12 items-center"
                    >
                      {/* Left: Editora Mente e Saúde */}
                      <div className="col-span-4 flex items-center gap-3">
                        <LogoEditoraMenteSaude size={58} />
                        <div className="leading-tight">
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[14.5px] font-extrabold tracking-tight text-[#0F4C3A] uppercase"
                          >
                            EDITORA MENTE E SAÚDE
                          </div>
                          <div
                            style={{ fontFamily: MONO_FONT }}
                            className="text-[10.5px] font-semibold text-[#1E293B] mt-0.5"
                          >
                            CNPJ: 51.372.335/0001-71
                          </div>
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[10px] text-[#0F4C3A] font-medium mt-0.5"
                          >
                            Conselho Editorial e Extensão Científica
                          </div>
                        </div>
                      </div>

                      {/* Center: Program Title & Registry */}
                      <div className="col-span-4 text-center px-1">
                        <div
                          style={{ fontFamily: SANS_FONT }}
                          className="text-[10px] font-extrabold tracking-[0.07em] text-[#0F172A] uppercase leading-[1.35]"
                        >
                          PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO,
                          <br />
                          COMUNICAÇÃO CIENTÍFICA
                          <br />E EDUCAÇÃO EM SAÚDE
                        </div>
                        <div
                          style={{ fontFamily: MONO_FONT }}
                          className="text-[10px] font-medium text-[#334155] mt-1.5 leading-[1.35]"
                        >
                          Certificado Nº {certState.numero} · Livro de Extensão nº {certState.livro}{' '}
                          · Cód.
                          <br />
                          <span className={`font-bold text-[#0F172A] ${editableOutlineClass}`}>
                            {certState.codigoAutenticidade}
                          </span>
                        </div>
                      </div>

                      {/* Right: Centro Profissionalizante Maria Dalva de Araújo */}
                      <div className="col-span-4 flex items-center justify-end gap-3 text-right">
                        <div className="leading-tight">
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[13px] font-extrabold tracking-tight text-[#1B365D] uppercase leading-[1.22]"
                          >
                            CENTRO PROFISSIONALIZANTE
                            <br />
                            MARIA DALVA DE ARAÚJO
                          </div>
                          <div
                            style={{ fontFamily: MONO_FONT }}
                            className="text-[10.5px] font-semibold text-[#1E293B] mt-1"
                          >
                            CNPJ: 51.269.112/0001-83
                          </div>
                        </div>
                        <LogoCentroMariaDalva size={58} />
                      </div>
                    </div>

                    {/* MAIN CERTIFICATE HEADING & INTRO */}
                    <div className="text-center mt-1">
                      <h1
                        style={{ fontFamily: SERIF_FONT }}
                        className="text-[32px] font-extrabold tracking-[0.06em] text-[#0F4C3A] uppercase leading-tight"
                      >
                        CERTIFICADO DE ATIVIDADE DE EXTENSÃO
                      </h1>
                      <p
                        style={{ fontFamily: SANS_FONT }}
                        className="text-[13px] text-[#334155] mt-1.5 max-w-[910px] mx-auto leading-[1.45]"
                      >
                        A <strong className="font-bold text-[#0F172A]">Editora Mente e Saúde</strong>{' '}
                        (CNPJ: 51.372.335/0001-71), em parceria institucional com o{' '}
                        <strong className="font-bold text-[#0F172A]">
                          Centro Profissionalizante Maria Dalva de Araújo
                        </strong>{' '}
                        (CNPJ: 51.269.112/0001-83), certifica para os devidos fins de comprovação
                        curricular e acadêmica que
                      </p>
                    </div>

                    {/* PARTICIPANT HIGHLIGHT BOX (Exact #F3F1EA bg and #D5CFC2 border) */}
                    <div
                      style={{
                        backgroundColor: '#F3F1EA',
                        borderColor: '#D5CFC2',
                        borderWidth: '1px',
                      }}
                      className="border rounded-xs py-2.5 px-6 text-center my-1"
                    >
                      <div
                        style={{ fontFamily: SERIF_FONT }}
                        className={`text-[28px] font-extrabold tracking-[0.05em] text-[#0F172A] uppercase leading-tight ${editableOutlineClass}`}
                      >
                        {certState.titularNome}
                      </div>
                      <div
                        style={{ fontFamily: SANS_FONT }}
                        className={`text-[12.5px] font-bold text-[#1E293B] mt-1 tracking-wide ${editableOutlineClass}`}
                      >
                        {certState.titularQualificacao} | CPF: {certState.titularCpf} |{' '}
                        {certState.titularInstituicao}
                      </div>
                    </div>

                    {/* BODY PARAGRAPHS (EXACT MODEL 07 NARRATIVE) */}
                    <div
                      style={{ fontFamily: SANS_FONT }}
                      className={`space-y-2.5 text-[13.1px] text-[#1E293B] leading-[1.52] text-justify px-0.5 ${editableOutlineClass}`}
                    >
                      <p>
                        participou de forma efetiva da{' '}
                        <strong className="font-bold text-[#0F172A]">Atividade de Extensão</strong>{' '}
                        intitulada{' '}
                        <strong className="font-bold text-[#0F172A]">
                          “{certState.tituloAtividade}”
                        </strong>
                        , desenvolvida na modalidade de{' '}
                        <strong className="font-bold text-[#0F172A]">
                          {certState.modalidadeEdital}
                        </strong>
                        , realizada no período de{' '}
                        <strong className="font-bold text-[#0F172A]">
                          {certState.periodoRealizacao}
                        </strong>
                        , contabilizando carga horária total de{' '}
                        <strong className="font-bold text-[#0F172A]">
                          {certState.cargaHorariaExtenso}
                        </strong>
                        .
                      </p>
                      <p>
                        No âmbito desta ação extensionista, o profissional atuou na produção
                        editorial acessível e entrega comunitária gratuita de{' '}
                        <strong className="font-bold text-[#0F172A]">
                          materiais educativos (folhetos em fonte ampliada de alto contraste e
                          áudio-guias preventivos)
                        </strong>
                        , aplicação de enquete estruturada para{' '}
                        <strong className="font-bold text-[#0F172A]">
                          coleta de dados populacionais
                        </strong>{' '}
                        sobre barreiras visuais na terceira idade,{' '}
                        <strong className="font-bold text-[#0F172A]">
                          comunicação científica para combate à desinformação (fake news)
                        </strong>{' '}
                        contra colírios milagrosos sem evidência científica, e{' '}
                        <strong className="font-bold text-[#0F172A]">
                          divulgação dos canais oficiais de assistência oftalmológica e cirurgia de
                          catarata pelo SUS
                        </strong>
                        .
                      </p>
                    </div>

                    {/* LOCATION AND DATE */}
                    <div className="text-center my-0.5">
                      <span
                        style={{ fontFamily: SERIF_FONT }}
                        className={`italic text-[16px] font-semibold text-[#0F172A] ${editableOutlineClass}`}
                      >
                        {certState.dataEmissaoExtenso}
                      </span>
                    </div>

                    {/* SIGNATURES + SEAL + QR CODE BLOCK */}
                    <div className="grid grid-cols-12 items-end pt-0.5 pb-1.5">
                      {/* Left Signature: Bárbara Lima dos Santos */}
                      <div className="col-span-4 text-center px-3">
                        <AssinaturaBarbaraLima width={166} height={38} className="mb-1" />
                        <div className="border-t border-[#334155] pt-1.5">
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[11px] font-extrabold text-[#0F172A] uppercase tracking-wide"
                          >
                            BÁRBARA LIMA DOS SANTOS
                          </div>
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[9.8px] text-[#334155] font-medium mt-0.5"
                          >
                            Editora-Chefe e Coordenadora de Extensão Editorial
                          </div>
                          <div
                            style={{ fontFamily: MONO_FONT }}
                            className="text-[9px] font-semibold text-[#1E293B] mt-0.5"
                          >
                            Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)
                          </div>
                        </div>
                      </div>

                      {/* Center: Golden Seal + QR Code Verification Card */}
                      <div className="col-span-4 flex items-center justify-center gap-3">
                        <SeloOficialFePublica codigo={certState.codigoAutenticidade} />

                        <div className="bg-white border border-[#CBD5E1] rounded-xs p-2 flex items-center gap-2.5">
                          <div className="p-0.5 bg-white shrink-0">
                            <QRCodeSVG
                              value={verificationFullUrl}
                              size={74}
                              level="M"
                              includeMargin={false}
                              fgColor="#0F172A"
                              bgColor="#FFFFFF"
                            />
                          </div>
                          <div className="text-left leading-[1.28] max-w-[146px]">
                            <div
                              style={{ fontFamily: SANS_FONT }}
                              className="text-[7.8px] font-extrabold text-[#0F4C3A] uppercase tracking-wider"
                            >
                              AUTENTICAÇÃO PÚBLICA
                              <br />
                              MANUAL
                            </div>
                            <div
                              style={{ fontFamily: MONO_FONT }}
                              className="text-[7.5px] font-bold text-[#0F172A] mt-0.5"
                            >
                              Cód.: {certState.codigoAutenticidade}
                            </div>
                            <div
                              style={{ fontFamily: MONO_FONT }}
                              className="text-[7.2px] text-[#334155]"
                            >
                              Chave: {certState.chaveControle}
                            </div>
                            <div
                              style={{ fontFamily: SANS_FONT }}
                              className="text-[7px] font-bold text-[#1E293B] mt-1"
                            >
                              Endereço p/ Verificação Online:
                            </div>
                            <div
                              style={{ fontFamily: MONO_FONT }}
                              className="text-[6.5px] text-[#475569] break-all leading-[1.15]"
                            >
                              {cleanOrigin}/
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Signature: James Araújo de Santana */}
                      <div className="col-span-4 text-center px-3">
                        <AssinaturaJamesAraujo width={162} height={39} className="mb-1" />
                        <div className="border-t border-[#334155] pt-1.5">
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[11px] font-extrabold text-[#0F172A] uppercase tracking-wide"
                          >
                            JAMES ARAÚJO DE SANTANA
                          </div>
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[9.8px] text-[#334155] font-medium mt-0.5"
                          >
                            Coordenador de Extensão e Projetos Educativos
                          </div>
                          <div
                            style={{ fontFamily: MONO_FONT }}
                            className="text-[9px] font-semibold text-[#1E293B] mt-0.5 leading-tight"
                          >
                            Centro Profissionalizante Maria Dalva de Araújo (CNPJ:
                            <br />
                            51.269.112/0001-83)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM VERIFICATION STRIP */}
                    <div
                      style={{ borderTop: '1px solid #D9DFE7', paddingTop: '6px' }}
                      className="text-center"
                    >
                      <p style={{ fontFamily: MONO_FONT }} className="text-[9px] text-[#334155]">
                        Verifique via QR Code ou acesse{' '}
                        <strong className="font-bold text-[#0F172A]">{cleanOrigin}/</strong>{' '}
                        informando o Código{' '}
                        <strong className="font-bold text-[#0F172A]">
                          {certState.codigoAutenticidade}
                        </strong>{' '}
                        ou Chave{' '}
                        <strong className="font-bold text-[#0F172A]">
                          {certState.chaveControle}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            LAUDA 2 (VERSO DO CERTIFICADO Nº 07 — MEMORIAL DESCRITIVO E EMENTA)
           ===================================================================== */}
        {(activeTab === 'both' || activeTab === 'back') && (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-[1122px] mb-2 px-1 text-xs text-[#E2DCCE] no-print">
              <span className="font-mono-tabular uppercase tracking-wider">
                PÁGINA 2 DE 2 — VERSO OFICIAL (MEMORIAL DESCRITIVO, 4 EIXOS DE{' '}
                {certState.cargaHorariaCurta} E REGISTRO SHA-256)
              </span>
              <span className="font-mono-tabular text-[#FCD34D]">
                Livro {certState.livro} · Folha {certState.folha}
              </span>
            </div>

            <div
              style={{
                width: `${Math.round(1122 * effectiveScale)}px`,
                height: `${Math.round(793 * effectiveScale)}px`,
              }}
              className="relative overflow-hidden shadow-2xl rounded-xs"
            >
              <div
                ref={page2Ref}
                contentEditable={isEditing}
                suppressContentEditableWarning
                style={sheetBaseInlineStyle}
                className="cert-page-sheet relative select-text"
              >
                {/* Outer Green Institutional Border */}
                <div
                  style={{ borderColor: '#0F4C3A', borderWidth: '2px', padding: '5px' }}
                  className="w-full h-full border box-border relative"
                >
                  {/* Inner Navy Border */}
                  <div
                    style={{
                      borderColor: '#1B365D',
                      borderWidth: '1.2px',
                      padding: '16px 32px 12px 32px',
                    }}
                    className="w-full h-full border box-border flex flex-col justify-between relative"
                  >
                    {/* TOP HEADER (VERSO) */}
                    <div
                      style={{ borderBottom: '1px solid #CBD6D1', paddingBottom: '10px' }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <LogoEditoraMenteSaude size={44} />
                        <div>
                          <h2
                            style={{ fontFamily: SERIF_FONT }}
                            className="text-[19.5px] font-extrabold tracking-[0.03em] text-[#0F4C3A] uppercase leading-tight"
                          >
                            MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE DE EXTENSÃO
                          </h2>
                          <p
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[11px] text-[#475569] mt-0.5"
                          >
                            Verso Oficial do Certificado Nº {certState.numero} · Fé Pública
                            Interinstitucional e Validação Curricular
                          </p>
                        </div>
                      </div>
                      <LogoCentroMariaDalva size={44} />
                    </div>

                    {/* SECTIONS 1 & 2 (TWO COLUMNS) */}
                    <div className="grid grid-cols-12 gap-3.5 my-1">
                      {/* Box 1 */}
                      <div
                        style={{ backgroundColor: '#F4F2EC', borderColor: '#E2DFD5' }}
                        className={`col-span-6 border rounded-xs p-3 ${editableOutlineClass}`}
                      >
                        <div
                          style={{ fontFamily: SANS_FONT }}
                          className="text-[10px] font-extrabold tracking-wider text-[#0F4C3A] uppercase mb-1.5"
                        >
                          1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL EXTENSIONISTA
                        </div>
                        <div
                          style={{ fontFamily: SANS_FONT }}
                          className="space-y-1 text-[11.5px] text-[#334155]"
                        >
                          <div>
                            Titular Certificado:{' '}
                            <strong className="font-bold text-[#0F172A]">
                              {certState.titularNome}
                            </strong>
                          </div>
                          <div>
                            CPF Registrado:{' '}
                            <strong className="font-bold text-[#0F172A]">
                              {certState.titularCpf}
                            </strong>
                          </div>
                          <div>
                            Qualificação Profissional:{' '}
                            <strong className="font-bold text-[#0F172A]">
                              {certState.titularQualificacao}
                            </strong>
                          </div>
                          <div>
                            Instituição de Origem:{' '}
                            <strong className="font-bold text-[#0F172A]">
                              {certState.titularInstituicao}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Box 2 */}
                      <div
                        style={{ backgroundColor: '#F4F2EC', borderColor: '#E2DFD5' }}
                        className={`col-span-6 border rounded-xs p-3 flex flex-col justify-between ${editableOutlineClass}`}
                      >
                        <div>
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[10px] font-extrabold tracking-wider text-[#0F4C3A] uppercase mb-1.5"
                          >
                            2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO
                          </div>
                          <p
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[12px] font-bold text-[#0F172A] leading-snug"
                          >
                            Item 08 – Atividades de Extensão: Campanhas educativas, de vacinação,
                            coleta de dados populacionais e atividades comunitárias
                          </p>
                        </div>
                        <div
                          style={{ fontFamily: MONO_FONT, borderTop: '1px solid #DFDBD0' }}
                          className="pt-1.5 mt-2 text-[11.5px] font-semibold text-[#1E293B]"
                        >
                          Período: {certState.periodoRealizacao} &nbsp;|&nbsp; Total:{' '}
                          {certState.cargaHorariaCurta}
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: MATRIZ DE ATIVIDADES PRÁTICAS (14 HORAS) */}
                    <div
                      style={{ borderColor: '#DFDBD0' }}
                      className={`border rounded-xs bg-white overflow-hidden my-1 ${editableOutlineClass}`}
                    >
                      <div
                        style={{ backgroundColor: '#F2EFE9', borderBottom: '1px solid #DFDBD0' }}
                        className="px-3.5 py-1.5"
                      >
                        <span
                          style={{ fontFamily: SANS_FONT }}
                          className="text-[10px] font-extrabold tracking-wider text-[#0F4C3A] uppercase"
                        >
                          3. MATRIZ DE ATIVIDADES PRÁTICAS E METODOLOGIA EXTENSIONISTA (14 HORAS)
                        </span>
                      </div>
                      <div className="divide-y divide-[#E5E2D9]">
                        {certState.eixos.map((eixo) => (
                          <div
                            key={eixo.id}
                            className="grid grid-cols-12 items-center px-3.5 py-2 gap-3"
                          >
                            <div className="col-span-4">
                              <div
                                style={{ fontFamily: SANS_FONT }}
                                className="text-[11px] font-bold text-[#0F172A] leading-tight"
                              >
                                {eixo.eixoTitulo}
                              </div>
                              <div
                                style={{ fontFamily: SANS_FONT }}
                                className="text-[9.3px] text-[#64748B] mt-0.5 leading-tight"
                              >
                                {eixo.subtitulo}
                              </div>
                            </div>
                            <div
                              style={{ fontFamily: SANS_FONT }}
                              className="col-span-7 text-[10.4px] text-[#334155] leading-[1.35]"
                            >
                              {eixo.descricao}
                            </div>
                            <div
                              style={{ fontFamily: MONO_FONT }}
                              className="col-span-1 text-right text-[11px] font-bold text-[#0F4C3A] whitespace-nowrap"
                            >
                              {eixo.cargaHoraria}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 4: REGISTRO OFICIAL DE FÉ PÚBLICA E HASH SHA-256 */}
                    <div
                      style={{ backgroundColor: '#FBF8EC', borderColor: '#E2D5B5' }}
                      className={`border rounded-xs p-3 flex items-center justify-between gap-4 my-1 ${editableOutlineClass}`}
                    >
                      <div className="space-y-1 text-[10.5px] text-[#1E293B] flex-1">
                        <div
                          style={{ fontFamily: SANS_FONT }}
                          className="text-[10px] font-extrabold tracking-wider text-[#855B0A] uppercase"
                        >
                          4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE VERIFICAÇÃO DE
                          AUTENTICIDADE
                        </div>
                        <p style={{ fontFamily: SANS_FONT }} className="leading-snug">
                          Certificado registrado sob o <strong>nº {certState.numero}</strong> no{' '}
                          <strong>
                            Livro de Extensão nº {certState.livro}, Folha {certState.folha}
                          </strong>
                          , expedido pela <strong>Editora Mente e Saúde</strong> (CNPJ:
                          51.372.335/0001-71) e{' '}
                          <strong>Centro Profissionalizante Maria Dalva de Araújo</strong> (CNPJ:
                          51.269.112/0001-83).
                        </p>
                        <div
                          style={{ fontFamily: MONO_FONT }}
                          className="text-[9.8px] font-semibold text-[#0F172A] pt-0.5"
                        >
                          CÓDIGO DE AUTENTICIDADE: {certState.codigoAutenticidade} &nbsp;|&nbsp;
                          CHAVE DE CONTROLE / DÍGITO: {certState.chaveControle}
                        </div>
                        <div
                          style={{ fontFamily: MONO_FONT }}
                          className="text-[9.3px] text-[#334155]"
                        >
                          <strong className="text-[#0F172A]">
                            ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE):
                          </strong>{' '}
                          {verificationFullUrl}
                        </div>
                        <div
                          style={{ fontFamily: MONO_FONT }}
                          className="text-[9px] text-[#475569]"
                        >
                          <strong className="text-[#0F172A]">HASH SHA-256:</strong>{' '}
                          {certState.hashSha256}
                        </div>
                      </div>

                      <div className="bg-white p-1.5 border border-[#D6D3C9] rounded-xs shrink-0">
                        <QRCodeSVG
                          value={verificationFullUrl}
                          size={80}
                          level="M"
                          includeMargin={false}
                          fgColor="#0F172A"
                          bgColor="#FFFFFF"
                        />
                      </div>
                    </div>

                    {/* BOTTOM SIGNATURES & FOOTER (VERSO) */}
                    <div className="grid grid-cols-12 items-end pt-1">
                      <div className="col-span-4 text-center px-3">
                        <AssinaturaBarbaraLima width={140} height={32} className="mb-1" />
                        <div className="border-t border-[#334155] pt-1">
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[10.5px] font-extrabold text-[#0F172A] uppercase"
                          >
                            BÁRBARA LIMA DOS SANTOS
                          </div>
                          <div
                            style={{ fontFamily: MONO_FONT }}
                            className="text-[8.8px] text-[#334155]"
                          >
                            Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)
                          </div>
                        </div>
                      </div>

                      <div className="col-span-4 text-center pb-0.5">
                        <div
                          style={{ fontFamily: SERIF_FONT }}
                          className="italic text-[14px] font-semibold text-[#0F172A]"
                        >
                          {certState.dataEmissaoExtenso}
                        </div>
                        <div
                          style={{ fontFamily: SANS_FONT }}
                          className="text-[9px] text-[#475569] mt-0.5"
                        >
                          Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo o
                          Território Nacional
                        </div>
                        <div
                          style={{ fontFamily: MONO_FONT }}
                          className="text-[8.5px] text-[#64748B] mt-0.5"
                        >
                          Registro: {certState.codigoAutenticidade} · Chave:{' '}
                          {certState.chaveControle}
                        </div>
                      </div>

                      <div className="col-span-4 text-center px-3">
                        <AssinaturaJamesAraujo width={136} height={32} className="mb-1" />
                        <div className="border-t border-[#334155] pt-1">
                          <div
                            style={{ fontFamily: SANS_FONT }}
                            className="text-[10.5px] font-extrabold text-[#0F172A] uppercase"
                          >
                            JAMES ARAÚJO DE SANTANA
                          </div>
                          <div
                            style={{ fontFamily: MONO_FONT }}
                            className="text-[8.8px] text-[#334155]"
                          >
                            Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
