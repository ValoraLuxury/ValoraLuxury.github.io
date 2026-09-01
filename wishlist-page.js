/* =====================================================
   VALORA LUXURY — Wishlist Page Logic
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-wishlist-page]');
  if (!root) return;

  const grid = document.querySelector('[data-wishlist-grid]');
  const emptyState = document.querySelector('[data-wishlist-empty]');
  const countEl = document.querySelector('[data-wishlist-page-count]');

  function render() {
    const ids = Wishlist.getIds();
    const items = ids.map((id) => getProductById(id)).filter(Boolean);

    if (countEl) countEl.textContent = `${items.length} ${items.length === 1 ? 'Piece' : 'Pieces'} Saved`;

    if (items.length === 0) {
      if (grid) grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (grid) grid.style.display = '';
    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = items.map(renderProductCard).join('');
    wireProductCardEvents(grid);

    /* Re-render whenever an item is removed via the heart toggle */
    grid.querySelectorAll('.wishlist-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        setTimeout(render, 50);
      });
    });

    initScrollReveal();
  }

  render();
});
