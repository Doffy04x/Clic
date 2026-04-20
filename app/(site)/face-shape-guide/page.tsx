import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guide des formes de visage — Trouvez vos montures parfaites',
  description: 'Découvrez quelles montures correspondent à votre forme de visage. Notre guide expert vous aide à trouver les styles les plus flatteurs pour les visages ovale, rond, carré, cœur, losange et oblong.',
};

const FACE_SHAPES = [
  {
    id: 'oval',
    name: 'Ovale',
    emoji: '🥚',
    description: 'Le visage ovale est considéré comme la forme la plus polyvalente — légèrement plus large au niveau des pommettes, s\'affinant doucement au niveau du front et de la mâchoire. Presque tous les styles de montures flattent un visage ovale.',
    characteristics: ['Front légèrement plus large que le menton', 'Proportions équilibrées', 'Mâchoire doucement arrondie', 'Pommettes au point le plus large'],
    bestFrames: ['Wayfarer', 'Aviateur', 'Carré', 'Rectangle', 'Rond', 'Oversize'],
    avoidFrames: ['Rien n\'est interdit'],
    tips: 'Vous avez de la chance — presque toutes les formes fonctionnent. Pour ajouter de la définition, essayez des montures géométriques. Pour un look plus doux, optez pour le rond.',
    color: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
    celebrities: ['Beyoncé', 'George Clooney', 'Jessica Alba'],
    image: 'https://images.unsplash.com/photo-1529946825340-30f021e56da3?w=400',
  },
  {
    id: 'round',
    name: 'Rond',
    emoji: '⭕',
    description: 'Les visages ronds ont des lignes douces et courbes avec une largeur et une longueur similaires, et des joues pleines. Les montures angulaires ajoutent de la définition et rendent le visage plus allongé et affiné.',
    characteristics: ['Largeur et longueur à peu près égales', 'Joues pleines', 'Menton arrondi', 'Traits doux et courbés'],
    bestFrames: ['Carré', 'Rectangle', 'Browline', 'Wayfarer', 'Géométrique angulaire'],
    avoidFrames: ['Montures rondes', 'Petites montures ovales', 'Formes trop courbées'],
    tips: 'Choisissez des montures plus larges que vos pommettes. Les styles angulaires ou rectangulaires créent un contraste avec les courbes naturelles du visage.',
    color: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
    celebrities: ['Chrissy Teigen', 'Selena Gomez', 'Leonardo DiCaprio'],
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
  },
  {
    id: 'square',
    name: 'Carré',
    emoji: '⬜',
    description: 'Les visages carrés ont une mâchoire forte et angulaire et un front large avec des proportions équilibrées. Les montures arrondies ou courbées adoucissent les angles forts et apportent de l\'harmonie au visage.',
    characteristics: ['Mâchoire large et angulaire', 'Front large', 'Peu de courbes entre les traits', 'Largeur et longueur similaires'],
    bestFrames: ['Rond', 'Ovale', 'Papillon', 'Aviateur', 'Circulaire'],
    avoidFrames: ['Montures carrées', 'Montures rectangulaires', 'Géométrique angulaire'],
    tips: 'Recherchez des montures avec des courbes pour adoucir votre mâchoire forte. Les styles sans cercle ou semi-sans cercle fonctionnent particulièrement bien.',
    color: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'M4 4h16v16H4z',
    celebrities: ['Brad Pitt', 'Olivia Wilde', 'Angelina Jolie'],
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400',
  },
  {
    id: 'heart',
    name: 'Cœur',
    emoji: '❤️',
    description: 'Les visages en cœur ont un front et des pommettes plus larges qui s\'affinent vers un menton étroit et pointu. Les montures qui équilibrent la partie supérieure et inférieure du visage fonctionnent le mieux.',
    characteristics: ['Front et pommettes plus larges', 'Menton étroit et pointu', 'Pommettes hautes et proéminentes', 'Pointe de cheveux fréquente'],
    bestFrames: ['Aviateur', 'Rond', 'Ovale', 'Browline', 'Montures claires'],
    avoidFrames: ['Montures lourdes en haut', 'Montures papillon', 'Décorations oversize en haut'],
    tips: 'Choisissez des montures plus larges en bas pour équilibrer votre mâchoire. Les montures sans cercle, aux couleurs claires ou avec accent en bas sont idéales.',
    color: 'bg-pink-50',
    border: 'border-pink-200',
    icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    celebrities: ['Reese Witherspoon', 'Ryan Gosling', 'Scarlett Johansson'],
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400',
  },
  {
    id: 'diamond',
    name: 'Losange',
    emoji: '💎',
    description: 'Les visages losange sont étroits au front et à la mâchoire, avec des pommettes larges et dramatiques. Les montures qui mettent en valeur les yeux et adoucissent les pommettes sont les plus flatteuses.',
    characteristics: ['Front et mâchoire étroits', 'Pommettes larges et hautes', 'Apparence générale angulaire', 'Menton pointu'],
    bestFrames: ['Papillon', 'Ovale', 'Browline', 'Sans cercle', 'Rimless'],
    avoidFrames: ['Montures étroites', 'Très petites montures', 'Montures géométriques'],
    tips: 'Optez pour des montures qui accentuent les yeux en largeur et en détails. Les montures papillon qui attirent l\'attention vers le haut sont particulièrement flatteuses.',
    color: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'M12 2L2 9l10 13 10-13z',
    celebrities: ['Johnny Depp', 'Megan Fox', 'Vanessa Hudgens'],
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400',
  },
  {
    id: 'oblong',
    name: 'Oblong',
    emoji: '📏',
    description: 'Les visages oblongs (ou rectangulaires) sont plus longs que larges, avec une longue ligne de joue droite. Les montures larges avec de la hauteur ajoutent de la largeur et allègent la longueur.',
    characteristics: ['Visage plus long que large', 'Front, joues et mâchoire de largeur similaire', 'Ligne de joue droite', 'Nez long fréquent'],
    bestFrames: ['Rond', 'Carré', 'Oversize', 'Aviateur', 'Branches décoratives'],
    avoidFrames: ['Montures étroites', 'Petites montures', 'Montures rectangulaires'],
    tips: 'Choisissez des montures larges avec plus de hauteur pour ajouter de la largeur au visage. Les branches décoratives ou proéminentes aident aussi à briser la longueur.',
    color: 'bg-green-50',
    border: 'border-green-200',
    icon: 'M4 6h16v12H4z',
    celebrities: ['Ben Affleck', 'Liv Tyler', 'Adam Driver'],
    image: 'https://images.unsplash.com/photo-1483401757487-2ced3fa77952?w=400',
  },
];

