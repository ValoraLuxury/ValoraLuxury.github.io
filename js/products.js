/* =====================================================
   VALORA LUXURY — Product Data
   -----------------------------------------------------
   Replace the objects in the PRODUCTS array with your
   real catalogue. Each product's `image` / `images` and
   `thumb` fields currently point to generated SVG
   placeholders (see generatePlaceholder below) so the
   site is fully functional without real photography.

   TO ADD YOUR OWN PRODUCTS / IMAGES:
   1. Put your photos in the /images/products/ folder.
   2. Replace the `image`, `hoverImage` and `images` array
      values below with real paths, e.g.
      image: "images/products/aria-sunglasses-1.jpg"
   3. Keep the field names and structure identical so the
      rest of the site (cart, wishlist, filters, product
      page) continues to work without any other changes.
   ===================================================== */

/**
 * Generates an elegant SVG placeholder image as a data URI.
 * Used until real product photography is added.
 */
function generatePlaceholder(label, category, tone = 0) {
  const tones = [
    ['#1a1714', '#2a241e'],
    ['#1c1c1c', '#0d0d0d'],
    ['#1e1c18', '#12100d'],
    ['#151414', '#1f1d1b'],
    ['#181616', '#0f0e0d'],
  ];
  const [c1, c2] = tones[tone % tones.length];
  const initials = label
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="600" height="750" fill="url(#g)"/>
      <rect x="40" y="40" width="520" height="670" fill="none" stroke="#c9a96e" stroke-opacity="0.18" stroke-width="1"/>
      <text x="300" y="355" font-family="Georgia, serif" font-size="72" fill="#c9a96e" fill-opacity="0.35" text-anchor="middle" font-style="italic">${initials}</text>
      <text x="300" y="400" font-family="Helvetica, sans-serif" font-size="15" letter-spacing="4" fill="#e8e4de" fill-opacity="0.35" text-anchor="middle">${category.toUpperCase()}</text>
    </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

const CATEGORY_LABELS = {
  eyewear: 'Eyewear',
  watches: 'Watches',
  bags: 'Bags',
  fashion: 'Fashion',
  footwear: 'Footwear',
  accessories: 'Accessories',
};

/* Each product: id, name, category, price (INR), salePrice (optional),
   isNew, images[], colors[], sizes[], description, specs{}, stock */
const PRODUCTS = [
  {
    id: 'val-001',
    name: 'Aria Cat-Eye Sunglasses',
    category: 'eyewear',
    price: 18500,
    salePrice: null,
    isNew: true,
    rating: 4.8,
    colors: [
      { name: 'Obsidian', hex: '#1a1a1a' },
      { name: 'Tortoise', hex: '#6b4a2f' },
    ],
    sizes: [],
    description:
      'A refined cat-eye silhouette crafted from hand-polished acetate, finished with champagne-gold hardware. Designed for a face-flattering fit with UV400 protection.',
    specs: {
      Material: 'Italian acetate, gold-tone hardware',
      Lens: 'UV400 polarized',
      'Frame Width': '138mm',
      Origin: 'Made in Italy',
      Care: 'Store in provided case, avoid extreme heat',
    },
    stock: 12,
    tone: 0,
  },
  {
    id: 'val-002',
    name: 'Meridian Aviator Sunglasses',
    category: 'eyewear',
    price: 16200,
    salePrice: 12950,
    isNew: false,
    rating: 4.6,
    colors: [
      { name: 'Gunmetal', hex: '#3a3a3a' },
      { name: 'Gold', hex: '#c9a96e' },
    ],
    sizes: [],
    description:
      'The classic aviator, reimagined with a slimmer profile and gradient smoke lenses. A timeless companion for every season.',
    specs: {
      Material: 'Stainless steel frame',
      Lens: 'Gradient UV400',
      'Frame Width': '142mm',
      Origin: 'Made in Italy',
      Care: 'Clean with microfiber cloth only',
    },
    stock: 8,
    tone: 1,
  },
  {
    id: 'val-003',
    name: 'Sterling Automatic Watch',
    category: 'watches',
    price: 68500,
    salePrice: null,
    isNew: true,
    rating: 4.9,
    colors: [
      { name: 'Silver', hex: '#c0c0c0' },
      { name: 'Black', hex: '#1a1a1a' },
    ],
    sizes: ['38mm', '42mm'],
    description:
      'A precision automatic movement housed in a brushed stainless steel case with a sapphire crystal face. Understated luxury for the discerning wrist.',
    specs: {
      Movement: 'Swiss automatic, 42-hour reserve',
      Case: '316L stainless steel, sapphire crystal',
      'Water Resistance': '100m',
      Strap: 'Genuine leather / steel bracelet options',
      Warranty: '2 years international',
    },
    stock: 5,
    tone: 2,
  },
  {
    id: 'val-004',
    name: 'Regent Chronograph Watch',
    category: 'watches',
    price: 82000,
    salePrice: 71800,
    isNew: false,
    rating: 4.7,
    colors: [{ name: 'Rose Gold', hex: '#b8896f' }],
    sizes: ['40mm', '44mm'],
    description:
      'A chronograph built for precision and presence, with a champagne dial and rose-gold finishing. Tracks time with quiet authority.',
    specs: {
      Movement: 'Quartz chronograph',
      Case: 'Rose-gold plated stainless steel',
      'Water Resistance': '50m',
      Strap: 'Calfskin leather',
      Warranty: '2 years international',
    },
    stock: 6,
    tone: 1,
  },
  {
    id: 'val-005',
    name: 'Aveline Structured Tote',
    category: 'bags',
    price: 42500,
    salePrice: null,
    isNew: true,
    rating: 4.8,
    colors: [
      { name: 'Ivory', hex: '#e8e4de' },
      { name: 'Obsidian', hex: '#1a1a1a' },
      { name: 'Camel', hex: '#b08b5f' },
    ],
    sizes: [],
    description:
      'Full-grain leather tote with a structured silhouette and hand-stitched edges. Interior organized with a zip pocket and card slots.',
    specs: {
      Material: 'Full-grain calfskin leather',
      Dimensions: '38 x 28 x 14 cm',
      Interior: 'Suede lining, 1 zip pocket, 2 card slots',
      Hardware: 'Champagne-gold finish',
      Origin: 'Handcrafted in India',
    },
    stock: 9,
    tone: 3,
  },
  {
    id: 'val-006',
    name: 'Noir Quilted Crossbody',
    category: 'bags',
    price: 29800,
    salePrice: 23800,
    isNew: false,
    rating: 4.5,
    colors: [{ name: 'Obsidian', hex: '#1a1a1a' }, { name: 'Burgundy', hex: '#5c2a2a' }],
    sizes: [],
    description:
      'A diamond-quilted crossbody with a detachable chain strap. Compact, versatile, and finished with signature gold hardware.',
    specs: {
      Material: 'Quilted lambskin leather',
      Dimensions: '22 x 16 x 7 cm',
      Interior: 'Satin lining, 1 slip pocket',
      Hardware: 'Gold-tone chain strap',
      Origin: 'Handcrafted in India',
    },
    stock: 11,
    tone: 0,
  },
  {
    id: 'val-007',
    name: 'Belmont Tailored Blazer',
    category: 'fashion',
    price: 24500,
    salePrice: null,
    isNew: true,
    rating: 4.7,
    colors: [{ name: 'Charcoal', hex: '#2e2e2e' }, { name: 'Ivory', hex: '#e8e4de' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'A precisely tailored blazer in Italian wool-blend, cut for a modern silhouette. Fully lined with horn-effect buttons.',
    specs: {
      Material: '78% Wool, 20% Polyester, 2% Elastane',
      Fit: 'Tailored, single-breasted',
      Lining: 'Full satin lining',
      Care: 'Dry clean only',
      Origin: 'Made in India',
    },
    stock: 14,
    tone: 2,
  },
  {
    id: 'val-008',
    name: 'Solene Silk Wrap Dress',
    category: 'fashion',
    price: 19800,
    salePrice: 15800,
    isNew: false,
    rating: 4.6,
    colors: [{ name: 'Champagne', hex: '#e8d5a3' }, { name: 'Obsidian', hex: '#1a1a1a' }],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'A fluid silk wrap dress that drapes with quiet elegance. Finished with a self-tie waist and a bias-cut hem.',
    specs: {
      Material: '100% Mulberry silk',
      Fit: 'Wrap silhouette, bias-cut hem',
      Care: 'Dry clean recommended',
      Origin: 'Made in India',
    },
    stock: 10,
    tone: 3,
  },
  {
    id: 'val-009',
    name: 'Halden Leather Loafers',
    category: 'footwear',
    price: 21500,
    salePrice: null,
    isNew: true,
    rating: 4.8,
    colors: [{ name: 'Cognac', hex: '#8a5a34' }, { name: 'Obsidian', hex: '#1a1a1a' }],
    sizes: ['6', '7', '8', '9', '10', '11'],
    description:
      'Hand-lasted penny loafers in burnished full-grain leather with a leather sole. A staple for the considered wardrobe.',
    specs: {
      Material: 'Full-grain leather, leather sole',
      Construction: 'Goodyear-welted',
      Fit: 'True to size',
      Origin: 'Handcrafted in India',
    },
    stock: 13,
    tone: 4,
  },
  {
    id: 'val-010',
    name: 'Vesna Block Heel Sandals',
    category: 'footwear',
    price: 15800,
    salePrice: 12600,
    isNew: false,
    rating: 4.4,
    colors: [{ name: 'Ivory', hex: '#e8e4de' }, { name: 'Gold', hex: '#c9a96e' }],
    sizes: ['5', '6', '7', '8', '9'],
    description:
      'Minimalist block-heel sandals in metallic leather, designed for all-day comfort without compromising on refinement.',
    specs: {
      Material: 'Metallic leather upper',
      'Heel Height': '6.5cm',
      Sole: 'Cushioned leather sole',
      Origin: 'Handcrafted in India',
    },
    stock: 7,
    tone: 1,
  },
  {
    id: 'val-011',
    name: 'Camille Silk Scarf',
    category: 'accessories',
    price: 8900,
    salePrice: null,
    isNew: true,
    rating: 4.9,
    colors: [{ name: 'Champagne', hex: '#e8d5a3' }, { name: 'Obsidian', hex: '#1a1a1a' }],
    sizes: [],
    description:
      'A hand-rolled silk twill scarf in an original abstract print, exclusive to VALORA LUXURY. Versatile as neckwear, hair accessory, or bag charm.',
    specs: {
      Material: '100% Silk twill',
      Dimensions: '90 x 90 cm',
      Finish: 'Hand-rolled edges',
      Origin: 'Made in India',
    },
    stock: 20,
    tone: 2,
  },
  {
    id: 'val-012',
    name: 'Ondine Leather Belt',
    category: 'accessories',
    price: 7400,
    salePrice: 5900,
    isNew: false,
    rating: 4.5,
    colors: [{ name: 'Obsidian', hex: '#1a1a1a' }, { name: 'Cognac', hex: '#8a5a34' }],
    sizes: ['S', 'M', 'L'],
    description:
      'A refined leather belt with a brushed gold-tone buckle, designed to anchor both tailored and casual silhouettes.',
    specs: {
      Material: 'Full-grain leather',
      Buckle: 'Brushed gold-tone finish',
      Width: '3.2cm',
      Origin: 'Made in India',
    },
    stock: 18,
    tone: 0,
  },
];

/* Attach generated placeholder images to each product */
PRODUCTS.forEach((p) => {
  const label = CATEGORY_LABELS[p.category] || p.category;
  p.image = generatePlaceholder(p.name, label, p.tone);
  p.hoverImage = generatePlaceholder(p.name + ' alt', label, p.tone + 1);
  p.images = [
    generatePlaceholder(p.name, label, p.tone),
    generatePlaceholder(p.name + ' detail', label, p.tone + 1),
    generatePlaceholder(p.name + ' angle', label, p.tone + 2),
    generatePlaceholder(p.name + ' worn', label, p.tone + 3),
  ];
});

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getRelatedProducts(product, count = 4) {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, count);
}

function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}
