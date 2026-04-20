/**
 * Clic Optique — Database Seed
 * 31 products sourced from Wooby Eyewear WhatsApp Business Catalogue
 * (WhatsApp Web display limit — full 200+ catalogue needs to be added manually)
 *
 * Instructions:
 *   1. npx prisma db push
 *   2. npx prisma generate
 *   3. npm run db:seed
 *
 * Images: copy product JPEGs to /public/images/products/<SKU>.jpg
 * Prices: update placeholder prices before going live
 */

import {
  PrismaClient,
  ProductCategory,
  FrameShape,
  FrameType,
  FrameMaterial,
  Gender,
  UserRole,
} from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────
const lensOptionsSoleil = [
  { type: 'standard', label: 'Verres Teintés', price: 0, features: ['UV400', 'Anti-reflets'] },
  { type: 'polarized', label: 'Verres Polarisés', price: 80, features: ['UV400', 'Anti-reflets', 'Polarisé'] },
]
const lensOptionsMiroir = [
  { type: 'standard', label: 'Verres Miroir', price: 0, features: ['UV400', 'Miroir'] },
  { type: 'polarized', label: 'Verres Polarisés Miroir', price: 80, features: ['UV400', 'Miroir', 'Polarisé'] },
]
const lensOptionsVue = [
  { type: 'vue', label: 'Verres Correcteurs', price: 0, features: ['Anti-reflets', 'Anti-UV'] },
  { type: 'vue_progressive', label: 'Verres Progressifs', price: 150, features: ['Anti-reflets', 'Anti-UV', 'Progressif'] },
  { type: 'clip_soleil', label: 'Clip Soleil Inclus', price: 0, features: ['UV400'] },
]

const specSoleil = { protection: 'UV400', materiau_verres: 'Polycarbonate' }
const specVue = { type: 'Clip-On magnétique', verres_optiques: 'Sur ordonnance', clip_soleil: 'Inclus', protection: 'UV400 (clip)' }

