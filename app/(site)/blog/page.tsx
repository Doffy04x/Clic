import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Le Blog — Actualités lunettes, style & vision',
  description: 'Découvrez les tendances lunetterie, conseils de style, explications sur les technologies de verres et histoires de marques par l\'équipe éditoriale de Clic Optique.',
};

const BLOG_POSTS = [
  {
    id: 'spring-2025-eyewear-trends',
    slug: 'spring-2025-eyewear-trends',
    title: '5 tendances lunettes qui définissent le printemps 2025',
    excerpt: 'Des silhouettes oversize aux métaux rétro-futuristes, voici les styles de montures qui dominent les podiums et les rues cette saison.',
    category: 'Tendances',
    readTime: '4 min de lecture',
    date: '15 mars 2025',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800',
    author: { name: 'Sara Alami', role: 'Directrice de style' },
    featured: true,
    tags: ['tendances', 'printemps', 'style'],
  },
  {
    id: 'progressive-lenses-guide',
    slug: 'progressive-lenses-complete-guide',
    title: 'Verres progressifs : le guide complet pour les débutants',
    excerpt: 'Tout ce que vous devez savoir avant de passer aux progressifs — durée d\'adaptation, zones de vision et choix de la bonne monture.',
    category: 'Éducation',
    readTime: '7 min de lecture',
    date: '28 février 2025',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800',
    author: { name: 'Dr. Mohamed Tahir', role: 'Spécialiste optique' },
    featured: true,
    tags: ['verres', 'progressifs', 'guide'],
  },
  {
    id: 'titanium-vs-acetate',
    slug: 'titanium-vs-acetate-frames',
    title: 'Titane vs Acétate : quelle matière de monture vous convient ?',
    excerpt: 'Avantages, inconvénients, poids, durabilité et prix des deux matériaux de montures les plus populaires du marché.',
    category: 'Éducation',
    readTime: '5 min de lecture',
    date: '10 février 2025',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800',
    author: { name: 'Karim Benali', role: 'Designer produit' },
    featured: false,
    tags: ['matériaux', 'titane', 'acétate'],
  },
  {
    id: 'blue-light-glasses-worth-it',
    slug: 'blue-light-glasses-worth-it',
    title: 'Les lunettes anti-lumière bleue valent-elles vraiment le coup ?',
    excerpt: 'Nous avons passé en revue les dernières études scientifiques pour savoir si les verres anti-lumière bleue tiennent leurs promesses.',
    category: 'Santé',
    readTime: '6 min de lecture',
    date: '22 janvier 2025',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    author: { name: 'Dr. Nadia Tahir', role: 'Optométriste' },
    featured: false,
    tags: ['lumière-bleue', 'santé', 'verres', 'science'],
  },
  {
    id: 'salon-optique-2025',
    slug: 'salon-optique-2025-highlights',
    title: 'Salon International de l\'Optique 2025 : nos coups de cœur',
    excerpt: 'Nous avons parcouru chaque allée du salon. Voici les créations marquantes, les marques émergentes et les innovations matériaux qui nous ont le plus enthousiasmés.',
    category: 'Événements',
    readTime: '5 min de lecture',
    date: '15 janvier 2025',
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800',
    author: { name: 'Sara Alami', role: 'Directrice de style' },
    featured: false,
    tags: ['événements', 'tendances', 'innovation'],
  },
  {
    id: 'care-for-glasses',
    slug: 'how-to-care-for-your-glasses',
    title: 'Comment entretenir vos lunettes — et les faire durer des années',
    excerpt: 'Nettoyage, rangement, ajustements et ce qu\'il faut éviter. Le guide définitif pour garder vos montures et vos verres en parfait état.',
    category: 'Entretien',
    readTime: '4 min de lecture',
    date: '5 janvier 2025',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
    author: { name: 'Karim Benali', role: 'Designer produit' },
    featured: false,
    tags: ['entretien', 'maintenance', 'conseils'],
  },
];

const CATEGORIES = ['Tous', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export default function BlogPage() {
  const featured = BLOG_POSTS.filter((p) => p.featured);
  const regular = BLOG_POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500 mb-4">The Edit</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-black mb-5">
            Actualités lunettes & style
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Tendances, éducation, guides d&apos;entretien et avis d&apos;experts de notre équipe d&apos;opticiens et de rédacteurs.
          </p>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-6" />
        </div>

        {/* Featured posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {featured.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative overflow-hidden bg-black block"
            >
              <div className={`relative ${i === 0 ? 'h-[480px]' : 'h-[480px]'} overflow-hidden`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-xs">{post.readTime}</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-white mb-3 leading-tight group-hover:text-gold-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{post.author.name}</p>
                      <p className="text-gray-400 text-xs">{post.date}</p>
                    </div>
                    <span className="text-gold-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Lire →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="flex-shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-200 first:bg-black first:text-white first:border-black"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {regular.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-cream mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400">{post.date}</span>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400">{post.readTime}</span>
              </div>
              <h3 className="font-display font-semibold text-lg text-black mb-2 leading-snug group-hover:text-gold-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{post.author.name}</span>
                <span className="text-xs font-semibold text-black group-hover:text-gold-600 transition-colors inline-flex items-center gap-1">
                  Lire la suite →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-20 bg-cream p-10 md:p-14 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500 mb-3">The Edit Newsletter</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-black mb-3">Restez informé(e)</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Guides de style, nouveautés et offres exclusives — livrés dans votre boîte mail deux fois par mois.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black bg-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white text-sm font-semibold tracking-wider uppercase hover:bg-gold-500 transition-colors whitespace-nowrap"
            >
              S&apos;abonner
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">Pas de spam. Désabonnement à tout moment.</p>
        </div>
      </div>
    </div>
  );
}
