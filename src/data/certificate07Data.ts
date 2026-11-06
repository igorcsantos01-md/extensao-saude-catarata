export interface CertificateEixo {
  id: string;
  eixoTitulo: string;
  subtitulo: string;
  descricao: string;
  cargaHoraria: string;
}

export interface AudioGuideItem {
  id: string;
  numero: string;
  titulo: string;
  subtitulo: string;
  duracao: string;
  publicoAlvo: string;
  transcricaoCompleta: string;
  pontosChave: string[];
  frequenciaBaseHz: number;
}

export interface LargePrintLeafletPage {
  id: string;
  paginaNumero: number;
  categoria: string;
  tituloPrincipal: string;
  subtituloAcessivel: string;
  blocos: {
    cabecalho: string;
    textoCurto: string;
    alertaOuDestaque: string;
  }[];
  rodapeSus: string;
}

export const CERTIFICATE_07_DATA = {
  numero: '07',
  livro: '01/2025',
  folha: '14',
  codigoAutenticidade: 'EMS-EXT-2025-0714',
  chaveControle: '0714-8829-4102-9C4A',
  hashSha256: '9c4a714e8b20f319d5a46e82c1047b93e2f5180d6c74a291b8e305f12c9a0714',
  titular: {
    nome: 'LUCAS GONÇALVES SILVEIRA',
    qualificacao: 'Médico',
    cpf: '702.794.941-57',
    instituicaoOrigem: 'Centro Universitário de Anápolis (UNIFAN)',
  },
  emissoras: {
    editora: {
      nome: 'Editora Mente e Saúde',
      cnpj: '51.372.335/0001-71',
      departamento: 'Conselho Editorial e Extensão Científica',
      signataria: 'BÁRBARA LIMA DOS SANTOS',
      cargo: 'Editora-Chefe e Coordenadora de Extensão Editorial',
    },
    centro: {
      nome: 'Centro Profissionalizante Maria Dalva de Araújo',
      nomeCurtoVerso: 'Centro Maria Dalva de Araújo',
      cnpj: '51.269.112/0001-83',
      signatario: 'JAMES ARAÚJO DE SANTANA',
      cargo: 'Coordenador de Extensão e Projetos Educativos',
    },
  },
  tituloAtividade:
    'Atividade Comunitária de Inclusão Visual do Idoso: Distribuição de Folhetos em Fonte Ampliada e Áudio-Guias sobre Catarata e Degeneração Macular',
  modalidadeEdital: 'Atividade Comunitária e Campanha Educativa',
  enquadramentoCurricularCompleto:
    'Item 08 – Atividades de Extensão: Campanhas educativas, de vacinação, coleta de dados populacionais e atividades comunitárias',
  periodoRealizacao: '18 a 21 de fevereiro de 2025',
  dataEmissaoExtenso: 'Goiânia - GO, 28 de fevereiro de 2025.',
  cargaHorariaNumero: '14',
  cargaHorariaExtenso: '14 (quatorze) horas',
  cargaHorariaCurta: '14h',
  eixosMetodologicos: [
    {
      id: 'eixo-1',
      eixoTitulo: 'Eixo I — Diagnóstico Comunitário e Coleta de Dados Populacionais sobre Baixa Visão Senil',
      subtitulo: 'Levantamento de Barreiras de Leitura e Letramento em Saúde Ocular na Terceira Idade',
      descricao:
        'Aplicação de enquete estruturada aberta a idosos, familiares e cuidadores (coleta de dados populacionais) para mapear dificuldades práticas na leitura de rótulos de medicamentos, embaçamento progressivo, sensibilidade ao ofuscamento e percepção de linhas tortas.',
      cargaHoraria: '03h 30min',
    },
    {
      id: 'eixo-2',
      eixoTitulo: 'Eixo II — Produção Editorial de Folhetos em Fonte Ampliada e Alto Contraste',
      subtitulo: 'Editoração Acessível para Baixa Visão (Corpo Tipográfico ≥ 24pt, Espaçamento Ampliado e Grade de Amsler)',
      descricao:
        'Revisão da literatura oftalmológica e diagramação de folhetos impressos e digitais em letras gigantes de alto contraste (polaridade Creme/Petróleo e Amarelo/Preto), detalhando sinais da Catarata Senil e da Degeneração Macular Relacionada à Idade (DMRI).',
      cargaHoraria: '04h 00min',
    },
    {
      id: 'eixo-3',
      eixoTitulo: 'Eixo III — Roteirização de Áudio-Guias para WhatsApp e Combate a Fake News',
      subtitulo: 'Acessibilidade Sonora Inclusiva e Alerta contra "Colírios Milagrosos" para Catarata',
      descricao:
        'Produção de série de 4 pílulas de áudio educativas compartilháveis via WhatsApp com locução pausada e clara, desmistificando promessas fraudulentas de dissolução de catarata com colírios caseiros e orientando sobre a prevenção da cegueira evitável.',
      cargaHoraria: '03h 30min',
    },
    {
      id: 'eixo-4',
      eixoTitulo: 'Eixo IV — Ação Comunitária Presencial/Digital e Divulgação dos Canais do SUS',
      subtitulo: 'Entrega Comunitária Gratuita e Orientação sobre o Fluxo de Cirurgia de Catarata na Rede Pública',
      descricao:
        'Distribuição gratuita dos folhetos ampliados e áudio-guias à comunidade idosa e orientação sobre quando procurar assistência oftalmológica via Unidade Básica de Saúde (UBS) para encaminhamento cirúrgico e acompanhamento retiniano pelo SUS.',
      cargaHoraria: '03h 00min',
    },
  ] as CertificateEixo[],
};

