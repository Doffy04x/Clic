'use client'

import { motion } from 'framer-motion'

const GUARANTEES = [
  {
    icon: '🚚',
    title: 'Livraison gratuite',
    subtitle: 'Partout au Maroc, sans minimum d\'achat',
  },
  {
    icon: '↩️',
    title: 'Retours 30 jours',
    subtitle: 'On prend en charge les frais de retour',
  },
  {
    icon: '🛡️',
    title: 'Garantie 12 mois',
    subtitle: 'Verres rayés ? On les remplace',
  },
  {
    icon: '👁️',
    title: 'Essai en boutique',
    subtitle: '123 Bd Mohammed V, Casablanca',
  },
]

export function TrustBanner() {
  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {GUARANTEES.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center px-2"
            >
              <div className="text-3xl mb-2">{g.icon}</div>
              <h3 className="font-semibold text-dark text-sm md:text-base">{g.title}</h3>
              <p className="text-xs md:text-sm text-gray-400 mt-1 leading-snug">{g.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
