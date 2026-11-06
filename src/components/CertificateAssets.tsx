import React from 'react';
import {
  EXTRACTED_LOGO_EDITORA_DATA_URL,
  EXTRACTED_LOGO_CENTRO_DATA_URL,
  EXTRACTED_SIG_BARBARA_DATA_URL,
  EXTRACTED_SIG_JAMES_DATA_URL,
} from '../data/extractedPdfAssets';

export const LogoEditoraMenteSaude: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 58,
}) => (
  <img
    src={EXTRACTED_LOGO_EDITORA_DATA_URL}
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    alt="Logotipo Editora Mente e Saúde"
    className={`shrink-0 object-contain select-none ${className}`}
  />
);

export const LogoCentroMariaDalva: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 58,
}) => (
  <img
    src={EXTRACTED_LOGO_CENTRO_DATA_URL}
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    alt="Logotipo Centro Profissionalizante Maria Dalva de Araújo"
    className={`shrink-0 object-contain select-none ${className}`}
  />
);

export const AssinaturaBarbaraLima: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className = '', width = 166, height = 38 }) => (
  <img
    src={EXTRACTED_SIG_BARBARA_DATA_URL}
    width={width}
    height={height}
    style={{ width: `${width}px`, height: `${height}px` }}
    alt="Assinatura Bárbara Lima dos Santos"
    className={`mx-auto object-contain select-none block ${className}`}
  />
);

export const AssinaturaJamesAraujo: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className = '', width = 162, height = 39 }) => (
  <img
    src={EXTRACTED_SIG_JAMES_DATA_URL}
    width={width}
    height={height}
    style={{ width: `${width}px`, height: `${height}px` }}
    alt="Assinatura James Araújo de Santana"
    className={`mx-auto object-contain select-none block ${className}`}
  />
);

export const SeloOficialFePublica: React.FC<{ codigo: string; className?: string }> = ({
  codigo,
  className = '',
}) => (
  <div
    style={{ width: '96px', height: '96px' }}
    className={`relative rounded-full flex items-center justify-center text-center select-none shrink-0 ${className}`}
  >
    <svg
      width={96}
      height={96}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
    >
      <circle cx="50" cy="50" r="47" fill="#FCF8EC" stroke="#C59B27" strokeWidth="2" />
      <circle
        cx="50"
        cy="50"
        r="41.5"
        fill="none"
        stroke="#C59B27"
        strokeWidth="1.2"
        strokeDasharray="3.2 2.4"
      />
    </svg>
    <div className="relative z-10 flex flex-col items-center justify-center px-2 leading-none">
      <span className="text-[7px] tracking-[2px] text-[#B38728] font-bold mb-1">★ ★ ★</span>
      <span className="text-[7.5px] font-extrabold tracking-[0.06em] text-[#0F4C3A] uppercase leading-[1.2]">
        SELO OFICIAL
      </span>
      <span className="text-[7.5px] font-extrabold tracking-[0.06em] text-[#0F4C3A] uppercase leading-[1.2]">
        FÉ PÚBLICA
      </span>
      <span className="text-[6px] font-mono-tabular font-semibold text-[#9A7117] mt-1 tracking-tight">
        {codigo}
      </span>
      <span className="text-[7px] tracking-[2px] text-[#B38728] font-bold mt-1">★ ★ ★</span>
    </div>
  </div>
);