export const AUDIO_GUIDES_LIST: AudioGuideItem[] = [
  {
    id: 'audio-01',
    numero: 'Pílula Sonora 01',
    titulo: 'Vista Embaçada como Fumaça? Entenda a Catarata depois dos 60 Anos',
    subtitulo: 'Explicação acessível sobre o envelhecimento natural do cristalino e quando operar',
    duracao: '01:45',
    publicoAlvo: 'Idosos, aposentados e cuidadores familiares (WhatsApp)',
    frequenciaBaseHz: 432,
    transcricaoCompleta:
      'Olá! Esta é uma mensagem de saúde visual do projeto de extensão da Editora Mente e Saúde. Se você tem mais de 60 anos e sente que a visão está ficando embaçada, como se olhasse através de um vidro embaçado ou de uma névoa constante, atenção: isso não é apenas cansaço da idade. Pode ser Catarata. Dentro do nosso olho existe uma lente natural chamada cristalino. Com o passar dos anos, essa lente vai perdendo a transparência. A boa notícia é que a cegueira por catarata é totalmente reversível! O tratamento é uma cirurgia rápida e segura, em que a lente opaca é substituída por uma lente transparente nova. Procure a Unidade Básica de Saúde mais próxima e peça encaminhamento para avaliação oftalmológica pelo SUS.',
    pontosChave: [
      'Visão enevoada, cores desbotadas e troca frequente de óculos sem melhora',
      'Ofuscamento intenso com faróis de carros à noite ou luz solar forte',
      'Cirurgia definitiva disponível gratuitamente pela rede pública (SUS)',
    ],
  },
  {
    id: 'audio-02',
    numero: 'Pílula Sonora 02',
    titulo: 'Linha Torta ou Mancha no Centro da Visão? Conheça a Degeneração Macular (DMRI)',
    subtitulo: 'Como diferenciar a dificuldade de leitura central da catarata comum',
    duracao: '02:05',
    publicoAlvo: 'Pacientes idosos com queixa de leitura e distorção central',
    frequenciaBaseHz: 480,
    transcricaoCompleta:
      'Atenção para este sinal importante nos seus olhos: quando você olha para o azulejo da parede ou para o batente da porta, as linhas retas parecem onduladas ou tortas? Ou quando você tenta ler uma palavra ou olhar para o rosto de alguém, parece existir uma mancha escura bem no meio da visão, enquanto a visão dos lados continua normal? Esses são sinais clássicos da Degeneração Macular Relacionada à Idade, conhecida como DMRI. Ela afeta a mácula, a região nobre no centro da retina responsável pelos detalhes finos. Ao notar qualquer ondulação nas linhas ou mancha fixa no centro da leitura, busque avaliação oftalmológica com exame de fundo de olho imediatamente.',
    pontosChave: [
      'Metamorfopsia: linhas retas de portas, janelas e grades parecem onduladas',
      'Escotoma central: mancha borrada ou escura exatamente onde se fixa o olhar',
      'Importância do autoexame mensal na Tela de Amsler (um olho de cada vez)',
    ],
  },
  {
    id: 'audio-03',
    numero: 'Pílula Sonora 03',
    titulo: 'Alerta de Segurança: Nenhum Colírio ou Chá Caseiro "Derrete" a Catarata!',
    subtitulo: 'Combate a fake news nas redes sociais e prevenção de lesões oculares graves',
    duracao: '01:50',
    publicoAlvo: 'Grupos comunitários da terceira idade e famílias',
    frequenciaBaseHz: 528,
    transcricaoCompleta:
      'Muito cuidado com anúncios enganosos na internet e correntes de WhatsApp que prometem gotas milagrosas, colírios importados sem registro ou chás caseiros capazes de dissolver a catarata sem cirurgia. Na medicina baseada em evidências, não existe nenhum colírio capaz de reverter a catarata já formada. Pingar substâncias caseiras, mel, limão ou produtos sem registro na ANVISA pode causar queimaduras químicas na córnea, infecções graves e perda irreversível da visão. Proteja seus olhos: nunca use colírios sem receita médica e confie apenas na avaliação do médico oftalmologista.',
    pontosChave: [
      'Não existe colírio, vitamina em gotas ou receita caseira que cure catarata',
      'Risco real de úlcera de córnea e infecção ocular severa por produtos clandestinos',
      'Qualquer tratamento seguro exige prescrição oftalmológica individualizada',
    ],
  },
  {
    id: 'audio-04',
    numero: 'Pílula Sonora 04',
    titulo: 'Dicas Práticas em Casa: Iluminação, Alto Contraste e Como Conseguir Consulta no SUS',
    subtitulo: 'Adaptações domésticas para baixa visão e passo a passo na rede pública',
    duracao: '02:10',
    publicoAlvo: 'Idosos com baixa visão e seus cuidadores',
    frequenciaBaseHz: 396,
    transcricaoCompleta:
      'Enquanto você realiza seu acompanhamento oftalmológico, pequenas mudanças em casa aumentam muito a sua autonomia e evitam quedas. Primeiro: posicione a luminária de leitura direcionada para o papel, nunca apontada diretamente para os seus olhos, evitando o reflexo. Segundo: identifique caixas de remédios com etiquetas grandes de fundo amarelo ou creme e letras pretas grossas. Terceiro: para agendar sua avaliação de catarata ou retina pelo SUS, leve seu Cartão Nacional de Saúde e documento com foto até a Unidade Básica de Saúde do seu bairro. O médico da família fará o encaminhamento via regulação para o centro especializado de oftalmologia.',
    pontosChave: [
      'Uso de contraste máximo (preto no amarelo/creme) para identificar medicamentos',
      'Iluminação focal sem ofuscamento direto e marcação de degraus em casa',
      'Porta de entrada oficial: UBS / Posto de Saúde com Cartão SUS atualizado',
    ],
  },
];

