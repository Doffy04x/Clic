/**
 * Updates all products in the DB with real Unsplash image URLs.
 * Run: npx tsx prisma/update-images.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Image pool by (category, frameShape) ────────────────────────────────────
// Each entry: [productPhoto, lifestyle/model photo]
const IMAGES: Record<string, string[][]> = {
  // SUNGLASSES
  'sunglasses:aviator': [
    ['https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80', 'https://images.unsplash.com/photo-1553735945-b3d0b0d32f23?w=800&q=80'],
    ['https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=800&q=80', 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80'],
  ],
  'sunglasses:wayfarer': [
    ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', 'https://images.unsplash.com/photo-1511499767150-a048a1aba58e?w=800&q=80'],
    ['https://images.unsplash.com/photo-1511499767150-a048a1aba58e?w=800&q=80', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'],
  ],
  'sunglasses:cat-eye': [
    ['https://images.unsplash.com/photo-1604823916665-f5b0d6553bde?w=800&q=80', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80'],
    ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80', 'https://images.unsplash.com/photo-1604823916665-f5b0d6553bde?w=800&q=80'],
  ],
  'sunglasses:round': [
    ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80', 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80'],
    ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80'],
  ],
  'sunglasses:square': [
    ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80'],
    ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80', 'https://images.unsplash.com/photo-1553735945-b3d0b0d32f23?w=800&q=80'],
    ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
  ],
  'sunglasses:rectangle': [
    ['https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=800&q=80', 'https://images.unsplash.com/photo-1511499767150-a048a1aba58e?w=800&q=80'],
    ['https://images.unsplash.com/photo-1511499767150-a048a1aba58e?w=800&q=80', 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=800&q=80'],
  ],
  'sunglasses:geometric': [
    ['https://images.unsplash.com/photo-1553735945-b3d0b0d32f23?w=800&q=80', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80'],
    ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
  ],
  // EYEGLASSES
  'eyeglasses:square': [
    ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80'],
    ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80'],
    ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80'],
  ],
  'eyeglasses:round': [
    ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80'],
    ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80', 'https://images.unsplash.com/photo-1542223533-bfa1cbd335b4?w=800&q=80'],
  ],
  'eyeglasses:oval': [
    ['https://images.unsplash.com/photo-1542223533-bfa1cbd335b4?w=800&q=80', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80'],
    ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80', 'https://images.unsplash.com/photo-1542223533-bfa1cbd335b4?w=800&q=80'],
  ],
  'eyeglasses:rectangle': [
    ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80'],
    ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80'],
  ],
  'eyeglasses:cat-eye': [
    ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80', 'https://images.unsplash.com/photo-1604823916665-f5b0d6553bde?w=800&q=80'],
    ['https://images.unsplash.com/photo-1604823916665-f5b0d6553bde?w=800&q=80', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80'],
  ],
  'eyeglasses:browline': [
    ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80'],
  ],
  'eyeglasses:geometric': [
    ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80'],
  ],
  'eyeglasses:aviator': [
    ['https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80', 'https://images.unsplash.com/photo-1553735945-b3d0b0d32f23?w=800&q=80'],
  ],
  // SPORTS & KIDS fallback
  'sports:square': [
    ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', 'https://images.unsplash.com/photo-1553735945-b3d0b0d32f23?w=800&q=80'],
  ],
  'kids:round': [
    ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80'],
  ],
};

// Fallback images if no specific match
const FALLBACK_SUNGLASSES = [
  'https://images.unsplash.com/photo-1511499767150-a048a1aba58e?w=800&q=80',
  'https://images.unsplash.com/photo-1573868388702-b4e44e22e1f4?w=800&q=80',
];
const FALLBACK_EYEGLASSES = [
  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
  'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80',
];

// Track usage counts per key so we cycle through the pool
const usageCount: Record<string, number> = {};

function getImages(category: string, frameShape: string): string[] {
  const cat = category.toLowerCase().replace('_', '-');
  const shape = frameShape.toLowerCase().replace('_', '-');
  const key = `${cat}:${shape}`;
  const pool = IMAGES[key];

  if (pool && pool.length > 0) {
    const idx = (usageCount[key] ?? 0) % pool.length;
    usageCount[key] = (usageCount[key] ?? 0) + 1;
    return pool[idx];
  }

  // Fallback: try just by category
  const catKey = `${cat}:square`;
  if (IMAGES[catKey]) return IMAGES[catKey][0];

  return cat.includes('sun') ? FALLBACK_SUNGLASSES : FALLBACK_EYEGLASSES;
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, category: true, frameShape: true },
  });

  console.log(`\n📦 Updating images for ${products.length} products...\n`);

  let updated = 0;
  for (const p of products) {
    const images = getImages(p.category, p.frameShape ?? 'square');
    await prisma.product.update({
      where: { id: p.id },
      data: { images },
    });
    console.log(`✅ ${p.name} (${p.category}/${p.frameShape}) → ${images[0].split('?')[0].split('/').pop()}`);
    updated++;
  }

  console.log(`\n🎉 Done! ${updated} products updated with real images.\n`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
