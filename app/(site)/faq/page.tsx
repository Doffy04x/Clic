'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_CATEGORIES = [
  {
    id: 'ordering',
    label: 'Commandes & Paiement',
    questions: [
      {
        q: 'Comment passer une commande ?',
        a: 'Parcourez notre catalogue, choisissez votre monture, sélectionnez le type de verre et la couleur, puis ajoutez au panier. Vous pouvez commander en tant qu\'invité ou créer un compte pour suivre vos commandes. Nous acceptons les cartes bancaires (CMI, Visa, Mastercard), PayPal et le virement bancaire.',
      },
      {
        q: 'Puis-je modifier ou annuler ma commande après l\'avoir passée ?',
        a: 'Les commandes peuvent être modifiées ou annulées dans les 2 heures suivant la passation. Passé ce délai, la production commence et les modifications peuvent ne plus être possibles. Contactez-nous immédiatement à contact@clicoptique.ma si vous avez besoin d\'apporter des changements.',
      },
      {
        q: 'Proposez-vous le paiement en plusieurs fois ?',
        a: 'Oui, nous proposons le paiement en 3x ou 4x sans frais pour les commandes à partir de 1 500 DH via CMI ou votre banque. Cette option s\'affiche lors du paiement.',
      },
      {
        q: 'Mes informations de paiement sont-elles sécurisées ?',
        a: 'Absolument. Toutes les transactions sont traitées par un système sécurisé certifié PCI DSS. Vos coordonnées bancaires ne sont jamais stockées sur nos serveurs.',
      },
      {
        q: 'Proposez-vous des réductions ou des codes promo ?',
        a: 'Oui ! Abonnez-vous à notre newsletter pour bénéficier de -10% sur votre première commande. Nous organisons également des ventes saisonnières et offrons des remises spéciales pour les étudiants et le personnel de santé — envoyez-nous un justificatif par e-mail.',
      },
      {
        q: 'Acceptez-vous le paiement à la livraison ?',
        a: 'Oui, nous acceptons le paiement à la livraison (cash) sur l\'ensemble du territoire marocain. Cette option est disponible au moment du paiement. Des frais supplémentaires peuvent s\'appliquer selon votre région.',
      },
    ],
  },
  {
    id: 'prescription',
    label: 'Ordonnances & Verres',
    questions: [
      {
        q: 'Comment saisir mon ordonnance ?',
        a: 'Lors du paiement, vous serez invité à renseigner les détails de votre ordonnance (SPH, CYL, AXIS, ADD pour les verres progressifs et votre écart pupillaire). Vous pouvez aussi nous envoyer une photo de votre ordonnance par e-mail après votre commande.',
      },
      {
        q: 'Quelles corrections prenez-vous en charge ?',
        a: 'Nous prenons en charge la plupart des corrections standard : SPH de -12,00 à +8,00, CYL de -6,00 à +6,00. Pour les corrections très fortes, nous vous recommandons de nous contacter avant pour confirmer la compatibilité avec la monture choisie.',
      },
      {
        q: 'Quelle est la différence entre verres unifocaux et progressifs ?',
        a: 'Les verres unifocaux corrigent la vision à une seule distance (de loin ou de près). Les verres progressifs (aussi appelés verres à foyer progressif) offrent une correction transparente pour la vision de loin, intermédiaire et de près dans un seul verre — sans ligne visible.',
      },
      {
        q: 'Puis-je commander des verres sans correction (plano) ?',
        a: 'Oui. Sélectionnez simplement « Sans correction » lors du paiement. Vous pouvez commander n\'importe quelle monture en lunettes de mode ou avec des verres anti-lumière bleue sans correction.',
      },
      {
        q: 'Quels traitements sont inclus avec mes verres ?',
        a: 'Tous les verres incluent le traitement anti-rayures et la protection UV400 en standard. Le traitement anti-reflets est inclus avec les verres progressifs, anti-lumière bleue et photochromiques. Le traitement AR premium peut être ajouté à toute commande.',
      },
    ],
  },
  {
    id: 'shipping',
    label: 'Livraison & Expédition',
    questions: [
      {
        q: 'Quel est le délai de livraison ?',
        a: 'Les montures sans correction (plano) sont expédiées sous 1 à 2 jours ouvrables. Les lunettes avec prescription nécessitent 5 à 10 jours ouvrables pour la coupe et le montage des verres avant l\'expédition. La production express (3 à 5 jours) est disponible contre un supplément de 150 DH.',
      },
      {
        q: 'Combien coûte la livraison ?',
        a: 'La livraison standard est à 50 DH. La livraison est gratuite pour toute commande à partir de 1 500 DH. La livraison express (24–48h) est à 90 DH. Nous livrons partout au Maroc : Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir et toutes les villes.',
      },
      {
        q: 'Livrez-vous partout au Maroc ?',
        a: 'Oui, nous livrons dans toutes les villes et régions du Maroc via nos partenaires de livraison (Amana, Chronopost Maroc, CTM Messagerie). Les délais peuvent varier selon votre zone géographique.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Vous recevrez un e-mail de confirmation d\'expédition avec un numéro de suivi dès que votre commande est expédiée. Vous pouvez également suivre votre commande en temps réel depuis votre espace client ou la page de suivi de commande.',
      },
    ],
  },
  {
    id: 'returns',
    label: 'Retours & Garantie',
    questions: [
      {
        q: 'Quelle est votre politique de retour ?',
        a: 'Nous proposons une politique de retour de 30 jours sur toutes les montures sans prescription. Les lunettes avec prescription peuvent être retournées pour un refabrication gratuite si votre ordonnance a été saisie incorrectement. Pour les problèmes de confort ou d\'ajustement, nous offrons un service d\'ajustement gratuit.',
      },
      {
        q: 'Comment retourner un produit ?',
        a: 'Contactez-nous à retours@clicoptique.ma avec votre numéro de commande. Nous vous enverrons une étiquette de retour prépayée sous 24 heures. Une fois reçu, le remboursement est traité sous 5 à 7 jours ouvrables.',
      },
      {
        q: 'Que faire si mes lunettes arrivent endommagées ?',
        a: 'Si votre commande arrive endommagée, veuillez photographier les dégâts et nous contacter dans les 48 heures. Nous organiserons un remplacement sans frais, expédié en express.',
      },
      {
        q: 'Les montures sont-elles garanties ?',
        a: 'Oui. Toutes les montures sont couvertes par une garantie de 12 mois contre les défauts de fabrication. Cette garantie ne couvre pas les dommages accidentels, les rayures ou l\'usure normale. Les montures premium bénéficient d\'une garantie de 24 mois.',
      },
    ],
  },
  {
    id: 'virtual-tryon',
    label: 'Essayage Virtuel',
    questions: [
      {
        q: 'Comment fonctionne l\'essayage virtuel ?',
        a: 'Notre essayage virtuel utilise la caméra frontale de votre appareil avec une détection des points de repère du visage par IA pour placer les lunettes sur votre visage en temps réel. Aucun téléchargement d\'application nécessaire — cela fonctionne directement dans votre navigateur.',
      },
      {
        q: 'Quels appareils et navigateurs sont supportés ?',
        a: 'L\'essayage virtuel fonctionne sur Chrome, Firefox, Safari (iOS 14+) et Edge. Les ordinateurs de bureau et les appareils mobiles sont supportés. Une caméra frontale est nécessaire.',
      },
      {
        q: 'Mon flux caméra est-il enregistré ou partagé ?',
        a: 'Non. Tout le traitement de la caméra se fait localement dans votre navigateur. Aucune image n\'est jamais transmise à nos serveurs, stockée ou partagée. Votre vie privée est totalement protégée.',
      },
      {
        q: 'Puis-je sauvegarder ou partager ma photo d\'essayage virtuel ?',
        a: 'Oui ! Utilisez le bouton « Prendre une capture d\'écran » pour capturer votre look, puis partagez directement via l\'API Web Share ou téléchargez l\'image. Les captures d\'écran incluent un filigrane Clic Optique discret.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-gold-600 transition-colors"
      >
        <span className="font-display font-medium text-base text-black">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-5 h-5 text-gray-400"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-gray-600 leading-relaxed pr-10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('ordering');

  const current = FAQ_CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-black">FAQ</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500 mb-4">Centre d&apos;aide</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-black mb-5">
            Foire aux questions
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Tout ce que vous devez savoir sur les commandes, les verres, la livraison au Maroc et bien plus.
          </p>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-1">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}

              {/* Contact box */}
              <div className="mt-8 p-4 bg-cream border-l-2 border-gold-500">
                <p className="text-xs font-semibold uppercase tracking-wider text-black mb-2">Vous avez encore des questions ?</p>
                <p className="text-xs text-gray-600 mb-3">Notre équipe répond dans les 2 heures ouvrables.</p>
                <Link href="/contact" className="text-xs font-semibold text-gold-600 hover:text-gold-700 underline">
                  Nous contacter →
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-display font-bold text-xl text-black mb-6 pb-4 border-b border-gray-200">
                  {current.label}
                </h2>
                <div>
                  {current.questions.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-black text-white p-10 text-center">
          <h2 className="font-display font-bold text-2xl mb-3">Vous n&apos;avez pas trouvé votre réponse ?</h2>
          <p className="text-gray-400 mb-6">Envoyez-nous un message ou venez nous rendre visite dans notre boutique à Casablanca — nous sommes là pour vous aider.</p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gold-500 text-black font-semibold text-sm tracking-wider uppercase hover:bg-gold-400 transition-colors">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
