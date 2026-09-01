/* =====================================================
   VALORA LUXURY — Homepage Logic
   Renders featured products into the homepage grid.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-featured-grid]');
  if (!grid) return;

  const featured = PRODUCTS.slice(0, 8);
  grid.innerHTML = featured.map(renderProductCard).join('');
  wireProductCardEvents(grid);
});
