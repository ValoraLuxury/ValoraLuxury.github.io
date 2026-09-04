/* =====================================================
   VALORA LUXURY — Shared UI Module
   Header behavior, mobile nav, search overlay, toasts,
   product card rendering, and the quick-view modal.
   Included on every page.
   ===================================================== */

/* ---------- Toasts ---------- */
function showToast(message, icon = '✓') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 320);
  }, 2600);
}

/* ---------- Header scroll state ---------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  const btn = document.querySelector('.hamburger-btn');
  const nav = document.querySelector('.mobile-nav');
  if (!btn || !nav) return;

  const toggle = () => {
    const open = btn.classList.toggle('open');
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  btn.addEventListener('click', toggle);
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    })
  );
}

/* ---------- Search overlay ---------- */
function initSearch() {
  const triggers = document.querySelectorAll('[data-search-trigger]');
  const overlay = document.querySelector('.search-overlay');
  if (!overlay) return;
  const input = overlay.querySelector('input');
  const closeBtn = overlay.querySelector('.search-close');
  const resultsEl = overlay.querySelector('.search-results');

  const open = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input && input.focus(), 100);
  };
  const close = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (resultsEl) resultsEl.innerHTML = '';
  };

  triggers.forEach((t) => t.addEventListener('click', open));
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  if (input) {
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!resultsEl) return;
      if (q.length < 2) {
        resultsEl.innerHTML = '';
        return;
      }
      const matches = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      ).slice(0, 6);

      if (matches.length === 0) {
        resultsEl.innerHTML = `<p>No results for "${input.value}". Try another search term.</p>`;
        return;
      }

      resultsEl.innerHTML = matches
        .map(
          (p) => `
        <a href="product.html?id=${p.id}" class="search-result-item">
          <img src="${p.image}" alt="${p.name}" class="search-result-img" />
          <span>${p.name} — ${formatPrice(p.salePrice || p.price)}</span>
        </a>`
        )
        .join('');
    });
  }
}

/* ---------- Scroll reveal animations ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.fade-up, .fade-in');
  if (!targets.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach((t) => io.observe(t));
}

/* ---------- Product Card Rendering (shared across pages) ---------- */
function renderProductCard(product) {
  const isWishlisted = typeof Wishlist !== 'undefined' && Wishlist.has(product.id);
  const badge = product.isNew
    ? '<span class="badge badge--new">New</span>'
    : product.salePrice
    ? '<span class="badge badge--sale">Sale</span>'
    : '';

  return `
  <div class="product-card fade-up" data-product-id="${product.id}">
    <div class="product-card-media">
      <a href="product.html?id=${product.id}" aria-label="View ${product.name}">
        <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy" />
        <img src="${product.hoverImage}" alt="" class="product-card-img-alt" loading="lazy" />
      </a>
      <div class="product-card-badges">${badge}</div>
      <div class="product-card-actions">
        <button class="product-action-btn wishlist-toggle ${isWishlisted ? 'wishlisted' : ''}" data-id="${product.id}" aria-label="Add to wishlist" title="Add to wishlist">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <button class="product-action-btn quick-view-trigger" data-id="${product.id}" aria-label="Quick view" title="Quick view">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
    </div>
    <div class="product-card-body">
      <div class="product-card-category">${CATEGORY_LABELS[product.category] || product.category}</div>
      <h3 class="product-card-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <div class="product-card-pricing">
        <span class="price-current">${formatPrice(product.salePrice || product.price)}</span>
        ${product.salePrice ? `<span class="price-original">${formatPrice(product.price)}</span>` : ''}
      </div>
      <div class="product-card-cta">
        <button class="btn btn--outline btn--full add-to-cart-quick" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

/* Wire up events for a container holding rendered product cards */
function wireProductCardEvents(container) {
  container.querySelectorAll('.wishlist-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const nowWishlisted = Wishlist.toggle(id);
      btn.classList.toggle('wishlisted', nowWishlisted);
      btn.querySelector('svg').setAttribute('fill', nowWishlisted ? 'currentColor' : 'none');
      showToast(nowWishlisted ? 'Added to wishlist' : 'Removed from wishlist', nowWishlisted ? '♡' : '—');
    });
  });

  container.querySelectorAll('.add-to-cart-quick').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = getProductById(btn.dataset.id);
      if (!product) return;
      Cart.addItem(product, {
        color: product.colors[0] ? product.colors[0].name : '',
        size: product.sizes[0] || '',
        qty: 1,
      });
      showToast(`${product.name} added to cart`);
    });
  });

  container.querySelectorAll('.quick-view-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuickView(btn.dataset.id);
    });
  });
}

/* ---------- Quick View Modal ---------- */
function ensureQuickViewModal() {
  let modal = document.querySelector('.quick-view-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.className = 'quick-view-modal';
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-inner">
      <button class="modal-close" aria-label="Close quick view">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="modal-image-side"><img alt="" /></div>
      <div class="modal-content-side"></div>
    </div>`;
  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click', closeQuickView);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeQuickView);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuickView();
  });

  return modal;
}

function closeQuickView() {
  const modal = document.querySelector('.quick-view-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openQuickView(id) {
  const product = getProductById(id);
  if (!product) return;
  const modal = ensureQuickViewModal();

  modal.querySelector('.modal-image-side img').src = product.image;
  modal.querySelector('.modal-image-side img').alt = product.name;

  const isWishlisted = Wishlist.has(product.id);

  modal.querySelector('.modal-content-side').innerHTML = `
    <div class="product-category-tag">${CATEGORY_LABELS[product.category] || product.category}</div>
    <h2 class="product-full-title" style="font-size: 1.75rem;">${product.name}</h2>
    <div class="product-pricing-area">
      <span class="product-price-current" style="font-size:1.5rem;">${formatPrice(product.salePrice || product.price)}</span>
      ${product.salePrice ? `<span class="product-price-original">${formatPrice(product.price)}</span>` : ''}
    </div>
    <p style="font-size:var(--text-sm); color:var(--color-stone); line-height:1.8;">${product.description}</p>
    <div class="product-cta-row">
      <button class="btn btn--primary btn--full modal-add-cart" data-id="${product.id}">Add to Cart</button>
      <button class="btn btn--outline modal-wishlist ${isWishlisted ? 'wishlisted' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
    </div>
    <a href="product.html?id=${product.id}" style="font-size:var(--text-xs); letter-spacing:0.12em; text-transform:uppercase; color:var(--color-champagne); border-bottom:1px solid var(--color-champagne); width:fit-content; padding-bottom:2px;">View Full Details →</a>
  `;

  modal.querySelector('.modal-add-cart').addEventListener('click', () => {
    Cart.addItem(product, {
      color: product.colors[0] ? product.colors[0].name : '',
      size: product.sizes[0] || '',
      qty: 1,
    });
    showToast(`${product.name} added to cart`);
  });

  modal.querySelector('.modal-wishlist').addEventListener('click', (e) => {
    const nowWishlisted = Wishlist.toggle(product.id);
    e.currentTarget.classList.toggle('wishlisted', nowWishlisted);
    showToast(nowWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
  });

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ---------- Newsletter form (no backend — demo only) ---------- */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim()) {
        showToast('Thank you for subscribing');
        input.value = '';
      }
    });
  });
}

/* ---------- Init everything shared ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initSearch();
  initScrollReveal();
  initNewsletter();
});
