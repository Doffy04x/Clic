// ─── Quiz Data & Types ────────────────────────────────────────────────────────

export interface QuizAnswers {
  usage?: string
  gender?: string
  faceShape?: string
  style?: string[]
  budget?: string
}

export interface QuizStep {
  id: keyof QuizAnswers
  question: string
  subtitle?: string
  multiSelect?: boolean
  options: QuizOption[]
}

export interface QuizOption {
  value: string
  label: string
  sublabel?: string
  emoji?: string
  image?: string
  frameShapes?: string[]   // pour le step faceShape
  priceRange?: [number, number]
}

// ─── Correspondance forme visage → montures recommandées ─────────────────────
export const FACE_TO_FRAMES: Record<string, string[]> = {
  OVAL:      ['WAYFARER', 'AVIATOR', 'SQUARE', 'RECTANGLE', 'ROUND', 'GEOMETRIC'],
  ROUND:     ['SQUARE', 'RECTANGLE', 'WAYFARER', 'BROWLINE', 'GEOMETRIC'],
  SQUARE:    ['ROUND', 'OVAL', 'CAT_EYE', 'AVIATOR', 'RIMLESS'],
  HEART:     ['AVIATOR', 'ROUND', 'OVAL', 'CAT_EYE', 'RIMLESS'],
  RECTANGLE: ['ROUND', 'SQUARE', 'CAT_EYE', 'GEOMETRIC', 'BROWLINE'],
  DIAMOND:   ['OVAL', 'CAT_EYE', 'RIMLESS', 'ROUND'],
}

export const STYLE_TO_TAGS: Record<string, string[]> = {
  classic:  ['classique', 'élégant', 'intemporel', 'luxe'],
  modern:   ['moderne', 'minimaliste', 'épuré', 'contemporain'],
  bold:     ['audacieux', 'original', 'coloré', 'tendance'],
  sporty:   ['sport', 'léger', 'flexible', 'résistant'],
  vintage:  ['vintage', 'rétro', 'années 70', 'années 90'],
}

// ─── Steps du quiz ────────────────────────────────────────────────────────────
export const QUIZ_STEPS: QuizStep[] = [
  {
    id: 'usage',
    question: 'Pour quelle utilisation ?',
    subtitle: 'On vous guidera vers les meilleures options',
    options: [
      {
        value: 'vision',
        label: 'Lunettes de vue',
        sublabel: 'Correction optique, port quotidien',
        emoji: '👓',
      },
      {
        value: 'sun',
        label: 'Lunettes de soleil',
        sublabel: 'Protection UV, style & confort',
        emoji: '☀️',
      },
      {
        value: 'both',
        label: 'Les deux',
        sublabel: 'Je cherche les deux types',
        emoji: '🔄',
      },
      {
        value: 'sport',
        label: 'Sport',
        sublabel: 'Activité physique, résistance',
        emoji: '⚽',
      },
    ],
  },
  {
    id: 'gender',
    question: 'Vous cherchez pour…',
    options: [
      {
        value: 'MEN',
        label: 'Homme',
        emoji: '👨',
      },
      {
        value: 'WOMEN',
        label: 'Femme',
        emoji: '👩',
      },
      {
        value: 'UNISEX',
        label: 'Mixte / Peu importe',
        emoji: '🤝',
      },
      {
        value: 'KIDS',
        label: 'Enfant',
        sublabel: 'Moins de 15 ans',
        emoji: '👦',
      },
    ],
  },
  {
    id: 'faceShape',
    question: 'Votre forme de visage ?',
    subtitle: 'Choisissez celle qui ressemble le plus à la vôtre',
    options: [
      {
        value: 'OVAL',
        label: 'Ovale',
        sublabel: 'Visage équilibré, front légèrement plus large',
        emoji: '🥚',
        frameShapes: ['WAYFARER', 'AVIATOR', 'SQUARE'],
      },
      {
        value: 'ROUND',
        label: 'Rond',
        sublabel: 'Joues pleines, menton arrondi',
        emoji: '⭕',
        frameShapes: ['SQUARE', 'RECTANGLE', 'BROWLINE'],
      },
      {
        value: 'SQUARE',
        label: 'Carré',
        sublabel: 'Mâchoire forte, front large',
        emoji: '⬛',
        frameShapes: ['ROUND', 'OVAL', 'CAT_EYE'],
      },
      {
        value: 'HEART',
        label: 'Cœur',
        sublabel: 'Front large, menton pointu',
        emoji: '🫀',
        frameShapes: ['AVIATOR', 'ROUND', 'CAT_EYE'],
      },
      {
        value: 'RECTANGLE',
        label: 'Rectangle',
        sublabel: 'Visage allongé, joues fines',
        emoji: '📱',
        frameShapes: ['ROUND', 'CAT_EYE', 'GEOMETRIC'],
      },
      {
        value: 'DIAMOND',
        label: 'Diamant',
        sublabel: 'Pommettes larges, front & menton étroits',
        emoji: '💎',
        frameShapes: ['OVAL', 'CAT_EYE', 'RIMLESS'],
      },
    ],
  },
  {
    id: 'style',
    question: 'Quel style vous correspond ?',
    subtitle: 'Vous pouvez choisir plusieurs',
    multiSelect: true,
    options: [
      {
        value: 'classic',
        label: 'Classique & Élégant',
        sublabel: 'Intemporel, sobre, raffiné',
        emoji: '🎩',
      },
      {
        value: 'modern',
        label: 'Moderne & Minimaliste',
        sublabel: 'Épuré, lignes nettes, contemporain',
        emoji: '◼️',
      },
      {
        value: 'bold',
        label: 'Audacieux & Coloré',
        sublabel: 'Original, couleurs, formes marquées',
        emoji: '🎨',
      },
      {
        value: 'sporty',
        label: 'Sportif & Pratique',
        sublabel: 'Léger, flexible, résistant',
        emoji: '🏃',
      },
      {
        value: 'vintage',
        label: 'Vintage & Rétro',
        sublabel: 'Années 70–90, look nostalgique',
        emoji: '📻',
      },
    ],
  },
  {
    id: 'budget',
    question: 'Votre budget ?',
    subtitle: 'Montures + verres inclus',
    options: [
      {
        value: 'low',
        label: 'Moins de 500 DH',
        sublabel: 'Petits prix, bonne qualité',
        emoji: '💚',
        priceRange: [0, 500],
      },
      {
        value: 'mid',
        label: '500 – 1 000 DH',
        sublabel: 'Le meilleur rapport qualité-prix',
        emoji: '💛',
        priceRange: [500, 1000],
      },
      {
        value: 'high',
        label: '1 000 – 2 000 DH',
        sublabel: 'Marques premium, matières nobles',
        emoji: '🧡',
        priceRange: [1000, 2000],
      },
      {
        value: 'luxury',
        label: '2 000 DH et plus',
        sublabel: 'Luxe, créateurs, édition limitée',
        emoji: '🔴',
        priceRange: [2000, 99999],
      },
    ],
  },
]
