import Link from 'next/link';

const FOOTER_LINKS = {
  Boutique: [
    { href: '/shop?category=eyeglasses', label: 'Lunettes de vue' },
    { href: '/shop?category=sunglasses', label: 'Lunettes de soleil' },
    { href: '/shop?newArrival=true', label: 'Nouveautés' },
    { href: '/shop?onSale=true', label: 'Promotions' },
    { href: '/wishlist', label: 'Ma liste de souhaits' },
    { href: '/compare', label: 'Comparer les montures' },
  ],
  Services: [
    { href: '/virtual-try-on', label: 'Essayage virtuel IA' },
    { href: '/contact#appointment', label: 'Prendre rendez-vous' },
    { href: '/face-shape-guide', label: 'Guide forme du visage' },
    { href: '/size-guide', label: 'Guide des tailles' },
  ],
  'À propos': [
    { href: '/about', label: 'Notre histoire' },
    { href: '/blog', label: 'Le Magazine' },
    { href: '/contact', label: 'Nous contacter' },
    { href: '/about#careers', label: 'Recrutement' },
  ],
  Aide: [
    { href: '/faq', label: 'FAQ' },
    { href: '/order-tracking', label: 'Suivre ma commande' },
    { href: '/faq#returns', label: 'Livraison & retours' },
    { href: '/privacy-policy', label: 'Politique de confidentialité' },
    { href: '/terms', label: "Conditions d'utilisation" },
  ],
};

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/clicoptique',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/clicoptique',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@clicoptique',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.22 8.22 0 004.83 1.55V6.78a4.85 4.85 0 01-1.07-.09z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gold-500 flex items-center justify-center">
                <span className="text-black font-display font-black text-sm">CO</span>
              </div>
              <span className="font-display font-bold text-lg tracking-wider uppercase text-white">
                Clic Optique
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              L&apos;optique premium au Maroc. Découvrez nos collections et essayez vos lunettes virtuellement depuis chez vous, livraison partout au Maroc.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 border border-gray-700 flex items-center justify-center text-gray-400 hover:border-gold-500 hover:text-gold-500 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Store Info */}
            <div className="mt-8 space-y-2 text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                </svg>
                123 Bd Mohammed V, 20000 Casablanca
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
                </svg>
                +212 5 22 48 97 00
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                Lun-Sam : 9h00 – 19h00
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="lg:col-span-1">
              <h4 className="font-display font-semibold text-sm tracking-wider uppercase mb-5 text-white">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-gold-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800">
        <div className="container-wide py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-xs">
            {[
              { icon: '🔒', text: 'Paiement sécurisé SSL' },
              { icon: '🚚', text: 'Livraison gratuite dès 1 500 DH' },
              { icon: '↩️', text: 'Retours gratuits 30 jours' },
              { icon: '✓', text: 'Authenticité garantie' },
              { icon: '📞', text: 'Support 6j/7' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2">
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Clic Optique. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {['CMI', 'Visa', 'Mastercard', 'PayPal', 'Virement', 'Livraison'].map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 bg-gray-800 text-gray-400 text-xs font-medium border border-gray-700"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
