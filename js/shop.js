/* =====================================================
   VALORA LUXURY — Shop Page Logic
   Filtering by category / price / availability / new,
   sorting, text search, and rendering the product grid.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-shop-grid]');
  if (!grid) return;

  const resultsCountEl = document.querySelector('[data-results-count]');
  const sortSelect = document.querySelector('[data-sort-select]');
  const shopSearchInput = document.querySelector('[data-shop-search]');
  const categoryOptions = document.querySelectorAll('[data-filter-category]');
  const availabilityOptions = document.querySelectorAll('[data-filter-availability]');
  const newArrivalsOption = document.querySelector('[data-filter-new]');
  const priceMinInput = document.querySelector('[data-price-min]');
  const priceMaxInput = document.querySelector('[data-price-max]');
  const clearFiltersBtn = document.querySelector('[data-clear-filters]');
  const mobileFilterBtn = document.querySelector('[data-mobile-filter-toggle]');
  const filtersSidebar = document.querySelector('.filters-sidebar');

  const state = {
    categories: new Set(),
    availability: new Set(),
    newOnly: false,
    priceMin: null,
    priceMax: null,
    search: '',
    sort: 'featured',
  };

  /* Pre-select category from URL, e.g. shop.html?category=eyewear */
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get('category');
  if (urlCategory) state.categories.add(urlCategory);
  const urlSearch = params.get('search');
  if (urlSearch) state.search = urlSearch;

  function syncFilterUI() {
    categoryOptions.forEach((el) => {
      el.classList.toggle('active', state.categories.has(el.dataset.filterCategory));
    });
    availabilityOptions.forEach((el) => {
      el.classList.toggle('active', state.availability.has(el.dataset.filterAvailability));
    });
    if (newArrivalsOption) newArrivalsOption.classList.toggle('active', state.newOnly);
    if (shopSearchInput) shopSearchInput.value = state.search;
  }

  function applyFilters() {
    let results = PRODUCTS.slice();

    if (state.categories.size > 0) {
      results = results.filter((p) => state.categories.has(p.category));
    }

    if (state.availability.size > 0) {
      results = results.filter((p) => {
        const isInStock = p.stock > 0;
        if (state.availability.has('in-stock') && !isInStock) return false;
        if (state.availability.has('out-of-stock') && isInStock) return false;
        return true;
      });
    }

    if (state.newOnly) {
      results = results.filter((p) => p.isNew);
    }

    if (state.priceMin !== null && !isNaN(state.priceMin)) {
      results = results.filter((p) => (p.salePrice || p.price) >= state.priceMin);
    }
    if (state.priceMax !== null && !isNaN(state.priceMax)) {
      results = results.filter((p) => (p.salePrice || p.price) <= state.priceMax);
    }

    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (state.sort) {
      case 'newest':
        results = results.slice().sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
        break;
      case 'price-low':
        results = results.slice().sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        results = results.slice().sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      default:
        break; // featured = default order
    }

    render(results);
  }

  function render(results) {
    if (resultsCountEl) {
      resultsCountEl.textContent = `${results.length} ${results.length === 1 ? 'Piece' : 'Pieces'}`;
    }

    if (results.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3 class="empty-state-title">No pieces found</h3>
          <p class="empty-state-body">Try adjusting your filters or search terms.</p>
          <button class="btn btn--outline" data-clear-filters-inline>Clear All Filters</button>
        </div>`;
      const inlineBtn = grid.querySelector('[data-clear-filters-inline]');
      if (inlineBtn) inlineBtn.addEventListener('click', clearFilters);
      return;
    }

    grid.innerHTML = results.map(renderProductCard).join('');
    wireProductCardEvents(grid);
    initScrollReveal();
  }

  function clearFilters() {
    state.categories.clear();
    state.availability.clear();
    state.newOnly = false;
    state.priceMin = null;
    state.priceMax = null;
    state.search = '';
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';
    syncFilterUI();
    applyFilters();
  }

  categoryOptions.forEach((el) => {
    el.addEventListener('click', () => {
      const cat = el.dataset.filterCategory;
      state.categories.has(cat) ? state.categories.delete(cat) : state.categories.add(cat);
      syncFilterUI();
      applyFilters();
    });
  });

  availabilityOptions.forEach((el) => {
    el.addEventListener('click', () => {
      const val = el.dataset.filterAvailability;
      state.availability.has(val) ? state.availability.delete(val) : state.availability.add(val);
      syncFilterUI();
      applyFilters();
    });
  });

  if (newArrivalsOption) {
    newArrivalsOption.addEventListener('click', () => {
      state.newOnly = !state.newOnly;
      syncFilterUI();
      applyFilters();
    });
  }

  if (priceMinInput) {
    priceMinInput.addEventListener('input', () => {
      state.priceMin = priceMinInput.value ? Number(priceMinInput.value) : null;
      applyFilters();
    });
  }
  if (priceMaxInput) {
    priceMaxInput.addEventListener('input', () => {
      state.priceMax = priceMaxInput.value ? Number(priceMaxInput.value) : null;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      applyFilters();
    });
  }

  if (shopSearchInput) {
    shopSearchInput.addEventListener('input', () => {
      state.search = shopSearchInput.value;
      applyFilters();
    });
  }

  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);

  if (mobileFilterBtn && filtersSidebar) {
    mobileFilterBtn.addEventListener('click', () => {
      filtersSidebar.classList.toggle('open');
    });
  }

  /* Collapsible filter groups */
  document.querySelectorAll('.filter-group-title').forEach((title) => {
    title.addEventListener('click', () => {
      title.closest('.filter-group').classList.toggle('collapsed');
    });
  });

  syncFilterUI();
  applyFilters();
});