async function main() {
  console.log('🌱 Seeding Clic Optique — 31 produits Wooby Eyewear\n')

  // ── Admin ──────────────────────────────────────────────────────────────────
  const pwd = await bcrypt.hash('Admin1234!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@clicoptique.ma' },
    update: {},
    create: {
      email: 'admin@clicoptique.ma',
      name: 'Admin Clic Optique',
      passwordHash: pwd,
      role: UserRole.ADMIN,
    },
  })
  console.log('✅ Admin: admin@clicoptique.ma / Admin1234!\n')

  // ── Products ───────────────────────────────────────────────────────────────
  const products = [

    // ════════════════════════════════════════════════════════════════════════
    // LUNETTES DE SOLEIL — FEMMES
    // ════════════════════════════════════════════════════════════════════════
    {
      slug: 'cosmos-gold-w4962s-c1', sku: 'W4962S-C1',
      name: 'Cosmos Gold',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 350, compareAtPrice: 480,
      description: 'Monture métallique dorée avec verres rectangulaires fumés et double pont. Design contemporain alliant élégance et modernité. Protection UV400.',
      shortDescription: 'Monture dorée rectangulaire, verres fumés, double pont. UV400.',
      images: ['/images/products/W4962S-C1-photo.jpg', '/images/products/W4962S-C1-model1.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Or / Fumé', hex: '#C8A028', image: '/images/products/W4962S-C1-photo.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'mixte', 'metal', 'rectangulaire', 'dore', 'uv400', 'nouveau'],
      specifications: specSoleil, stock: 25, featured: true, bestSeller: false, newArrival: true, onSale: true, salePercentage: 27,
    },
    {
      slug: 'eclipse-w4960s-c1', sku: 'W4960S-C1',
      name: 'Eclipse',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 320, compareAtPrice: 450,
      description: 'Lunettes de soleil au design aviateur épuré avec verres teintés premium. Monture légère et résistante. Style intemporel. Protection UV400.',
      shortDescription: 'Aviateur classique, verres fumés, monture légère. UV400.',
      images: ['/images/products/W4960S-C1.jpg'],
      frameShape: FrameShape.AVIATOR, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Noir / Fumé', hex: '#1C1C1C', image: '/images/products/W4960S-C1.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'SQUARE', 'HEART'],
      tags: ['soleil', 'mixte', 'aviateur', 'uv400', 'nouveau'],
      specifications: specSoleil, stock: 20, featured: true, bestSeller: false, newArrival: true, onSale: true, salePercentage: 29,
    },
    {
      slug: 'shadow-w4953s-c4', sku: 'W4953S-C4',
      name: 'Shadow',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 280, compareAtPrice: 390,
      description: 'Lunettes de soleil carrées avec verres sombres pour une protection optimale. Style bold et affirmé. Monture en acétate haute qualité. UV400.',
      shortDescription: 'Carré mat, verres noirs, style affirmé. UV400.',
      images: ['/images/products/W4953S-C4.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.WOMEN,
      colors: [{ name: 'Noir Mat', hex: '#0A0A0A', image: '/images/products/W4953S-C4.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'femme', 'carre', 'uv400', 'nouveau'],
      specifications: specSoleil, stock: 18, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'breeze-w4956s-c3', sku: 'W4956S-C3',
      name: 'Breeze',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 260, compareAtPrice: 360,
      description: 'Monture légère aux verres légèrement teintés pour un style décontracté. Confort maximal pour le quotidien. Protection UV400.',
      shortDescription: 'Monture légère, verres teintés doux, port quotidien. UV400.',
      images: ['/images/products/W4956S-C3.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.WOMEN,
      colors: [{ name: 'Gris / Cristal', hex: '#A0A0A0', image: '/images/products/W4956S-C3.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'SQUARE', 'OBLONG'],
      tags: ['soleil', 'femme', 'leger', 'uv400'],
      specifications: specSoleil, stock: 15, featured: false, bestSeller: false, newArrival: false, onSale: true, salePercentage: 28,
    },
    {
      slug: 'havana-w4926s-c4', sku: 'W4926S-C4',
      name: 'Havana',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 300, compareAtPrice: 420,
      description: 'Monture écaille aux reflets havane chauds. Un classique revisité pour un style rétro-chic intemporel. Protection UV400.',
      shortDescription: 'Écaille havane, verres ambrés, style rétro-chic. UV400.',
      images: ['/images/products/W4926S-C4.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.WOMEN,
      colors: [{ name: 'Havane / Ambre', hex: '#8B4513', image: '/images/products/W4926S-C4.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART', 'OBLONG'],
      tags: ['soleil', 'femme', 'ecaille', 'havane', 'retro', 'uv400', 'bestseller'],
      specifications: specSoleil, stock: 22, featured: true, bestSeller: true, newArrival: true, onSale: true, salePercentage: 29,
    },
    {
      slug: 'noir-classic-w4921s-c3', sku: 'W4921S-C3',
      name: 'Noir Classic',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 240, compareAtPrice: 340,
      description: 'Monture noire rectangulaire avec verres noirs profonds. Élégance minimaliste pour toutes les occasions. Protection UV400.',
      shortDescription: 'Monture noire, verres noirs, minimalisme élégant. UV400.',
      images: ['/images/products/W4921S-C3.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.WOMEN,
      colors: [{ name: 'Tout Noir', hex: '#000000', image: '/images/products/W4921S-C3.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'HEART', 'ROUND'],
      tags: ['soleil', 'femme', 'classique', 'noir', 'uv400'],
      specifications: specSoleil, stock: 30, featured: false, bestSeller: false, newArrival: false, onSale: true, salePercentage: 29,
    },
    {
      slug: 'emerald-w4965s-c2', sku: 'W4965S-C2',
      name: 'Emerald',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 290, compareAtPrice: 400,
      description: 'Lunettes audacieuses aux verres teintés vert émeraude. Pour les femmes qui osent la couleur. Protection UV400.',
      shortDescription: 'Verres vert émeraude, monture légère, audacieux. UV400.',
      images: ['/images/products/W4965S-C2.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.WOMEN,
      colors: [{ name: 'Noir / Vert Émeraude', hex: '#006400', image: '/images/products/W4965S-C2.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'SQUARE', 'OBLONG'],
      tags: ['soleil', 'femme', 'colore', 'vert', 'uv400', 'nouveau'],
      specifications: specSoleil, stock: 12, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'titan-noir-w4968s-c1', sku: 'W4968S-C1',
      name: 'Titan Noir',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 310, compareAtPrice: 430,
      description: 'Monture robuste aux lignes carrées affirmées et verres noirs haute protection. Style urbain moderne. Protection UV400.',
      shortDescription: 'Carré robuste, verres noirs, style urbain affirmé. UV400.',
      images: ['/images/products/W4968S-C1.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.WOMEN,
      colors: [{ name: 'Noir / Fumé', hex: '#1C1C1C', image: '/images/products/W4968S-C1.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'femme', 'carre', 'urbain', 'uv400', 'nouveau'],
      specifications: specSoleil, stock: 14, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'oversized-smoke-w4967s-c3', sku: 'W4967S-C3',
      name: 'Oversized Smoke',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 330, compareAtPrice: 460,
      description: 'Grandes lunettes oversize glamour aux verres fumés dégradés. La pièce statement de votre été. Protection UV400.',
      shortDescription: 'Oversize glamour, verres fumés dégradés, statement piece. UV400.',
      images: ['/images/products/W4967S-C3.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.WOMEN,
      colors: [{ name: 'Noir / Fumé Dégradé', hex: '#2C2C2C', image: '/images/products/W4967S-C3.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'SQUARE', 'OBLONG'],
      tags: ['soleil', 'femme', 'oversize', 'glamour', 'uv400', 'bestseller'],
      specifications: specSoleil, stock: 10, featured: true, bestSeller: true, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'amber-w4955s-c1', sku: 'W4955S-C1',
      name: 'Amber',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 270, compareAtPrice: 380,
      description: 'Monture écaille ambrée avec verres légèrement teintés. Style vintage chic pour un look raffiné. Protection UV400.',
      shortDescription: 'Écaille ambrée, verres doux, style vintage chic. UV400.',
      images: ['/images/products/W4955S-C1.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.WOMEN,
      colors: [{ name: 'Écaille / Ambre', hex: '#D2691E', image: '/images/products/W4955S-C1.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'femme', 'ecaille', 'vintage', 'ambre', 'uv400'],
      specifications: specSoleil, stock: 16, featured: false, bestSeller: false, newArrival: false, onSale: true, salePercentage: 29,
    },
    // ── Nouvelles références vues dans "Tous les articles" ──
    {
      slug: 'sierra-w4908s-c1', sku: 'W4908S-C1',
      name: 'Sierra',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 290, compareAtPrice: 400,
      description: 'Lunettes de soleil au style affirmé avec verres fumés. Monture robuste pour une utilisation quotidienne. Protection UV400.',
      shortDescription: 'Style affirmé, verres fumés, monture robuste. UV400.',
      images: ['/images/products/W4908S-C1.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Noir / Fumé', hex: '#1C1C1C', image: '/images/products/W4908S-C1.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'mixte', 'uv400', 'nouveau'],
      specifications: specSoleil, stock: 20, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'chestnut-w4933s-c2', sku: 'W4933S-C2',
      name: 'Chestnut',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 285, compareAtPrice: 395,
      description: 'Monture écaille brun châtaigne avec verres assortis. Chaleureux et élégant pour toutes les occasions. Protection UV400.',
      shortDescription: 'Écaille brun châtaigne, verres ambrés, chaleureux. UV400.',
      images: ['/images/products/W4933S-C2.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.UNISEX,
      colors: [{ name: 'Brun Châtaigne', hex: '#954535', image: '/images/products/W4933S-C2.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'OBLONG'],
      tags: ['soleil', 'mixte', 'ecaille', 'brun', 'uv400'],
      specifications: specSoleil, stock: 18, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'drift-w4937s-c1', sku: 'W4937S-C1',
      name: 'Drift',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 275, compareAtPrice: 380,
      description: 'Lunettes de soleil légères aux verres légèrement dégradés. Style casual parfait pour les journées ensoleillées. Protection UV400.',
      shortDescription: 'Légères, verres dégradés, style casual. UV400.',
      images: ['/images/products/W4937S-C1.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Argent / Gris', hex: '#C0C0C0', image: '/images/products/W4937S-C1.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'HEART', 'OBLONG'],
      tags: ['soleil', 'mixte', 'leger', 'uv400'],
      specifications: specSoleil, stock: 15, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'flint-w4941s-c1', sku: 'W4941S-C1',
      name: 'Flint',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 265, compareAtPrice: 370,
      description: 'Monture fine et élégante avec verres teintés discrets. Idéale pour un look professionnel et décontracté. Protection UV400.',
      shortDescription: 'Monture fine, verres teintés discrets, look pro. UV400.',
      images: ['/images/products/W4941S-C1.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.MEN,
      colors: [{ name: 'Gris Anthracite', hex: '#383838', image: '/images/products/W4941S-C1.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'homme', 'fin', 'professionnel', 'uv400'],
      specifications: specSoleil, stock: 14, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'forest-w4957s-c6', sku: 'W4957S-C6',
      name: 'Forest',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 295, compareAtPrice: 410,
      description: 'Verres teintés vert forêt profond pour un style naturel et original. Monture noire contrastante. Protection UV400.',
      shortDescription: 'Verres vert forêt, monture noire, style nature. UV400.',
      images: ['/images/products/W4957S-C6.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Noir / Vert Forêt', hex: '#228B22', image: '/images/products/W4957S-C6.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'SQUARE', 'OBLONG'],
      tags: ['soleil', 'mixte', 'colore', 'vert', 'uv400'],
      specifications: specSoleil, stock: 12, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'dusk-w4958s-c2', sku: 'W4958S-C2',
      name: 'Dusk',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 280, compareAtPrice: 390,
      description: 'Lunettes de soleil aux teintes crépusculaires avec monture bicolore élégante. Protection UV400.',
      shortDescription: 'Bicolore élégant, teintes crépusculaires. UV400.',
      images: ['/images/products/W4958S-C2.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.WOMEN,
      colors: [{ name: 'Or Rose / Rose', hex: '#B76E79', image: '/images/products/W4958S-C2.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'HEART', 'ROUND'],
      tags: ['soleil', 'femme', 'bicolore', 'rose', 'uv400'],
      specifications: specSoleil, stock: 13, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'sahara-w4959s-c3', sku: 'W4959S-C3',
      name: 'Sahara C3',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 300, compareAtPrice: 415,
      description: 'Monture aux tons désertiques chauds avec verres marrons dégradés. Chaleur et élégance mêlées. Protection UV400.',
      shortDescription: 'Tons désertiques, verres marrons dégradés. UV400.',
      images: ['/images/products/W4959S-C3.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.UNISEX,
      colors: [{ name: 'Sable / Marron', hex: '#C19A6B', image: '/images/products/W4959S-C3.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'mixte', 'ecaille', 'marron', 'uv400'],
      specifications: specSoleil, stock: 16, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'sahara-w4959s-c4', sku: 'W4959S-C4',
      name: 'Sahara C4',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 300, compareAtPrice: 415,
      description: 'Variante sombre du Sahara avec verres noirs contrastants. Style contemporain et intemporel. Protection UV400.',
      shortDescription: 'Variante sombre, verres noirs, style contemporain. UV400.',
      images: ['/images/products/W4959S-C4.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.UNISEX,
      colors: [{ name: 'Noir / Fumé', hex: '#1A1A1A', image: '/images/products/W4959S-C4.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'mixte', 'noir', 'uv400'],
      specifications: specSoleil, stock: 14, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'terra-w4961s-c2', sku: 'W4961S-C2',
      name: 'Terra',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 285, compareAtPrice: 395,
      description: 'Monture écaille aux tons terreux avec verres marrons. Ancrage naturel et élégance discrète. Protection UV400.',
      shortDescription: 'Écaille terreux, verres marrons, élégance naturelle. UV400.',
      images: ['/images/products/W4961S-C2.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.UNISEX,
      colors: [{ name: 'Brun / Marron', hex: '#7B3F00', image: '/images/products/W4961S-C2.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'OBLONG'],
      tags: ['soleil', 'mixte', 'ecaille', 'marron', 'uv400'],
      specifications: specSoleil, stock: 16, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'vertex-w4963s-c1', sku: 'W4963S-C1',
      name: 'Vertex',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 310, compareAtPrice: 430,
      description: 'Design géométrique angulaire avec verres noirs premium. Pour un style moderne et audacieux. Protection UV400.',
      shortDescription: 'Géométrique angulaire, verres noirs premium. UV400.',
      images: ['/images/products/W4963S-C1.jpg'],
      frameShape: FrameShape.GEOMETRIC, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Noir Mat', hex: '#111111', image: '/images/products/W4963S-C1.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'mixte', 'geometrique', 'audacieux', 'uv400'],
      specifications: specSoleil, stock: 11, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'aurora-w4964s-c1', sku: 'W4964S-C1',
      name: 'Aurora',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 320, compareAtPrice: 445,
      description: 'Monture légère aux reflets dorés avec verres miroir multicolores. Spectaculaire et unique. Protection UV400.',
      shortDescription: 'Reflets dorés, verres miroir multicolores, spectaculaire. UV400.',
      images: ['/images/products/W4964S-C1.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.WOMEN,
      colors: [{ name: 'Or / Miroir Multicolore', hex: '#FFD700', image: '/images/products/W4964S-C1.jpg' }],
      lensOptions: lensOptionsMiroir, faceShapeRec: ['OVAL', 'HEART', 'OBLONG'],
      tags: ['soleil', 'femme', 'miroir', 'dore', 'uv400', 'nouveau'],
      specifications: { ...specSoleil, traitement: 'Miroir multicolore' }, stock: 10, featured: true, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'russet-w4968s-c4', sku: 'W4968S-C4',
      name: 'Russet',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 310, compareAtPrice: 430,
      description: 'Variante rousse du Titan avec verres marrons chauds. Élégance masculine pour les amateurs de tons naturels. Protection UV400.',
      shortDescription: 'Tons roux et marrons chauds, élégance naturelle. UV400.',
      images: ['/images/products/W4968S-C4.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.MEN,
      colors: [{ name: 'Roux / Marron', hex: '#80461B', image: '/images/products/W4968S-C4.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['soleil', 'homme', 'marron', 'chaud', 'uv400'],
      specifications: specSoleil, stock: 15, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },
    {
      slug: 'canyon-w4969s-c4', sku: 'W4969S-C4',
      name: 'Canyon',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 295, compareAtPrice: 410,
      description: 'Monture aux reflets dorés rosés avec verres teintés. Un mariage harmonieux de chaleur et de sophistication. Protection UV400.',
      shortDescription: 'Or rosé, verres teintés, sophistication douce. UV400.',
      images: ['/images/products/W4969S-C4.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.WOMEN,
      colors: [{ name: 'Or Rosé / Ambre', hex: '#E8A598', image: '/images/products/W4969S-C4.jpg' }],
      lensOptions: lensOptionsSoleil, faceShapeRec: ['OVAL', 'HEART', 'ROUND'],
      tags: ['soleil', 'femme', 'or-rose', 'chaud', 'uv400'],
      specifications: specSoleil, stock: 13, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },

    // ════════════════════════════════════════════════════════════════════════
    // LUNETTES DE SOLEIL — HOMMES
    // ════════════════════════════════════════════════════════════════════════
    {
      slug: 'titan-bleu-w4968s-c2', sku: 'W4968S-C2',
      name: 'Titan Bleu',
      brand: 'Wooby Eyewear', category: ProductCategory.SUNGLASSES,
      price: 310, compareAtPrice: 430,
      description: 'Version bleu nuit du Titan avec verres miroir haute réflectivité. Le choix de l\'homme moderne. Protection UV400.',
      shortDescription: 'Carré bleu nuit, verres miroir, style homme moderne. UV400.',
      images: ['/images/products/W4968S-C2.jpg'],
      frameShape: FrameShape.SQUARE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.MEN,
      colors: [{ name: 'Bleu Nuit / Miroir', hex: '#191970', image: '/images/products/W4968S-C2.jpg' }],
      lensOptions: lensOptionsMiroir, faceShapeRec: ['OVAL', 'ROUND', 'HEART', 'OBLONG'],
      tags: ['soleil', 'homme', 'carre', 'bleu', 'miroir', 'uv400', 'nouveau'],
      specifications: { ...specSoleil, traitement: 'Miroir' }, stock: 18, featured: true, bestSeller: false, newArrival: true, onSale: true, salePercentage: 28,
    },

    // ════════════════════════════════════════════════════════════════════════
    // LUNETTES DE VUE — W2952E / W2975E (optical, not clip-on)
    // ════════════════════════════════════════════════════════════════════════
    {
      slug: 'elegance-w2952e-c2', sku: 'W2952E-C2',
      name: 'Élégance',
      brand: 'Wooby Eyewear', category: ProductCategory.EYEGLASSES,
      price: 180, compareAtPrice: 260,
      description: 'Lunettes de vue optiques à monture fine et élégante. Légèreté maximale pour un port quotidien sans inconfort. Disponible sur ordonnance.',
      shortDescription: 'Monture fine optique, légèreté maximale, sur ordonnance.',
      images: ['/images/products/W2952E-C2.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Argent / Transparent', hex: '#C0C0C0', image: '/images/products/W2952E-C2.jpg' }],
      lensOptions: [
        { type: 'vue', label: 'Verres Correcteurs', price: 0, features: ['Anti-reflets', 'Anti-UV'] },
        { type: 'vue_progressive', label: 'Verres Progressifs', price: 200, features: ['Anti-reflets', 'Anti-UV', 'Progressif'] },
      ],
      faceShapeRec: ['OVAL', 'SQUARE', 'OBLONG'],
      tags: ['vue', 'optique', 'fin', 'leger'],
      specifications: { verres: 'Sur ordonnance', materiau_monture: 'Métal' }, stock: 20, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 31,
    },
    {
      slug: 'clarity-w2975e-c4', sku: 'W2975E-C4',
      name: 'Clarity',
      brand: 'Wooby Eyewear', category: ProductCategory.EYEGLASSES,
      price: 190, compareAtPrice: 275,
      description: 'Monture optique polyvalente avec une finition premium. Style intemporel qui s\'adapte à tous les visages. Sur ordonnance.',
      shortDescription: 'Optique polyvalente, finition premium, intemporel.',
      images: ['/images/products/W2975E-C4.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.UNISEX,
      colors: [{ name: 'Écaille / Transparent', hex: '#8B6914', image: '/images/products/W2975E-C4.jpg' }],
      lensOptions: [
        { type: 'vue', label: 'Verres Correcteurs', price: 0, features: ['Anti-reflets', 'Anti-UV'] },
        { type: 'vue_progressive', label: 'Verres Progressifs', price: 200, features: ['Anti-reflets', 'Anti-UV', 'Progressif'] },
      ],
      faceShapeRec: ['OVAL', 'HEART', 'OBLONG'],
      tags: ['vue', 'optique', 'ecaille', 'polyvalent'],
      specifications: { verres: 'Sur ordonnance', materiau_monture: 'Acétate' }, stock: 18, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 31,
    },

    // ════════════════════════════════════════════════════════════════════════
    // LUNETTES CLIP-ON
    // ════════════════════════════════════════════════════════════════════════
    {
      slug: 'clip-on-rond-w9934c-c1', sku: 'W9934C-C1',
      name: 'Clip-On Rond',
      brand: 'Wooby Eyewear', category: ProductCategory.EYEGLASSES,
      price: 220, compareAtPrice: 320,
      description: 'Lunettes optiques rondes avec clip solaire amovible. Passez de la correction à la protection en un geste. Légères et confortables.',
      shortDescription: 'Ronde avec clip solaire amovible. 2-en-1 pratique.',
      images: ['/images/products/W9934C-C1.jpg'],
      frameShape: FrameShape.ROUND, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Or / Transparent', hex: '#CFB53B', image: '/images/products/W9934C-C1.jpg' }],
      lensOptions: lensOptionsVue, faceShapeRec: ['OVAL', 'SQUARE', 'OBLONG'],
      tags: ['vue', 'clip-on', 'rond', 'convertible', '2en1'],
      specifications: specVue, stock: 20, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 31,
    },
    {
      slug: 'clip-on-oval-w9942c-c1', sku: 'W9942C-C1',
      name: 'Clip-On Oval',
      brand: 'Wooby Eyewear', category: ProductCategory.EYEGLASSES,
      price: 230, compareAtPrice: 330,
      description: 'Lunettes optiques ovales avec clip solaire amovible. Design intemporel qui s\'adapte à toutes les morphologies.',
      shortDescription: 'Ovale avec clip solaire. Design doux et intemporel.',
      images: ['/images/products/W9942C-C1.jpg'],
      frameShape: FrameShape.OVAL, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Or / Transparent', hex: '#CFB53B', image: '/images/products/W9942C-C1.jpg' }],
      lensOptions: lensOptionsVue, faceShapeRec: ['SQUARE', 'OBLONG', 'HEART'],
      tags: ['vue', 'clip-on', 'ovale', 'convertible', '2en1'],
      specifications: specVue, stock: 15, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 30,
    },
    {
      slug: 'clip-on-slim-w9932c-c2', sku: 'W9932C-C2',
      name: 'Clip-On Slim',
      brand: 'Wooby Eyewear', category: ProductCategory.EYEGLASSES,
      price: 210, compareAtPrice: 300,
      description: 'Monture ultra-fine bicolore avec clip solaire intégré. Or rose et transparent. Légèreté maximale.',
      shortDescription: 'Ultra-fine bicolore, clip solaire. Légèreté maximale.',
      images: ['/images/products/W9932C-C2.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Or Rose / Transparent', hex: '#B76E79', image: '/images/products/W9932C-C2.jpg' }],
      lensOptions: lensOptionsVue, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['vue', 'clip-on', 'fin', 'convertible', '2en1', 'bicolore'],
      specifications: specVue, stock: 25, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 30,
    },
    {
      slug: 'cat-eye-rouge-w9937c-c2', sku: 'W9937C-C2',
      name: 'Cat-Eye Rouge',
      brand: 'Wooby Eyewear', category: ProductCategory.EYEGLASSES,
      price: 245, compareAtPrice: 350,
      description: 'Monture cat-eye rouge bordeaux profond avec clip solaire. Glamour et audacieux. Un look qui ne passe pas inaperçu. Sur ordonnance.',
      shortDescription: 'Cat-eye rouge bordeaux avec clip. Glamour et audacieux.',
      images: ['/images/products/W9937C-C2.jpg'],
      frameShape: FrameShape.CAT_EYE, frameType: FrameType.FULL_RIM, material: FrameMaterial.ACETATE, gender: Gender.WOMEN,
      colors: [{ name: 'Rouge Bordeaux', hex: '#722F37', image: '/images/products/W9937C-C2.jpg' }],
      lensOptions: lensOptionsVue, faceShapeRec: ['OVAL', 'SQUARE', 'OBLONG'],
      tags: ['vue', 'clip-on', 'cat-eye', 'rouge', 'glamour', 'convertible'],
      specifications: specVue, stock: 18, featured: true, bestSeller: false, newArrival: true, onSale: true, salePercentage: 30,
    },
    {
      slug: 'clip-on-metro-w9943c-c1', sku: 'W9943C-C1',
      name: 'Clip-On Métro',
      brand: 'Wooby Eyewear', category: ProductCategory.EYEGLASSES,
      price: 235, compareAtPrice: 335,
      description: 'Lunettes optiques à monture fine avec clip solaire magnétique. Design épuré et urban. Parfait pour la ville.',
      shortDescription: 'Monture fine, clip magnétique, design urban épuré.',
      images: ['/images/products/W9943C-C1.jpg'],
      frameShape: FrameShape.RECTANGLE, frameType: FrameType.FULL_RIM, material: FrameMaterial.METAL, gender: Gender.UNISEX,
      colors: [{ name: 'Noir / Transparent', hex: '#2C2C2C', image: '/images/products/W9943C-C1.jpg' }],
      lensOptions: lensOptionsVue, faceShapeRec: ['OVAL', 'ROUND', 'HEART'],
      tags: ['vue', 'clip-on', 'fin', 'urbain', 'convertible', '2en1'],
      specifications: specVue, stock: 16, featured: false, bestSeller: false, newArrival: true, onSale: true, salePercentage: 30,
    },
  ]

  let count = 0
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { price: p.price, compareAtPrice: p.compareAtPrice, stock: p.stock },
      create: p,
    })
    console.log(`  ✅ ${p.sku.padEnd(13)} ${p.name}`)
    count++
  }

  console.log(`\n🎉 ${count} produits seedés.`)
  console.log('\n📁 Ajoute les images dans: public/images/products/')
  console.log('   → Vérifie tes Téléchargements pour les .jpg de WhatsApp')
  console.log('\n⚠️  Note: WhatsApp Web montre ~31 produits max.')
  console.log('   Pour les 170+ restants, demande à ton frère de te donner la liste complète')
  console.log('   (voir instructions dans le README).')
  console.log('\n🔑 Admin: admin@clicoptique.ma / Admin1234!')
}

main()
  .catch(e => { console.error('❌', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
