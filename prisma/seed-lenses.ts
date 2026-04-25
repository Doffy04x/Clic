/**
 * Seed script — Lens Template catalog
 * Run: npx tsx prisma/seed-lenses.ts
 *
 * Safe to run multiple times — uses upsert by name+category so it won't duplicate.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LENSES = [
  // ── Protection Lumière bleue ──────────────────────────────────────────────
  {
    category: 'Protection Lumière bleue',
    name: 'Protection Anti-Lumière bleue Basic',
    description: 'Protection de base contre la lumière bleue des écrans',
    price: 0,
    features: ['Filtre lumière bleue basique', 'Antireflets standard'],
    sortOrder: 1,
  },
  {
    category: 'Protection Lumière bleue',
    name: 'Protection Anti-Lumière bleue +',
    description: 'Protection renforcée contre la lumière bleue',
    price: 300,
    features: ['Filtre lumière bleue avancé', 'Antireflets haute qualité', 'Confort visuel amélioré'],
    sortOrder: 2,
  },
  {
    category: 'Protection Lumière bleue',
    name: 'Protection Anti-Lumière bleue PREMIUM',
    description: 'Protection maximale contre la lumière bleue des écrans et LED',
    price: 800,
    features: ['Filtre lumière bleue maximum', 'Antireflets multicouches', 'Traitement hydrophobe', 'Garantie 2 ans'],
    sortOrder: 3,
  },

  // ── Protection Lumière bleue + Correction ─────────────────────────────────
  {
    category: 'Protection Lumière bleue + Correction',
    name: '1 — Amincis Antireflets bleue (1.50) — Correction 0.25 à 1',
    description: 'Verres amincis avec antireflets bleu — indice 1.50',
    price: 300,
    features: ['Indice 1.50', 'Correction entre 0.25 et 1', 'Antireflets bleue', 'GARANTIE 1 AN'],
    sortOrder: 1,
  },
  {
    category: 'Protection Lumière bleue + Correction',
    name: '1 — Super Amincis Antireflets bleue (1.6) — Correction 1 à 3',
    description: 'Verres super amincis avec antireflets bleu — indice 1.6',
    price: 500,
    features: ['Indice 1.6', 'Correction entre 1 et 3', 'Antireflets bleue', 'GARANTIE 1 AN'],
    sortOrder: 2,
  },
  {
    category: 'Protection Lumière bleue + Correction',
    name: '1 — Ultra Amincis Antireflets bleue (1.67) — Correction +/- 4 ou plus',
    description: 'Verres ultra amincis avec antireflets bleu — indice 1.67',
    price: 800,
    features: ['Indice 1.67', 'Correction de +/- 4 ou plus', 'Antireflets bleue', 'GARANTIE 1 AN'],
    sortOrder: 3,
  },
  {
    category: 'Protection Lumière bleue + Correction',
    name: '2 — Verres PREMIUM Amincis (1.55) — Correction 0.25 à 1',
    description: 'Verres PREMIUM multicouches — indice 1.55, haute qualité',
    price: 500,
    features: ['Indice 1.55', 'Correction entre 0.25 et 1', 'Antireflets Bleu multicouches', 'GARANTIE 2 ANS'],
    sortOrder: 4,
  },
  {
    category: 'Protection Lumière bleue + Correction',
    name: '2 — Verres PREMIUM Super Amincis (1.6) — Correction +/- 3 ou plus',
    description: 'Verres PREMIUM super amincis multicouches — indice 1.6',
    price: 800,
    features: ['Indice 1.6', 'Correction de +/- 3 ou plus', 'Antireflets Bleu multicouches', 'GARANTIE 2 ANS'],
    sortOrder: 5,
  },
  {
    category: 'Protection Lumière bleue + Correction',
    name: '2 — Verres PREMIUM Ultra Amincis (1.67) — Correction +/- 4 ou plus',
    description: 'Verres PREMIUM ultra amincis multicouches — indice 1.67, top de gamme',
    price: 1500,
    features: ['Indice 1.67', 'Correction de +/- 4 ou plus', 'Antireflets Bleu multicouches', 'GARANTIE 2 ANS'],
    sortOrder: 6,
  },
  {
    category: 'Protection Lumière bleue + Correction',
    name: 'Verres Photochromiques 1.50 Antireflets bleue',
    description: 'Verres qui s\'assombrissent automatiquement à la lumière du soleil',
    price: 500,
    features: ['Indice 1.50', 'Photochromique (s\'assombrit au soleil)', 'Antireflets bleue', 'GARANTIE 2 ANS'],
    sortOrder: 7,
  },
  {
    category: 'Protection Lumière bleue + Correction',
    name: 'Demander un devis (grandes mesures)',
    description: 'Pour les corrections importantes hors catalogue standard, contactez-nous',
    price: 0,
    features: ['Sur mesure', 'Devis personnalisé', 'Toutes corrections'],
    sortOrder: 8,
  },

  // ── Solaire ───────────────────────────────────────────────────────────────
  {
    category: 'Solaire',
    name: 'Verres solaires teintés — Catégorie 3',
    description: 'Verres solaires standard pour usage quotidien en plein soleil',
    price: 0,
    features: ['Catégorie 3', 'Protection UV400', 'Inclus'],
    sortOrder: 1,
  },
  {
    category: 'Solaire',
    name: 'Verres solaires polarisants',
    description: 'Élimine les reflets éblouissants sur l\'eau, la route et la neige',
    price: 350,
    features: ['Polarisant', 'Anti-éblouissement', 'Protection UV400', 'Catégorie 3'],
    sortOrder: 2,
  },
  {
    category: 'Solaire',
    name: 'Verres solaires avec correction',
    description: 'Verres solaires adaptés à votre correction optique',
    price: 500,
    features: ['Correction optique incluse', 'Teinte solaire', 'Protection UV400', 'Sur ordonnance'],
    sortOrder: 3,
  },

  // ── Sans correction ───────────────────────────────────────────────────────
  {
    category: 'Sans correction',
    name: 'Verres transparents sans correction',
    description: 'Verres neutres — pour montures de vue portées sans ordonnance',
    price: 0,
    features: ['Indice 1.50', 'Antireflets standard', 'Inclus'],
    sortOrder: 1,
  },
];

async function main() {
  console.log('🔍 Seeding lens templates...');
  let created = 0;
  let updated = 0;

  for (const lens of LENSES) {
    const existing = await prisma.lensTemplate.findFirst({
      where: { name: lens.name, category: lens.category },
    });

    if (existing) {
      await prisma.lensTemplate.update({
        where: { id: existing.id },
        data: lens,
      });
      updated++;
    } else {
      await prisma.lensTemplate.create({ data: { ...lens, active: true } });
      created++;
    }
  }

  console.log(`✅ Done — ${created} created, ${updated} updated`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