export const LARGE_PRINT_LEAFLETS: LargePrintLeafletPage[] = [
  {
    id: 'folheto-1',
    paginaNumero: 1,
    categoria: 'FOLHETO EM FONTE AMPLIADA — PÁGINA 01 / 03',
    tituloPrincipal: 'CATARATA TEM CURA: SAIBA QUANDO PROCURAR O MÉDICO',
    subtituloAcessivel: 'Material elaborado com letras ampliadas e alto contraste para leitura confortável sem esforço visual.',
    blocos: [
      {
        cabecalho: '1. O QUE ACONTECE NO OLHO COM CATARATA?',
        textoCurto:
          'A lente natural do olho (cristalino) fica opaca aos poucos. A visão perde o brilho, as cores ficam amareladas e ler letras pequenas torna-se difícil mesmo com óculos novos.',
        alertaOuDestaque: 'SINAL CLÁSSICO: Sensação de "fumaça" ou "vidro embaçado" que não limpa ao piscar.',
      },
      {
        cabecalho: '2. QUANDO É HORA DE OPERAR?',
        textoCurto:
          'Você não precisa esperar ficar sem enxergar nada! Assim que a catarata começa a atrapalhar tarefas simples — como ler bula de remédio, costurar, assistir TV ou caminhar com segurança — a cirurgia já está indicada.',
        alertaOuDestaque: 'ATENÇÃO: Nenhum colírio dissolve catarata. O único tratamento eficaz é a cirurgia com implante de lente intraocular.',
      },
    ],
    rodapeSus: 'SERVIÇO GRATUITO NO SUS: Procure a Unidade Básica de Saúde (Posto de Saúde) com seu Cartão SUS.',
  },
  {
    id: 'folheto-2',
    paginaNumero: 2,
    categoria: 'FOLHETO EM FONTE AMPLIADA — PÁGINA 02 / 03',
    tituloPrincipal: 'DEGENERAÇÃO MACULAR (DMRI): PROTEJA O CENTRO DA SUA VISÃO',
    subtituloAcessivel: 'Identifique precocemente os sinais de alerta na retina após os 60 anos de idade.',
    blocos: [
      {
        cabecalho: '1. POR QUE A DMRI É DIFERENTE DA CATARATA?',
        textoCurto:
          'Enquanto a catarata embaça a visão por igual, a Degeneração Macular atinge o centro da retina (a mácula). Você enxerga os objetos ao redor, mas o ponto central fica borrado, escuro ou distorcido.',
        alertaOuDestaque: 'SINAL DE ALERTA MÁXIMO: Linhas retas de azulejos, portas ou letras parecem tortas ou onduladas.',
      },
      {
        cabecalho: '2. COMO PROTEGER SUA RETINA NO DIA A DIA?',
        textoCurto:
          'Não fume (o tabagismo dobra o risco de DMRI), mantenha a pressão arterial controlada, use óculos com proteção ultravioleta no sol e tenha alimentação rica em folhas verdes escuras (couve, espinafre) e peixes.',
        alertaOuDestaque: 'DIAGNÓSTICO PRECOCE: O exame de Fundo de Olho (Mapeamento de Retina) detecta a doença antes da perda severa.',
      },
    ],
    rodapeSus: 'EM CASO DE MANCHA SÚBITA OU LINHAS TORTAS: Procure avaliação oftalmológica prioritária na rede pública.',
  },
  {
    id: 'folheto-3',
    paginaNumero: 3,
    categoria: 'FOLHETO EM FONTE AMPLIADA — PÁGINA 03 / 03',
    tituloPrincipal: 'GUIA DE ACESSIBILIDADE VISUAL E PASSO A PASSO NO SUS',
    subtituloAcessivel: 'Como organizar sua casa e seus medicamentos com segurança visual.',
    blocos: [
      {
        cabecalho: '1. ETIQUETAS GIGANTES NOS MEDICAMENTOS',
        textoCurto:
          'Nunca tome remédios no escuro ou tentando adivinhar o frasco pela cor da tampa. Peça a um familiar para colar etiquetas grandes escritas com caneta grossa preta: "MANHÃ (SOL)", "TARDE" e "NOITE (LUA)".',
        alertaOuDestaque: 'SEGURANÇA OCULAR: Guarde colírios longe de frascos de cola, esmalte ou remédios de pingar no ouvido.',
      },
      {
        cabecalho: '2. FLUXO OFICIAL PARA CONSULTA E CIRURGIA PELO SUS',
        textoCurto:
          'Passo 1: Vá à UBS do seu bairro com RG, CPF, comprovante de endereço e Cartão SUS. Passo 2: Passe pela consulta clínica para inserção no Sistema de Regulação (SISREG). Passo 3: Realize os exames pré-operatórios gratuitos no centro oftalmológico credenciado.',
        alertaOuDestaque: 'CANAIS OFICIAIS: Disque Saúde 136 | Aplicativo Meu SUS Digital | Ouvidoria Municipal de Saúde.',
      },
    ],
    rodapeSus: 'CAMPANHA EDUCATIVA: Editora Mente e Saúde & Centro Profissionalizante Maria Dalva de Araújo.',
  },
];

