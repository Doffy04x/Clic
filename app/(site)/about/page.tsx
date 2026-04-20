import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'L\'histoire de Clic Optique — votre opticien premium en ligne et en boutique à Paris.',
};

const TEAM = [
  {
    name: 'Salma Alami',
    role: 'Fondatrice & Opticienne principale',
    bio: 'Diplômée de l\'Institut National d\'Optique avec 15 ans d\'expérience. Passionnée par l\'alliance entre art et vision.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  },
  {
    name: 'Karim Benali',
    role: 'Directeur artistique',
    bio: 'Ancien designer chez Saint Laurent Eyewear. Crée des montures qui allient esthétique et fonctionnalité.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
  },
  {
    name: 'Nadia Tahir',
    role: 'Directrice technologique',
    bio: 'Ingénieure en vision par ordinateur. A développé notre système d\'essayage virtuel avec MediaPipe.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961a28c?w=1920&q=80"
            alt="Clic Optique boutique"
            className="w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="relative z-10 container-default text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-4 block">
            Notre histoire
          </span>
          <h1 className="font-display font-black text-5xl md:text-6xl mb-6">
            Vision. Style.<br />
            <span className="text-gold-400">Excellence.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Fondée à Paris en 2018, Clic Optique est née d&apos;une conviction : chaque personne mérite
            des lunettes qui correspondent parfaitement à sa vision du monde et à son style.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-600 mb-3 block">
                Notre Mission
              </span>
              <h2 className="section-heading mb-6">
                L&apos;optique de demain, accessible aujourd&apos;hui
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Clic Optique révolutionne l&apos;expérience optique en combinant l&apos;artisanat
                  traditionnel français avec les dernières technologies d&apos;IA. Notre essayage
                  virtuel permet à chacun de trouver la monture parfaite depuis chez soi.
                </p>
                <p>
                  Nous sélectionnons chaque monture avec soin, en privilégiant des matériaux
                  premium — acétate italien, titane japonais, bois scandinave — pour garantir
                  durabilité et confort.
                </p>
                <p>
                  Notre équipe d&apos;opticiens diplômés est disponible 6 jours sur 7 pour vous
                  conseiller, que ce soit en boutique, par téléphone ou en visioconférence.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2018', label: 'Fondée à Paris' },
                { value: '15,000+', label: 'Clients satisfaits' },
                { value: '200+', label: 'Modèles uniques' },
                { value: '4.9/5', label: 'Note Trustpilot' },
              ].map((stat) => (
                <div key={stat.label} className="bg-cream p-8 text-center">
                  <div className="font-display font-black text-4xl text-black mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-cream" id="team">
        <div className="container-default">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-600 mb-3 block">
              L&apos;Équipe
            </span>
            <h2 className="section-heading">Les experts derrière Clic Optique</h2>
            <div className="gold-divider mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white group">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg">{member.name}</h3>
                  <p className="text-gold-600 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white text-center">
        <div className="container-default max-w-2xl">
          <h2 className="font-display font-black text-3xl md:text-4xl mb-4">
            Prêt à trouver vos lunettes parfaites?
          </h2>
          <p className="text-gray-400 mb-8">
            Essayez virtuellement ou prenez rendez-vous en boutique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/virtual-try-on" className="btn-gold">
              Essayage Virtuel
            </Link>
            <Link href="/contact#appointment" className="btn-outline border-white text-white hover:bg-white hover:text-black">
              Prendre Rendez-vous
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
