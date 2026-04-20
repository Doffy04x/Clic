import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '../page';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Article introuvable' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

// Sample article body content keyed by slug
const ARTICLE_CONTENT: Record<string, string[]> = {
  'spring-2025-eyewear-trends': [
    'Le printemps 2025 est arrivé, et avec lui une nouvelle vague d\'énergie dans la lunetterie sur les podiums et dans les rues. Après plusieurs saisons de minimalisme discret, l\'humeur a évolué vers l\'audace — des proportions oversize, des matériaux inattendus et un amour renouvelé pour les références des années 70 et 90.',
    '**1. Shields & visières oversize** — Le look mega-lentilles qui a fait ses débuts sur le podium Loewe la saison dernière s\'est répandu dans la lunetterie quotidienne. Cherchez des lentilles continues uniques qui enveloppent le haut du visage, souvent dans des teintes ambre ou fumées.',
    '**2. Métal ultra-fin** — En réaction à la tendance acétate épais, les montures ultra-fines dorées et argentées sont partout. Les fabricants japonais mènent la charge avec des constructions en titane de moins de 15 grammes.',
    '**3. Acétate rétro en tons chauds** — Le miel, l\'ambre et l\'écaille caramel connaissent un grand retour. Le bio-acétate des ateliers italiens dans des motifs nuancés et terreux semble à la fois nostalgique et très actuel.',
    '**4. Géométriques audacieux** — Hexagones, octagones et formes angulaires insolites remplacent le carré classique. Affirmé sans être excentrique lorsqu\'il est conservé dans des coloris classiques.',
    '**5. Transparent & discret** — Les montures sans monture et ultra-transparentes continuent de progresser. L\'attrait réside dans la présentation "visage en avant" — les lunettes sont là, mais elles ne dominent pas.',
    'Le fil conducteur de toutes ces tendances ? Un sens de l\'intentionnalité. Les meilleurs choix de lunetterie en 2025 semblent réfléchis, pas clinquants. Ils amplifient plutôt qu\'ils n\'écrasent.',
  ],
  'progressive-lenses-complete-guide': [
    'Si on vous a récemment annoncé que vous aviez besoin de verres progressifs pour la première fois, vous avez probablement des questions — et peut-être un peu d\'appréhension. C\'est tout à fait normal. Ce guide vous explique tout pour que vous sachiez exactement à quoi vous attendre.',
    '**Que sont les verres progressifs ?** Les verres progressifs (aussi appelés verres multifocaux) combinent la correction de la vision de loin, intermédiaire et de près dans un seul verre. Contrairement aux verres bifocaux, il n\'y a pas de ligne de démarcation visible — la prescription change progressivement au fur et à mesure que vos yeux descendent dans le verre.',
    '**Les zones :** La partie supérieure du verre est optimisée pour la vision de loin (conduite, regarder la télévision). La section centrale gère les distances intermédiaires (travail sur ordinateur). La zone inférieure couvre les tâches de près (lecture, téléphone).',
    '**Période d\'adaptation :** La plupart des nouveaux porteurs ont besoin de 1 à 2 semaines pour s\'adapter complètement. Pendant cette période, vous pouvez remarquer une légère distorsion dans les zones périphériques du verre et une sensation de "flottement" lorsque vous bougez la tête. C\'est normal et temporaire.',
    '**Conseils pour une adaptation plus rapide :** Portez les lunettes à temps plein — ne revenez pas à vos anciennes lunettes. Bougez la tête, pas seulement les yeux, lorsque vous changez de focus. Pointez votre nez vers ce que vous voulez voir clairement.',
    '**Choisir la bonne monture :** Toutes les montures ne conviennent pas aux progressifs. Le verre nécessite une hauteur minimale d\'environ 28 à 30 mm pour intégrer les trois zones. Les montures étroites ou sans cerclage peuvent parfois limiter la zone de lecture. Notre équipe vous conseillera lors du choix d\'une monture.',
    '**Progressifs premium vs standard :** Les verres progressifs premium offrent des zones de vision plus larges et moins de distorsion périphérique. Si vous passez beaucoup de temps devant un écran ou avez besoin d\'une vision de près précise, les verres premium valent l\'investissement.',
    'Si après trois semaines vous êtes encore inconfortable, ne abandonnez pas — consultez votre opticien. Parfois, un petit ajustement d\'ordonnance ou un réalignement de monture fait toute la différence.',
  ],
};

const DEFAULT_CONTENT = [
  'Ceci est un aperçu de l\'article complet. La version intégrale explore ce sujet en détail avec une analyse d\'experts, des conseils pratiques et des recherches approfondies de notre équipe éditoriale.',
  'Nos rédacteurs et spécialistes en optique travaillent ensemble pour créer un contenu à la fois précis et vraiment utile — que vous soyez un porteur de lunettes débutant ou un collectionneur averti de belle lunetterie.',
  'Abonnez-vous à la newsletter The Edit pour accéder à tous les articles, ainsi qu\'à du contenu exclusif, un accès anticipé aux nouvelles collections et des remises réservées aux abonnés.',
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const content = ARTICLE_CONTENT[params.slug] || DEFAULT_CONTENT;
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== params.slug && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden bg-black mb-12">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-gray-300 text-sm">{post.readTime}</span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-black transition-colors">The Edit</Link>
          <span>/</span>
          <span className="text-black truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Author & date */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-lg">
            {post.author.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm text-black">{post.author.name}</p>
            <p className="text-xs text-gray-400">{post.author.role} · {post.date}</p>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 leading-relaxed mb-10 font-light">{post.excerpt}</p>

        {/* Article body */}
        <div className="prose prose-lg max-w-none">
          {content.map((paragraph, i) => {
            // Bold text detection
            const formatted = paragraph.split(/\*\*(.*?)\*\*/g).map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="font-semibold text-black">{part}</strong> : part
            );
            return (
              <p key={i} className="text-gray-700 leading-relaxed mb-6 text-base">
                {formatted}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-cream text-xs font-medium text-gray-600 capitalize">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author bio */}
        <div className="mt-10 p-6 bg-cream border-l-4 border-gold-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gold-200 flex items-center justify-center text-gold-700 font-bold text-sm">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm text-black">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.author.role} chez Clic Optique</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Membre de l&apos;équipe éditoriale de Clic Optique, passionné(e) par l&apos;intersection entre l&apos;optique, le design et le style de vie.
          </p>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display font-bold text-2xl text-black mb-8">Autres articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                  <div className="relative h-40 overflow-hidden bg-cream mb-3">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-xs text-gold-600 uppercase tracking-wider font-semibold">{p.category}</span>
                  <h3 className="font-display font-semibold text-sm text-black mt-1 leading-snug group-hover:text-gold-600 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au blog
          </Link>
        </div>
      </div>
    </div>
  );
}