export const SURVEY_POPULATION_METRICS = {
  totalParticipantes: 318,
  periodoColeta: '18 a 21 de fevereiro de 2025',
  faixaEtariaPredominante: '62 a 84 anos (e cuidadores familiares)',
  indicadores: [
    {
      percentual: '74,2%',
      rotulo: 'Dificuldade para Ler Bulas e Receitas',
      detalhe: 'Relataram não conseguir ler impressos comuns (fonte < 10pt) mesmo utilizando óculos para perto.',
    },
    {
      percentual: '41,5%',
      rotulo: 'Crença em "Colírios que Curam Catarata"',
      detalhe: 'Já haviam recebido propagandas ou boatos em redes sociais sobre gotas que dissolvem catarata sem cirurgia.',
    },
    {
      percentual: '81,8%',
      rotulo: 'Desconhecimento sobre a Degeneração Macular',
      detalhe: 'Nunca tinham ouvido falar em DMRI ou no teste da Grade de Amsler para monitorar distorções centrais.',
    },
    {
      percentual: '96,5%',
      rotulo: 'Aprovação dos Folhetos ≥ 24pt + Áudio-Guias',
      detalhe: 'Conseguiram ler sem auxílio externo os folhetos em fonte ampliada ou compreenderam 100% via áudio no WhatsApp.',
    },
  ],
};