export default function FaceShapeGuidePage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-black">Guide des formes de visage</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500 mb-4">Guide expert</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-black mb-5">
            Trouvez vos montures parfaites
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Les bonnes lunettes peuvent transformer votre look. Utilisez ce guide pour identifier votre forme de visage
            et découvrir quelles montures mettront le mieux en valeur vos traits naturels.
          </p>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-6" />
        </div>

        {/* How to determine face shape */}
        <div className="bg-cream p-8 md:p-12 mb-16">
          <h2 className="font-display font-bold text-2xl text-black mb-6">Comment déterminer votre forme de visage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Attachez vos cheveux',
                desc: 'Attachez vos cheveux en arrière pour que le contour complet de votre visage soit visible. Placez-vous dans une bonne lumière devant un miroir.',
              },
              {
                step: '02',
                title: 'Tracez le contour',
                desc: 'À l\'aide d\'un savon ou d\'un rouge à lèvres, tracez le contour de votre visage sur le miroir. Reculez et observez la forme.',
              },
              {
                step: '03',
                title: 'Mesurez les points clés',
                desc: 'Notez la largeur de votre front, de vos pommettes et de votre mâchoire. Comparez avec nos descriptions de formes de visage ci-dessous.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="font-display font-bold text-3xl text-gold-500 flex-shrink-0 w-12">{item.step}</span>
                <div>
                  <h3 className="font-display font-semibold text-base text-black mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Face shapes */}
        <div className="space-y-12">
          {FACE_SHAPES.map((shape) => (
            <div key={shape.id} id={shape.id} className={`rounded-none border ${shape.border} overflow-hidden`}>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Image */}
                <div className="relative h-64 lg:h-auto overflow-hidden bg-gray-100">
                  <img
                    src={shape.image}
                    alt={`${shape.name} face shape glasses`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-4xl">{shape.emoji}</span>
                    <h2 className="font-display font-bold text-2xl text-white mt-1">{shape.name}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className={`lg:col-span-2 p-8 ${shape.color}`}>
                  <p className="text-gray-700 leading-relaxed mb-6">{shape.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-black mb-3">Caractéristiques</h3>
                      <ul className="space-y-1.5">
                        {shape.characteristics.map((c) => (
                          <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-black mb-3">Célébrités</h3>
                      <ul className="space-y-1.5">
                        {shape.celebrities.map((c) => (
                          <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-green-700 mb-3">✓ Montures recommandées</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {shape.bestFrames.map((f) => (
                          <span key={f} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-red-600 mb-3">✕ À éviter</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {shape.avoidFrames.map((f) => (
                          <span key={f} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 border border-white p-4 mb-6">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-black">Conseil pro : </span>{shape.tips}
                    </p>
                  </div>

                  <Link
                    href={`/shop?faceShape=${shape.id}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-gold-500 transition-colors duration-200"
                  >
                    Voir les montures pour visage {shape.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-black text-white p-12 text-center">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Toujours pas sûr(e) ?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Essayez notre essayage virtuel pour voir n&apos;importe quelle monture sur votre visage en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/virtual-try-on"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gold-500 text-black font-semibold text-sm tracking-wider uppercase hover:bg-gold-400 transition-colors"
            >
              Essayer virtuellement
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white text-white font-semibold text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-colors"
            >
              Voir toutes les montures
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
