import React, { useState, useEffect, useRef } from 'react';
import { Eye, Sliders, Sun, Grid, BookOpen, Navigation, RotateCcw, CheckCircle2 } from 'lucide-react';

type VisionCondition = 'normal' | 'catarata' | 'dmri';
type SceneType = 'receita' | 'amsler' | 'urbano';

export const VisionSimulator: React.FC = () => {
  const [condition, setCondition] = useState<VisionCondition>('catarata');
  const [severity, setSeverity] = useState<number>(65);
  const [scene, setScene] = useState<SceneType>('receita');
  const [highContrastAdaptation, setHighContrastAdaptation] = useState<boolean>(false);

  const amslerCanvasRef = useRef<HTMLCanvasElement>(null);

  // Render interactive Amsler Grid on Canvas when scene === 'amsler'
  useEffect(() => {
    if (scene !== 'amsler' || !amslerCanvasRef.current) return;
    const canvas = amslerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    ctx.fillStyle = highContrastAdaptation ? '#0A1921' : '#FAF8F2';
    ctx.fillRect(0, 0, width, height);

    const gridColor = highContrastAdaptation ? '#FCD34D' : '#112A34';
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = highContrastAdaptation ? 2.2 : 1.4;

    const step = 24;
    const distortionFactor = condition === 'dmri' ? (severity / 100) * 22 : 0;
    const radiusEffect = 145;

    // Draw vertical lines with mathematical wave distortion (metamorfopsia) for DMRI
    for (let x = step; x < width; x += step) {
      ctx.beginPath();
      for (let y = 0; y <= height; y += 4) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offsetX = 0;
        if (condition === 'dmri' && dist < radiusEffect) {
          const pull = Math.cos((dist / radiusEffect) * (Math.PI / 2));
          offsetX = Math.sin(y * 0.065) * distortionFactor * pull;
        }
        if (y === 0) ctx.moveTo(x + offsetX, y);
        else ctx.lineTo(x + offsetX, y);
      }
      ctx.stroke();
    }

    // Draw horizontal lines with mathematical wave distortion for DMRI
    for (let y = step; y < height; y += step) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offsetY = 0;
        if (condition === 'dmri' && dist < radiusEffect) {
          const pull = Math.cos((dist / radiusEffect) * (Math.PI / 2));
          offsetY = Math.cos(x * 0.065) * distortionFactor * pull;
        }
        if (x === 0) ctx.moveTo(x, y + offsetY);
        else ctx.lineTo(x, y + offsetY);
      }
      ctx.stroke();
    }

    // Center fixation point
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Central Scotoma (Macular Degeneration dark/blurred central spot)
    if (condition === 'dmri' && severity > 10) {
      const scotomaRadius = 20 + (severity / 100) * 75;
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        scotomaRadius * 0.15,
        centerX,
        centerY,
        scotomaRadius
      );
      grad.addColorStop(0, `rgba(15, 23, 42, ${Math.min(0.95, (severity / 100) * 1.05)})`);
      grad.addColorStop(0.65, `rgba(30, 41, 59, ${(severity / 100) * 0.65})`);
      grad.addColorStop(1, 'rgba(30, 41, 59, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, scotomaRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cataract yellowing & haze overlay on canvas
    if (condition === 'catarata' && severity > 5) {
      ctx.fillStyle = `rgba(217, 165, 65, ${(severity / 100) * 0.42})`;
      ctx.fillRect(0, 0, width, height);
    }
  }, [scene, condition, severity, highContrastAdaptation]);

  const blurPx = condition === 'catarata' ? ((severity / 100) * 5.8).toFixed(1) : '0';
  const contrastPct = condition === 'catarata' ? Math.round(100 - (severity / 100) * 38) : 100;
  const sepiaPct = condition === 'catarata' ? Math.round((severity / 100) * 55) : 0;

  const getStageLabel = (val: number) => {
    if (condition === 'normal' || val < 15) return 'ACUIDADE PRESERVADA';
    if (val < 45) return 'COMPROMETIMENTO INICIAL';
    if (val < 75) return 'ESTÁGIO MODERADO (INDICAÇÃO CLÍNICA)';
    return 'BAIXA VISÃO SEVERA (RISCO FUNCIONAL)';
  };

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl overflow-hidden shadow-xs">
      {/* Top Simulation Header */}
      <div className="bg-[#0B3B49] text-[#FDFBF7] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#FCD34D] font-mono-tabular uppercase tracking-wider">
            <span>LABORATÓRIO ÓPTICO DE EMPATIA SÊNIOR</span>
            <span aria-hidden="true">·</span>
            <span>EIXOS I & II DA EXTENSÃO</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            Simulador Comparativo: Visão Normal vs. Catarata Senil vs. Degeneração Macular (DMRI)
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            setCondition('catarata');
            setSeverity(65);
            setHighContrastAdaptation(false);
          }}
          className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 border border-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Padrão</span>
        </button>
      </div>

      {/* Two-Zone Sandbox Layout (65% Stage / 35% Control Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT ZONE: Interactive Visual Stage */}
        <div className="lg:col-span-7 p-6 bg-[#F5F1E8] border-b lg:border-b-0 lg:border-r border-[#E2DCCE] flex flex-col justify-between">
          {/* Scene Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-[#E6E0D2] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setScene('receita')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  scene === 'receita'
                    ? 'bg-[#0B3B49] text-white shadow-2xs'
                    : 'text-[#112A34] hover:bg-white/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Leitura de Receituário</span>
              </button>
              <button
                type="button"
                onClick={() => setScene('amsler')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  scene === 'amsler'
                    ? 'bg-[#0B3B49] text-white shadow-2xs'
                    : 'text-[#112A34] hover:bg-white/60'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>2. Tela Clínica de Amsler</span>
              </button>
              <button
                type="button"
                onClick={() => setScene('urbano')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  scene === 'urbano'
                    ? 'bg-[#0B3B49] text-white shadow-2xs'
                    : 'text-[#112A34] hover:bg-white/60'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>3. Placa & Ofuscamento</span>
              </button>
            </div>

            <span className="text-xs font-mono-tabular font-semibold text-[#0B3B49]">
              ESTADO: {getStageLabel(severity)}
            </span>
          </div>

          {/* Optical Viewport Container */}
          <div className="relative w-full min-h-[360px] rounded-xl overflow-hidden border-2 border-[#0B3B49]/20 bg-[#FDFBF7] flex items-center justify-center shadow-inner">
            {/* SCENE 1: PRESCRIPTION & LEAFLET COMPARISON */}
            {scene === 'receita' && (
              <div
                style={{
                  filter:
                    condition === 'catarata'
                      ? `blur(${blurPx}px) contrast(${contrastPct}%) sepia(${sepiaPct}%)`
                      : 'none',
                }}
                className="w-full h-full p-6 flex flex-col justify-between transition-all duration-150"
              >
                {!highContrastAdaptation ? (
                  <div className="space-y-4">
                    <div className="border-b border-stone-300 pb-3 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-stone-400 uppercase tracking-wider">
                          IMPRESSO COMUM (FONTE PEQUENA SEM CONTRASTE ADAPTADO)
                        </span>
                        <h4 className="text-base font-semibold text-stone-700">
                          Receituário de Uso Contínuo — Paciente Idoso
                        </h4>
                      </div>
                      <span className="text-xs font-mono-tabular text-stone-400">
                        Corpo 10pt · Baixo Contraste
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-600 text-xs space-y-1.5 leading-relaxed">
                        <div className="font-bold text-stone-700">
                          1. Colírio Lubrificante Sem Conservantes
                        </div>
                        <p>
                          Instilar 01 (uma) gota no fundo de saco conjuntival de ambos os olhos de
                          6/6 horas. Não encostar a ponta do frasco nos cílios.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-600 text-xs space-y-1.5 leading-relaxed">
                        <div className="font-bold text-stone-700">
                          2. Anti-hipertensivo Oral 50mg
                        </div>
                        <p>
                          Tomar 01 comprimido pela manhã em jejum com copo de água. Atenção para não
                          confundir a cartela branca com o hipoglicemiante.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-stone-600 text-xs">
                      <strong>Por que o idoso erra a medicação?</strong> Com catarata moderada ou
                      DMRI, textos em corpo 9pt–11pt e baixo contraste tornam-se indecifráveis.
                      Ative ao lado o botão <strong>"Folheto em Fonte Ampliada ≥ 24pt"</strong> para
                      ver a diferença.
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0B1922] text-[#FDE047] p-5 rounded-xl border-2 border-[#F59E0B] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#FDE047]/30 pb-2">
                      <span className="text-xs font-mono-tabular font-bold uppercase tracking-widest text-white">
                        FOLHETO ADAPTADO DA CAMPANHA (ALTO CONTRASTE AAA · ≥ 24PT)
                      </span>
                      <span className="text-xs font-mono-tabular font-bold text-[#FDE047]">
                        LEITURA ACESSÍVEL
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-[#FDE047]">
                      MANHÃ (08:00h): 1 GOTA DE LUBRIFICANTE NOS DOIS OLHOS
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                      • NUNCA USE COLÍRIO CASEIRO OU SEM RECEITA MÉDICA.
                      <br />• CIRURGIA DE CATARATA É GRATUITA PELO SUS (PROCURE A UBS).
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCENE 2: INTERACTIVE AMSLER GRID */}
            {scene === 'amsler' && (
              <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                <canvas
                  ref={amslerCanvasRef}
                  width={480}
                  height={310}
                  style={{
                    filter: condition === 'catarata' ? `blur(${blurPx}px)` : 'none',
                  }}
                  className="rounded-lg border border-[#0B3B49]/30 max-w-full h-auto shadow-xs"
                />
                <p className="text-xs text-[#112A34] mt-2.5 text-center max-w-md">
                  Fixe o olhar no ponto âmbar central. Na <strong>DMRI</strong>, as linhas retas
                  sofrem ondulação (<em>metamorfopsia</em>) e surge um escotoma escuro central.
                </p>
              </div>
            )}

            {/* SCENE 3: URBAN CROSSWALK & GLARE */}
            {scene === 'urbano' && (
              <div
                style={{
                  filter:
                    condition === 'catarata'
                      ? `blur(${blurPx}px) contrast(${contrastPct}%) sepia(${sepiaPct}%)`
                      : 'none',
                }}
                className="w-full h-full bg-[#0E2430] text-white p-6 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Simulated oncoming headlight / sun glare halos for Cataract */}
                {condition === 'catarata' && severity > 15 && (
                  <div
                    style={{
                      opacity: Math.min(0.95, (severity / 100) * 1.1),
                      transform: `scale(${1 + (severity / 100) * 0.9})`,
                    }}
                    className="pointer-events-none absolute top-8 right-14 w-44 h-44 rounded-full bg-radial from-[#FEF08A] via-[#F59E0B]/60 to-transparent blur-md"
                  />
                )}

                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-mono-tabular text-[#FCD34D] uppercase tracking-wider">
                    SIMULAÇÃO DE MOBILIDADE URBANA E ACESSO À SAÚDE
                  </span>
                  <Sun className="w-5 h-5 text-[#FCD34D]" />
                </div>

                <div className="my-auto z-10 flex flex-col items-center text-center space-y-4">
                  <div
                    className={`px-6 py-4 rounded-xl border-2 transition-all ${
                      highContrastAdaptation
                        ? 'bg-[#FDE047] text-[#0A1921] border-white text-2xl font-black'
                        : 'bg-[#155E75] text-white border-white/30 text-lg font-bold'
                    }`}
                  >
                    <div>CENTRO DE OFTALMOLOGIA — SUS</div>
                    <div className="text-sm font-mono-tabular mt-1 opacity-90">
                      LINHA 402 · EMBARQUE PORTÃO B · A 150 METROS
                    </div>
                  </div>
                  <p className="text-xs text-[#E2DCCE] max-w-md">
                    Pacientes com catarata sofrem intenso <strong>ofuscamento (glare)</strong> contra
                    luzes e faróis devido à dispersão luminosa no cristalino opacificado.
                  </p>
                </div>
              </div>
            )}

            {/* OVERLAY FOR DMRI IN SCENE 1 & SCENE 3 (Central Scotoma & Metamorfopsia) */}
            {condition === 'dmri' && scene !== 'amsler' && severity > 10 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  style={{
                    width: `${60 + (severity / 100) * 180}px`,
                    height: `${60 + (severity / 100) * 165}px`,
                    background: `radial-gradient(circle, rgba(15,23,42,${Math.min(
                      0.96,
                      (severity / 100) * 1.1
                    )}) 0%, rgba(15,23,42,${(severity / 100) * 0.72}) 55%, rgba(15,23,42,0) 100%)`,
                    filter: 'blur(6px)',
                  }}
                  className="rounded-full transition-all duration-150"
                />
              </div>
            )}

            {/* CATARACT YELLOW FILM OVERLAY IN SCENE 1 & 3 */}
            {condition === 'catarata' && scene !== 'amsler' && severity > 10 && (
              <div
                style={{
                  backgroundColor: `rgba(217, 155, 38, ${(severity / 100) * 0.24})`,
                }}
                className="pointer-events-none absolute inset-0 transition-opacity duration-150"
              />
            )}
          </div>
        </div>

        {/* RIGHT ZONE: Control & Clinical Concept Deck */}
        <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono-tabular font-bold uppercase tracking-wider text-[#0B3B49] mb-2">
                1. SELECIONE A CONDIÇÃO ÓPTICA DO PACIENTE:
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('normal')}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    condition === 'normal'
                      ? 'bg-[#0B3B49] text-white border-[#0B3B49] font-bold'
                      : 'bg-[#FDFBF7] text-[#112A34] border-[#E2DCCE] hover:border-[#0B3B49]'
                  }`}
                >
                  <div>
                    <div className="text-sm">Visão Normal Preservada</div>
                    <div
                      className={`text-xs ${
                        condition === 'normal' ? 'text-[#E2DCCE]' : 'text-[#526670]'
                      }`}
                    >
                      Cristalino transparente e mácula íntegra
                    </div>
                  </div>
                  <Eye className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCondition('catarata');
                    if (severity < 25) setSeverity(65);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    condition === 'catarata'
                      ? 'bg-[#0B3B49] text-white border-[#0B3B49] font-bold'
                      : 'bg-[#FDFBF7] text-[#112A34] border-[#E2DCCE] hover:border-[#0B3B49]'
                  }`}
                >
                  <div>
                    <div className="text-sm">Catarata Senil (Opacificação Global)</div>
                    <div
                      className={`text-xs ${
                        condition === 'catarata' ? 'text-[#FCD34D]' : 'text-[#526670]'
                      }`}
                    >
                      Névoa difusa, amarelamento de cores e ofuscamento
                    </div>
                  </div>
                  <Sliders className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCondition('dmri');
                    if (severity < 25) setSeverity(65);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    condition === 'dmri'
                      ? 'bg-[#0B3B49] text-white border-[#0B3B49] font-bold'
                      : 'bg-[#FDFBF7] text-[#112A34] border-[#E2DCCE] hover:border-[#0B3B49]'
                  }`}
                >
                  <div>
                    <div className="text-sm">Degeneração Macular — DMRI</div>
                    <div
                      className={`text-xs ${
                        condition === 'dmri' ? 'text-[#FCD34D]' : 'text-[#526670]'
                      }`}
                    >
                      Escotoma central escuro e distorção de linhas retas
                    </div>
                  </div>
                  <Grid className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Severity Slider */}
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E2DCCE]">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="severity-slider"
                  className="text-xs font-mono-tabular font-bold uppercase text-[#0B3B49]"
                >
                  2. GRAU DE PROGRESSÃO DA PATOLOGIA:
                </label>
                <span className="text-sm font-mono-tabular font-extrabold text-[#D97706]">
                  {condition === 'normal' ? '0%' : `${severity}%`}
                </span>
              </div>
              <input
                id="severity-slider"
                type="range"
                min={0}
                max={100}
                value={condition === 'normal' ? 0 : severity}
                disabled={condition === 'normal'}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer disabled:opacity-40"
              />
              <div className="flex justify-between text-[11px] font-mono-tabular text-[#526670] mt-1">
                <span>Leve (20%)</span>
                <span>Moderada (60%)</span>
                <span>Severa (95%)</span>
              </div>
            </div>

            {/* High-Contrast Large-Print Toggle */}
            <div className="p-4 rounded-xl bg-[#FEF3C7]/60 border border-[#F59E0B]/50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase text-[#92400E]">
                    3. INTERVENÇÃO EDUCATIVA DA CAMPANHA:
                  </div>
                  <div className="text-sm font-bold text-[#112A34] mt-0.5">
                    Aplicar Fonte Ampliada (≥ 24pt) + Alto Contraste
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHighContrastAdaptation((v) => !v)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    highContrastAdaptation
                      ? 'bg-[#0F4C3A] text-white'
                      : 'bg-[#D97706] text-white hover:bg-[#B45309]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{highContrastAdaptation ? 'Adaptação Ativa' : 'Ativar Adaptação'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clinical Summary Callout */}
          <div className="border-t border-[#E2DCCE] pt-3 text-xs text-[#334E58] leading-relaxed">
            {condition === 'catarata' && (
              <p>
                <strong className="text-[#0B3B49]">Fisiopatologia da Catarata:</strong> Opacificação
                lenta do cristalino que espalha a luz intraocular, reduzindo a sensibilidade ao
                contraste. O tratamento definitivo é cirúrgico (facoemulsificação com implante de
                lente intraocular pelo SUS).
              </p>
            )}
            {condition === 'dmri' && (
              <p>
                <strong className="text-[#0B3B49]">Fisiopatologia da DMRI:</strong> Comprometimento
                fotorreceptor na mácula lútea. Preserva a visão periférica para locomoção, mas exige
                diagnóstico precoce via Mapeamento de Retina e reabilitação com ampliação óptica.
              </p>
            )}
            {condition === 'normal' && (
              <p>
                <strong className="text-[#0B3B49]">Transparência de Meios e Mácula Íntegra:</strong>{' '}
                Foco nítido na fóvea central sem dispersão luminosa ou metamorfopsia.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