export const GITHUB_MASTER_PROMPT = `# COMANDO OPERACIONAL COMPLETO PARA REPOSITÓRIO GITHUB — PLATAFORMA E CERTIFICADO Nº 07

## 1. OBJETIVO DO SISTEMA E ARQUITETURA
Construa uma aplicação web completa, interativa e responsiva (React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + jsPDF + html-to-image + qrcode.react) que funcione simultaneamente como:
1. **Portal Educativo e Memorial Técnico da Atividade de Extensão Nº 07**: *"Atividade Comunitária de Inclusão Visual do Idoso: Distribuição de Folhetos em Fonte Ampliada e Áudio-Guias sobre Catarata e Degeneração Macular"*.
2. **Visualizador e Gerador Oficial em PDF (A4 Paisagem — Frente e Verso)** do **Certificado Nº 07** com fidelidade documental absoluta às instituições emissoras.
3. **Sistema Público de Verificação de Autenticidade (Validador QR Code e Chave Manual)** que lê automaticamente o parâmetro \`?codigo=EMS-EXT-2025-0714\` na URL e exibe o laudo criptográfico SHA-256.

---

## 2. DIREÇÃO CRIATIVA E PALETA DE CORES (ACESSIBILIDADE SÊNIOR WCAG AAA)
- **Canvas Principal (60%)**: Creme Alto Contraste (\`#FDFBF7\`) e Marfim Acetinado (\`#F5F1E8\`) para leitura confortável sem ofuscamento luminoso.
- **Superfícies Estruturais e Tipografia (30%)**: Azul Petróleo Profundo (\`#0B3B49\`) e Ardósia Escura (\`#112A34\`).
- **Acento Focal de Alto Contraste (10%)**: Âmbar Solar (\`#D97706\` / \`#F59E0B\`) para botões principais, controles do simulador óptico e player de áudio.
- **Identidade Exclusiva do Certificado A4**: O documento oficial do Certificado Nº 07 mantém o padrão estrito da coleção institucional: fundo papel pergaminho acadêmico (\`#FAF9F6\`), moldura dupla em Verde Institucional (\`#0F4C3A\`) e Azul Marinho (\`#1B365D\`), e selo dourado de Fé Pública.

---

## 3. DADOS OFICIAIS DO CERTIFICADO Nº 07 (FRENTE E VERSO)
- **Certificado Nº**: \`07\` | **Livro de Extensão nº**: \`01/2025\` | **Folha**: \`14\`
- **Código de Verificação**: \`EMS-EXT-2025-0714\`
- **Chave de Controle / Dígito**: \`0714-8829-4102-9C4A\`
- **Hash SHA-256**: \`9c4a714e8b20f319d5a46e82c1047b93e2f5180d6c74a291b8e305f12c9a0714\`
- **Profissional Certificado**: \`LUCAS GONÇALVES SILVEIRA\`
- **Qualificação**: \`Médico | CPF: 702.794.941-57 | Centro Universitário de Anápolis (UNIFAN)\`
- **Instituição Emissora 1 (Esquerda)**: \`Editora Mente e Saúde\` | \`CNPJ: 51.372.335/0001-71\` | \`Conselho Editorial e Extensão Científica\`
  - Signatária: \`BÁRBARA LIMA DOS SANTOS\` — *Editora-Chefe e Coordenadora de Extensão Editorial* (Assinatura em caneta azul sobre fundo 100% transparente).
- **Instituição Emissora 2 (Direita)**: \`Centro Profissionalizante Maria Dalva de Araújo\` | \`CNPJ: 51.269.112/0001-83\`
  - Signatário: \`JAMES ARAÚJO DE SANTANA\` — *Coordenador de Extensão e Projetos Educativos* (Rubrica preta limpa sobre fundo 100% transparente, sem números de telefone na logo).
- **Título Oficial (Modelo 07)**: *"Atividade Comunitária de Inclusão Visual do Idoso: Distribuição de Folhetos em Fonte Ampliada e Áudio-Guias sobre Catarata e Degeneração Macular"*
- **Enquadramento no Edital (Item 08 — FUBOG)**: *Atividade Comunitária e Campanha Educativa* (com coleta de dados populacionais e combate a fake news).
- **Período de Realização**: \`18 a 21 de fevereiro de 2025\` | **Carga Horária**: \`14 (quatorze) horas\`
- **Local e Data de Emissão**: \`Goiânia - GO, 28 de fevereiro de 2025.\`

---

## 4. TEXTO INTEGRAL DA PÁGINA 1 (FRENTE DO CERTIFICADO)
> A **Editora Mente e Saúde** (CNPJ: 51.372.335/0001-71), em parceria institucional com o **Centro Profissionalizante Maria Dalva de Araújo** (CNPJ: 51.269.112/0001-83), certifica para os devidos fins de comprovação curricular e acadêmica que
>
> **LUCAS GONÇALVES SILVEIRA**
> **Médico | CPF: 702.794.941-57 | Centro Universitário de Anápolis (UNIFAN)**
>
> participou de forma efetiva da **Atividade de Extensão** intitulada **“Atividade Comunitária de Inclusão Visual do Idoso: Distribuição de Folhetos em Fonte Ampliada e Áudio-Guias sobre Catarata e Degeneração Macular”**, desenvolvida na modalidade de **Atividade Comunitária e Campanha Educativa**, realizada no período de **18 a 21 de fevereiro de 2025**, contabilizando carga horária total de **14 (quatorze) horas**.
>
> No âmbito desta ação extensionista, o profissional atuou na produção editorial acessível e entrega comunitária gratuita de **materiais educativos (folhetos em fonte ampliada de alto contraste e mini e-book para familiares)**, elaboração e difusão de pílulas sonoras e áudio-guias pelo WhatsApp para **combate à desinformação (fake news)** sobre colírios milagrosos, aplicação de enquete estruturada para **coleta de dados populacionais** sobre barreiras de leitura na terceira idade e **divulgação dos canais oficiais de assistência oftalmológica e cirurgia de catarata pelo SUS**.

---

## 5. MATRIZ METODOLÓGICA DA PÁGINA 2 (VERSO — 14 HORAS)
- **Eixo I (03h 30min)**: Diagnóstico Comunitário e Coleta de Dados Populacionais sobre Baixa Visão Senil.
- **Eixo II (04h 00min)**: Produção Editorial de Folhetos em Fonte Ampliada (≥ 24pt) e Alto Contraste sobre Catarata e DMRI.
- **Eixo III (03h 30min)**: Roteirização de Áudio-Guias para WhatsApp e Combate a Fake News sobre Colírios Caseiros/Milagrosos.
- **Eixo IV (03h 00min)**: Ação Comunitária Presencial/Digital e Divulgação do Fluxo Cirúrgico Oftalmológico do SUS.

---

## 6. MÓDULOS INTERATIVOS OBRIGATÓRIOS NA PLATAFORMA
1. **Simulador Visual Interativo (Visão Normal vs. Catarata Senil vs. Degeneração Macular - DMRI)**:
   - Permite alternar entre as 3 condições ópticas, ajustar a severidade clínica (0% a 100%) e testar diferentes cenas cotidianas do idoso (Rótulo de Medicamento, Placa de Rua/Travessia e Grade Clínica de Amsler).
2. **Player de Áudio-Guias (WhatsApp) + Visualizador de Folhetos em Fonte Ampliada**:
   - Reprodução sonora real (via Web Speech Synthesis API + Web Audio feedback) das 4 pílulas educativas com transcrição sincronizada.
   - Leitor interativo dos folhetos com controle real de escala tipográfica (\`18pt\`, \`24pt\`, \`30pt\`) e chaveador de contraste (\`Creme/Petróleo\`, \`Amarelo/Preto AAA\`, \`Branco/Marinho\`).
3. **Certificado Nº 07 Incorporado (Estilo PDF Nativo) + Download Direto em PDF**:
   - Exibição das Laudas 1 e 2 lado a lado ou empilhadas em proporção A4 exata (1123px × 794px), com exportação instantânea em PDF de alta resolução (2 páginas paisagem).`;
