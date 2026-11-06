import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  FileText,
  ChevronLeft,
  ChevronRight,
  Type,
  Contrast,
  CheckCircle2,
  Headphones,
} from 'lucide-react';
import {
  AUDIO_GUIDES_LIST,
  LARGE_PRINT_LEAFLETS,
  AudioGuideItem,
} from '../data/certificate07Data';

type ContrastMode = 'creme' | 'amarelo-preto' | 'petroleo';
type FontScale = '18pt' | '24pt' | '30pt';

export const AudioAndLeafletsHub: React.FC = () => {
  // Audio player state
  const [selectedAudio, setSelectedAudio] = useState<AudioGuideItem>(AUDIO_GUIDES_LIST[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [progressPct, setProgressPct] = useState<number>(0);
  const progressTimerRef = useRef<number | null>(null);

  // Leaflet viewer state
  const [leafletIndex, setLeafletIndex] = useState<number>(0);
  const [contrastMode, setContrastMode] = useState<ContrastMode>('creme');
  const [fontScale, setFontScale] = useState<FontScale>('24pt');

  const currentLeaflet = LARGE_PRINT_LEAFLETS[leafletIndex];

  // Clean up speech synthesis & timer on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const playWarmChime = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Ignore audio context restrictions if blocked
    }
  };

  const stopAudioPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleTogglePlay = (item: AudioGuideItem = selectedAudio) => {
    if (isPlaying && item.id === selectedAudio.id) {
      stopAudioPlayback();
      return;
    }

    stopAudioPlayback();
    setSelectedAudio(item);
    setProgressPct(0);
    setIsPlaying(true);
    playWarmChime(item.frequenciaBaseHz);

    // Start smooth progress bar timer
    const estimatedDurationMs = 26000 / speechRate;
    const startTime = Date.now();
    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / estimatedDurationMs) * 100));
      setProgressPct(pct);
      if (pct >= 100) {
        stopAudioPlayback();
      }
    }, 200);

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(item.transcricaoCompleta);
      utterance.lang = 'pt-BR';
      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setProgressPct(100);
        setIsPlaying(false);
        if (progressTimerRef.current) {
          window.clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      };
      utterance.onerror = () => {
        // Keep visual progress timer active if browser lacks local TTS voice
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const getContrastStyles = (mode: ContrastMode) => {
    if (mode === 'amarelo-preto') {
      return {
        wrapper: 'bg-[#090D16] text-[#FDE047] border-[#F59E0B]',
        card: 'bg-[#111827] border-[#FDE047]/40 text-white',
        highlight: 'bg-[#FDE047] text-[#090D16] font-extrabold',
        muted: 'text-[#FEF08A]',
      };
    }
    if (mode === 'petroleo') {
      return {
        wrapper: 'bg-[#0B3B49] text-[#FDFBF7] border-[#145365]',
        card: 'bg-[#072630] border-white/20 text-[#FDFBF7]',
        highlight: 'bg-[#D97706] text-white font-bold',
        muted: 'text-[#FCD34D]',
      };
    }
    return {
      wrapper: 'bg-[#FDFBF7] text-[#112A34] border-[#0B3B49]',
      card: 'bg-[#F5F1E8] border-[#D5CFC0] text-[#112A34]',
      highlight: 'bg-[#0B3B49] text-[#FCD34D] font-bold',
      muted: 'text-[#0F4C3A]',
    };
  };

  const getFontSizeClasses = (scale: FontScale) => {
    if (scale === '30pt') {
      return {
        title: 'text-2xl sm:text-3xl leading-tight',
        heading: 'text-xl sm:text-2xl',
        body: 'text-lg sm:text-xl leading-relaxed',
      };
    }
    if (scale === '24pt') {
      return {
        title: 'text-xl sm:text-2xl leading-tight',
        heading: 'text-lg sm:text-xl',
        body: 'text-base sm:text-lg leading-relaxed',
      };
    }
    return {
      title: 'text-lg sm:text-xl leading-snug',
      heading: 'text-base sm:text-lg',
      body: 'text-sm sm:text-base leading-relaxed',
    };
  };

  const theme = getContrastStyles(contrastMode);
  const typo = getFontSizeClasses(fontScale);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* LEFT COLUMN (5 COLS): AUDIO-GUIDES PLAYER (WHATSAPP PÍLULAS SONORAS) */}
      <div className="lg:col-span-5 bg-white border border-[#E2DCCE] rounded-2xl p-6 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#E2DCCE]">
            <div>
              <div className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#D97706]">
                EIXO III · ACESSIBILIDADE SONORA VIA WHATSAPP
              </div>
              <h3 className="text-xl font-bold text-[#0B3B49] mt-0.5">
                Áudio-Guias Preventivos para Idosos
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0B3B49] text-[#FCD34D] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
          </div>

          {/* Active Audio Player Box */}
          <div className="mt-4 bg-[#0B3B49] text-white rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#FCD34D] font-mono-tabular">
              <span>{selectedAudio.numero}</span>
              <span>DURAÇÃO ESTIMADA: {selectedAudio.duracao}</span>
            </div>
            <div className="text-base font-bold leading-snug">{selectedAudio.titulo}</div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPct}%` }}
                className="h-full bg-[#F59E0B] transition-all duration-200"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePlay(selectedAudio)}
                  className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pausar Locução</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Ouvir Áudio-Guia</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopAudioPlayback();
                    setProgressPct(0);
                  }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Reiniciar áudio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Cadence selector */}
              <div className="flex items-center gap-1 bg-[#072630] p-1 rounded-lg border border-white/10 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSpeechRate(0.85)}
                  className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                    speechRate === 0.85 ? 'bg-[#D97706] text-white' : 'text-[#E2DCCE]'
                  }`}
                >
                  0.85x Pausado
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechRate(1.0)}
                  className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                    speechRate === 1.0 ? 'bg-[#D97706] text-white' : 'text-[#E2DCCE]'
                  }`}
                >
                  1.0x Normal
                </button>
              </div>
            </div>
          </div>

          {/* List of 4 Audio Guides */}
          <div className="mt-4 space-y-2">
            <div className="text-xs font-mono-tabular font-bold uppercase text-[#526670]">
              SELECIONE UMA DAS 4 PÍLULAS DISTRIBUÍDAS NA CAMPANHA:
            </div>
            {AUDIO_GUIDES_LIST.map((item) => {
              const active = item.id === selectedAudio.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTogglePlay(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    active
                      ? 'bg-[#FDFBF7] border-[#D97706] shadow-2xs'
                      : 'bg-[#FAF8F3] border-[#E2DCCE] hover:border-[#0B3B49]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono-tabular font-bold text-[#D97706]">
                      {item.numero} · {item.duracao}
                    </div>
                    <div className="text-sm font-bold text-[#112A34] leading-snug">
                      {item.titulo}
                    </div>
                  </div>
                  <Volume2
                    className={`w-4 h-4 shrink-0 mt-1 ${
                      active ? 'text-[#D97706]' : 'text-[#526670]'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Synchronized Transcript Box */}
        <div className="mt-5 pt-4 border-t border-[#E2DCCE]">
          <div className="text-xs font-mono-tabular font-bold uppercase text-[#0B3B49] mb-1.5">
            TRANSCRIÇÃO INTEGRAL DO ROTEIRO CIENTÍFICO-COMUNITÁRIO:
          </div>
          <p className="text-xs sm:text-sm text-[#2C424B] leading-relaxed bg-[#F5F1E8] p-3.5 rounded-xl border border-[#E2DCCE]">
            “{selectedAudio.transcricaoCompleta}”
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN (7 COLS): LARGE-PRINT LEAFLET VIEWER (FOLHETOS EM FONTE AMPLIADA) */}
      <div className="lg:col-span-7 bg-white border border-[#E2DCCE] rounded-2xl p-6 flex flex-col justify-between shadow-xs">
        <div>
          {/* Header & Accessibility Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2DCCE]">
            <div>
              <div className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#0F4C3A]">
                EIXO II · ENGENHARIA EDITORIAL PARA BAIXA VISÃO
              </div>
              <h3 className="text-xl font-bold text-[#0B3B49] mt-0.5">
                Visualizador de Folhetos em Fonte Ampliada
              </h3>
            </div>

            {/* Interactive Controls for Font Size & Contrast Polarity */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-[#F5F1E8] p-1 rounded-xl border border-[#E2DCCE]">
                <span className="px-2 text-xs font-semibold text-[#526670] flex items-center gap-1">
                  <Type className="w-3.5 h-3.5" />
                </span>
                {(['18pt', '24pt', '30pt'] as FontScale[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFontScale(size)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-tabular font-bold transition-colors cursor-pointer ${
                      fontScale === size
                        ? 'bg-[#0B3B49] text-white'
                        : 'text-[#112A34] hover:bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-[#F5F1E8] p-1 rounded-xl border border-[#E2DCCE]">
                <span className="px-2 text-xs font-semibold text-[#526670] flex items-center gap-1">
                  <Contrast className="w-3.5 h-3.5" />
                </span>
                <button
                  type="button"
                  onClick={() => setContrastMode('creme')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    contrastMode === 'creme'
                      ? 'bg-[#0B3B49] text-white'
                      : 'text-[#112A34] hover:bg-white'
                  }`}
                >
                  Creme
                </button>
                <button
                  type="button"
                  onClick={() => setContrastMode('amarelo-preto')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    contrastMode === 'amarelo-preto'
                      ? 'bg-[#090D16] text-[#FDE047]'
                      : 'text-[#112A34] hover:bg-white'
                  }`}
                >
                  Amarelo/Preto AAA
                </button>
                <button
                  type="button"
                  onClick={() => setContrastMode('petroleo')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    contrastMode === 'petroleo'
                      ? 'bg-[#0B3B49] text-[#FCD34D]'
                      : 'text-[#112A34] hover:bg-white'
                  }`}
                >
                  Petróleo
                </button>
              </div>
            </div>
          </div>

          {/* Active Large-Print Page Sheet */}
          <div
            className={`mt-5 rounded-2xl border-2 p-6 transition-colors duration-200 ${theme.wrapper}`}
          >
            <div className="flex items-center justify-between border-b border-current/20 pb-3 mb-4">
              <span className={`text-xs font-mono-tabular font-bold uppercase ${theme.muted}`}>
                {currentLeaflet.categoria}
              </span>
              <span className="text-xs font-mono-tabular font-semibold opacity-80">
                EDITORA MENTE E SAÚDE · EXTENSÃO COMUNITÁRIA
              </span>
            </div>

            <h4 className={`font-extrabold tracking-tight ${typo.title}`}>
              {currentLeaflet.tituloPrincipal}
            </h4>
            <p className={`mt-1.5 opacity-90 font-medium ${typo.body}`}>
              {currentLeaflet.subtituloAcessivel}
            </p>

            <div className="mt-5 space-y-4">
              {currentLeaflet.blocos.map((bloco, i) => (
                <div key={i} className={`p-4 rounded-xl border ${theme.card} space-y-2`}>
                  <div className={`font-extrabold ${typo.heading}`}>{bloco.cabecalho}</div>
                  <p className={`${typo.body}`}>{bloco.textoCurto}</p>
                  <div className={`p-3 rounded-lg text-sm sm:text-base ${theme.highlight}`}>
                    {bloco.alertaOuDestaque}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-current/20 flex items-center justify-between text-xs sm:text-sm font-bold">
              <span>{currentLeaflet.rodapeSus}</span>
            </div>
          </div>
        </div>

        {/* Pagination Footer for Leaflets */}
        <div className="mt-5 pt-4 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#334E58]">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C3A] shrink-0" />
            <span>
              Tipografia sem serifa, espaçamento entrelinhas de 1.6x e ausência de colunas estreitas.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setLeafletIndex((idx) =>
                  idx === 0 ? LARGE_PRINT_LEAFLETS.length - 1 : idx - 1
                )
              }
              className="px-3 py-2 rounded-xl border border-[#E2DCCE] hover:border-[#0B3B49] text-xs font-bold text-[#0B3B49] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <span className="text-xs font-mono-tabular font-bold text-[#0B3B49] px-2">
              Folheto {leafletIndex + 1} de {LARGE_PRINT_LEAFLETS.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setLeafletIndex((idx) => (idx + 1) % LARGE_PRINT_LEAFLETS.length)
              }
              className="px-3 py-2 rounded-xl bg-[#0B3B49] hover:bg-[#145365] text-xs font-bold text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Próximo Folheto</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
