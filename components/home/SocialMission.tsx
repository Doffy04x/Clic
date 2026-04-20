'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = '',
  duration = 2000,
}: {
  target: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString('fr-MA')}
      {suffix}
    </span>
  )
}

// ─── Partner logos (placeholders SVG) ─────────────────────────────────────────
const PARTNERS = [
  'Association Lumière',
  'Vision Solidaire Maroc',
  'ONG Regard',
  'Fondation Optique',
]

export function SocialMission() {
  return (
    <section className="bg-[#1a1a2e] text-white overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — texte */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Notre engagement
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Chaque achat,<br />
              <span className="text-gold-400">une paire donnée</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Pour chaque paire de lunettes achetée chez Clic Optique,
              nous offrons une paire à une famille marocaine dans le besoin,
              en partenariat avec des associations locales à Casablanca,
              Marrakech et Agadir.
            </p>

            {/* Comment ça marche */}
            <div className="space-y-4 mb-10">
              {[
                { step: '01', text: 'Vous achetez une paire chez Clic Optique' },
                { step: '02', text: 'On verse 1% du montant à nos associations partenaires' },
                { step: '03', text: 'Une paire est remise à une famille défavorisée au Maroc' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-4">
                  <span className="text-gold-400 font-bold text-sm w-8 flex-shrink-0">
                    {item.step}
                  </span>
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/notre-mission"
              className="inline-flex items-center gap-2 border border-gold-400 text-gold-400
                px-7 py-3 rounded-full text-sm font-medium
                hover:bg-gold-400 hover:text-dark transition-all duration-300"
            >
              Découvrir notre mission
              <span>→</span>
            </Link>
          </motion.div>

          {/* Right — stats + partenaires */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Compteurs */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { target: 2400, suffix: '+', label: 'Paires données' },
                { target: 3, suffix: '', label: 'Villes au Maroc' },
                { target: 8, suffix: '', label: 'Associations' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-gold-400">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Citation */}
            <blockquote className="border-l-2 border-gold-400 pl-5">
              <p className="text-gray-300 text-base italic leading-relaxed">
                "Voir clairement est un droit, pas un privilège. Chez Clic Optique,
                on s'engage à ce que chaque Marocain ait accès à une correction visuelle."
              </p>
              <footer className="mt-3 text-gold-400 text-sm font-medium">
                — L'équipe Clic Optique
              </footer>
            </blockquote>

            {/* Partenaires */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">
                Nos partenaires
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PARTNERS.map(p => (
                  <div key={p}
                    className="bg-white/5 rounded-xl px-4 py-3 text-center
                      text-gray-300 text-xs font-medium border border-white/10">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
