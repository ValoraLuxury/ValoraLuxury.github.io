/* =====================================================
   VALORA LUXURY — Product Page Logic
   Reads ?id= from the URL, renders gallery, variants,
   quantity selector, tabs, and related products.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-product-page]');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = id ? getProductById(id) : PRODUCTS[0];

  if (!product) {
    root.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state-title">Product not found</h3>
        <p class="empty-state-body">The item you're looking for may have been removed.</p>
        <a href="shop.html" class="btn btn--primary">Back to Shop</a>
      </div>`;
    return;
  }

  document.title = `${product.name} — VALORA LUXURY`;

  let selectedColor = product.colors[0] ? product.colors[0].name : '';
  let selectedSize = product.sizes[0] || '';
  let qty = 1;
  let activeImage = 0;

  /* --- Breadcrumb --- */
  const breadcrumb = document.querySelector('[data-breadcrumb]');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="index.html">Home</a><span>/</span>
      <a href="shop.html?category=${product.category}">${CATEGORY_LABELS[product.category]}</a><span>/</span>
      <span style="color:var(--color-obsidian);">${product.name}</span>`;
  }

  /* --- Gallery --- */
  const mainImg = document.querySelector('[data-gallery-main] img');
  const thumbsWrap = document.querySelector('[data-gallery-thumbs]');

  function renderGallery() {
    if (mainImg) {
      mainImg.src = product.images[activeImage];
      mainImg.alt = product.name;
    }
    if (thumbsWrap) {
      thumbsWrap.innerHTML = product.images
        .map(
          (img, i) => `
        <div class="gallery-thumb ${i === activeImage ? 'active' : ''}" data-thumb-index="${i}">
          <img src="${img}" alt="${product.name} view ${i + 1}" loading="lazy" />
        </div>`
        )
        .join('');
      thumbsWrap.querySelectorAll('.gallery-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          activeImage = Number(thumb.dataset.thumbIndex);
          renderGallery();
        });
      });
    }
  }
  renderGallery();

  /* --- Title / Price / Category --- */
  const setText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };
  setText('[data-product-category]', CATEGORY_LABELS[product.category]);
  setText('[data-product-title]', product.name);

  const priceCurrentEl = document.querySelector('[data-price-current]');
  const priceOriginalEl = document.querySelector('[data-price-original]');
  const priceSaveEl = document.querySelector('[data-price-save]');
  if (priceCurrentEl) priceCurrentEl.textContent = formatPrice(product.salePrice || product.price);
  if (product.salePrice) {
    if (priceOriginalEl) {
      priceOriginalEl.textContent = formatPrice(product.price);
      priceOriginalEl.style.display = '';
    }
    if (priceSaveEl) {
      const pct = Math.round(100 - (product.salePrice / product.price) * 100);
      priceSaveEl.textContent = `Save ${pct}%`;
      priceSaveEl.style.display = '';
    }
  } else {
    if (priceOriginalEl) priceOriginalEl.style.display = 'none';
    if (priceSaveEl) priceSaveEl.style.display = 'none';
  }

  /* --- Description (may appear in more than one place on the page) --- */
  document.querySelectorAll('[data-product-description]').forEach((el) => {
    el.textContent = product.description;
  });

  /* --- Color Variants --- */
  const colorGroup = document.querySelector('[data-color-group]');
  if (colorGroup) {
    if (product.colors.length === 0) {
      colorGroup.style.display = 'none';
    } else {
      colorGroup.querySelector('.variant-selected').textContent = selectedColor;
      const optionsWrap = colorGroup.querySelector('.variant-options');
      optionsWrap.innerHTML = product.colors
        .map(
          (c, i) => `
        <button class="color-swatch ${i === 0 ? 'active' : ''}" style="background:${c.hex};" data-color="${c.name}" aria-label="${c.name}" title="${c.name}"></button>`
        )
        .join('');
      optionsWrap.querySelectorAll('.color-swatch').forEach((btn) => {
        btn.addEventListener('click', () => {
          selectedColor = btn.dataset.color;
          optionsWrap.querySelectorAll('.color-swatch').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          colorGroup.querySelector('.variant-selected').textContent = selectedColor;
        });
      });
    }
  }

  /* --- Size Variants --- */
  const sizeGroup = document.querySelector('[data-size-group]');
  if (sizeGroup) {
    if (product.sizes.length === 0) {
      sizeGroup.style.display = 'none';
    } else {
      sizeGroup.querySelector('.variant-selected').textContent = selectedSize;
      const optionsWrap = sizeGroup.querySelector('.variant-options');
      optionsWrap.innerHTML = product.sizes
        .map(
          (s, i) => `<button class="variant-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`
        )
        .join('');
      optionsWrap.querySelectorAll('.variant-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          selectedSize = btn.dataset.size;
          optionsWrap.querySelectorAll('.variant-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          sizeGroup.querySelector('.variant-selected').textContent = selectedSize;
        });
      });
    }
  }

  /* --- Quantity Selector --- */
  const qtyValueEl = document.querySelector('[data-qty-value]');
  const qtyDecBtn = document.querySelector('[data-qty-dec]');
  const qtyIncBtn = document.querySelector('[data-qty-inc]');

  function syncQty() {
    if (qtyValueEl) qtyValueEl.value = qty;
  }
  if (qtyDecBtn) qtyDecBtn.addEventListener('click', () => { qty = Math.max(1, qty - 1); syncQty(); });
  if (qtyIncBtn) qtyIncBtn.addEventListener('click', () => { qty = Math.min(product.stock || 10, qty + 1); syncQty(); });
  if (qtyValueEl) {
    qtyValueEl.addEventListener('change', () => {
      const v = parseInt(qtyValueEl.value, 10);
      qty = isNaN(v) || v < 1 ? 1 : Math.min(product.stock || 10, v);
      syncQty();
    });
  }
  syncQty();

  /* --- Add to Cart / Buy Now / Wishlist --- */
  const addCartBtn = document.querySelector('[data-add-to-cart]');
  const buyNowBtn = document.querySelector('[data-buy-now]');
  const wishlistBtn = document.querySelector('[data-product-wishlist]');

  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      Cart.addItem(product, { color: selectedColor, size: selectedSize, qty });
      showToast(`${product.name} added to cart`);
    });
  }
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      Cart.addItem(product, { color: selectedColor, size: selectedSize, qty });
      window.location.href = 'checkout.html';
    });
  }
  if (wishlistBtn) {
    const syncWishlistBtn = () => {
      const active = Wishlist.has(product.id);
      wishlistBtn.classList.toggle('wishlisted', active);
      wishlistBtn.querySelector('svg').setAttribute('fill', active ? 'currentColor' : 'none');
    };
    syncWishlistBtn();
    wishlistBtn.addEventListener('click', () => {
      Wishlist.toggle(product.id);
      syncWishlistBtn();
      showToast(Wishlist.has(product.id) ? 'Added to wishlist' : 'Removed from wishlist');
    });
  }

  /* --- Specs Table --- */
  const specsBody = document.querySelector('[data-specs-body]');
  if (specsBody) {
    specsBody.innerHTML = Object.entries(product.specs)
      .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
      .join('');
  }

  /* --- Tabs --- */
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      tabTriggers.forEach((t) => t.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));
      trigger.classList.add('active');
      document.querySelector(`[data-tab-panel="${trigger.dataset.tabTrigger}"]`).classList.add('active');
    });
  });

  /* --- Related Products --- */
  const relatedGrid = document.querySelector('[data-related-grid]');
  if (relatedGrid) {
    const related = getRelatedProducts(product, 4);
    if (related.length === 0) {
      relatedGrid.closest('.section-products').style.display = 'none';
    } else {
      relatedGrid.innerHTML = related.map(renderProductCard).join('');
      wireProductCardEvents(relatedGrid);
    }
  }

  initScrollReveal();
});
