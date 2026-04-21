import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Le Blog — Actualités lunettes, style & vision',
  description: 'Découvrez les tendances lunetterie, conseils de style, explications sur les technologies de verres et histoires de marques par l\'équipe éditoriale de Clic Optique.',
};

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
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="#">
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
