import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guide des tailles de montures — Comment trouver votre taille',
  description: 'Apprenez à mesurer votre taille de monture et à trouver l\'ajustement parfait. Notre guide complet explique la largeur des verres, la taille du pont, la longueur des branches et plus encore.',
};

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-black">Guide des tailles</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500 mb-4">Guide d&apos;ajustement</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-black mb-5">Guide des tailles de montures</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            L&apos;ajustement parfait est aussi important que le style parfait. Voici tout ce que vous devez savoir
            sur la mesure et le choix de la bonne taille de monture.
          </p>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-6" />
        </div>

        {/* Size number diagram */}
        <div className="bg-cream p-8 md:p-12 mb-16">
          <h2 className="font-display font-bold text-2xl text-black mb-2">Lire les numéros de taille</h2>
          <p className="text-gray-500 mb-8">Chaque monture a trois mesures imprimées à l&apos;intérieur de la branche, ex. <strong className="text-black font-mono">52 □ 18 — 145</strong></p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '52',
                symbol: '□',
                label: 'Largeur du verre',
                desc: 'La largeur horizontale d\'un verre en millimètres, mesurée au point le plus large. La plupart des adultes se situent entre 48 et 58 mm.',
                color: 'bg-blue-100 text-blue-800',
              },
              {
                number: '18',
                symbol: '—',
                label: 'Largeur du pont',
                desc: 'La distance entre les verres au-dessus du pont nasal en millimètres. La plupart des adultes se situent entre 14 et 24 mm.',
                color: 'bg-gold-100 text-gold-800',
              },
              {
                number: '145',
                symbol: '',
                label: 'Longueur des branches',
                desc: 'La longueur de la branche depuis la charnière jusqu\'à la pointe qui va derrière l\'oreille. Généralement 135–150 mm.',
                color: 'bg-green-100 text-green-800',
              },
            ].map((item) => (
              <div key={item.label} className="bg-white p-6 border border-gray-100">
                <div className={`inline-block px-3 py-1 rounded font-mono font-bold text-xl mb-4 ${item.color}`}>
                  {item.number}{item.symbol}
                </div>
                <h3 className="font-display font-semibold text-base text-black mb-2">{item.label}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to measure your current frames */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-display font-bold text-2xl text-black mb-6">Mesurer vos lunettes actuelles</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Le moyen le plus simple de trouver votre taille est de vérifier vos lunettes actuelles. Regardez à l&apos;intérieur de la branche — vous y trouverez généralement les trois chiffres imprimés ou gravés.
            </p>
            <div className="space-y-4">
              {[
                { step: '1', text: 'Posez vos lunettes actuelles face vers le bas sur une surface plate' },
                { step: '2', text: 'Regardez à l\'intérieur de la branche droite les chiffres comme "52 □ 18 — 145"' },
                { step: '3', text: 'Notez les trois mesures' },
                { step: '4', text: 'Utilisez-les comme taille de départ lors de vos achats' },
                { step: '5', text: 'Si vous souhaitez une taille plus grande ou plus petite, ajustez de 2 à 4 mm' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{item.step}</span>
                  <p className="text-gray-700 pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-black mb-6">Mesurer votre visage</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Si vous n&apos;avez pas de lunettes à utiliser comme référence, mesurez directement avec un mètre ruban souple ou une règle.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Distance pupillaire (DP)', desc: 'Mesurez du centre d\'une pupille à l\'autre. Moyenne : 58–68 mm. Utilisez une règle PD ou demandez à votre opticien.' },
                { label: 'Largeur des tempes', desc: 'Mesurez de tempe en tempe à travers votre front au repos. Cela aide à déterminer si les montures seront trop serrées ou trop lâches.' },
                { label: 'Pont nasal', desc: 'Mesurez la largeur de votre pont nasal. S\'il est étroit, choisissez une taille de pont plus petite (14–16 mm). Les ponts nasaux larges conviennent à 18–22 mm.' },
              ].map((item) => (
                <div key={item.label} className="bg-cream p-4">
                  <h3 className="font-semibold text-sm text-black mb-1">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Size chart by face width */}
        <div className="mb-16">
          <h2 className="font-display font-bold text-2xl text-black mb-8">Guide général des tailles</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">Taille</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">Largeur verre</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">Pont</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">Branche</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">Idéal pour</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: 'XS / Étroit', lens: '44–47 mm', bridge: '14–16 mm', temple: '135–140 mm', for: 'Enfants, adultes petits gabarits, visages étroits' },
                  { size: 'S / Petit', lens: '48–50 mm', bridge: '16–18 mm', temple: '140–142 mm', for: 'Petits visages adultes, traits fins' },
                  { size: 'M / Moyen', lens: '51–54 mm', bridge: '18–20 mm', temple: '143–145 mm', for: 'La plupart des adultes — la taille la plus courante' },
                  { size: 'L / Grand', lens: '55–58 mm', bridge: '20–22 mm', temple: '145–150 mm', for: 'Visages larges, traits prononcés, hommes' },
                  { size: 'XL / Oversize', lens: '59–64 mm', bridge: '20–24 mm', temple: '145–150 mm', for: 'Styles affirmés, couverture maximale' },
                ].map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 border-b border-gray-100 font-semibold text-sm">{row.size}</td>
                    <td className="p-4 border-b border-gray-100 text-sm text-gray-600 font-mono">{row.lens}</td>
                    <td className="p-4 border-b border-gray-100 text-sm text-gray-600 font-mono">{row.bridge}</td>
                    <td className="p-4 border-b border-gray-100 text-sm text-gray-600 font-mono">{row.temple}</td>
                    <td className="p-4 border-b border-gray-100 text-sm text-gray-500">{row.for}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fit tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: '👁️',
              title: 'Position des yeux',
              desc: 'Vos pupilles doivent être centrées dans le verre, ou légèrement au-dessus du centre. Si vos yeux sont proches du bord supérieur ou inférieur, la monture n\'est pas adaptée.',
            },
            {
              icon: '👃',
              title: 'Appui nasal',
              desc: 'Les lunettes doivent reposer confortablement sur le nez sans glisser. Les patins nasaux doivent être à plat, sans creuser ni laisser de marques rouges.',
            },
            {
              icon: '👂',
              title: 'Ajustement des branches',
              desc: 'Les branches doivent être à plat contre la tête et s\'incurver confortablement derrière l\'oreille. Des branches trop serrées causent des maux de tête ; trop lâches, elles glissent.',
            },
          ].map((tip) => (
            <div key={tip.title} className="bg-cream p-6">
              <div className="text-3xl mb-4">{tip.icon}</div>
              <h3 className="font-display font-semibold text-base text-black mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-black text-white p-10 text-center">
          <h2 className="font-display font-bold text-2xl mb-3">Besoin d&apos;aide pour choisir ?</h2>
          <p className="text-gray-400 mb-6">Nos opticiens sont disponibles du lundi au samedi pour vous aider à trouver l&apos;ajustement parfait.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gold-500 text-black font-semibold text-sm tracking-wider uppercase hover:bg-gold-400 transition-colors">
              Nous contacter
            </Link>
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white text-white font-semibold text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-colors">
              Voir toutes les montures
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
