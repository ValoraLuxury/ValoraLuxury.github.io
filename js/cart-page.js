/* =====================================================
   VALORA LUXURY — Cart Page Logic
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-cart-page]');
  if (!root) return;

  const itemsWrap = document.querySelector('[data-cart-items]');
  const emptyState = document.querySelector('[data-cart-empty]');
  const cartLayout = document.querySelector('.cart-layout');
  const subtotalEl = document.querySelector('[data-cart-subtotal]');
  const shippingEl = document.querySelector('[data-cart-shipping]');
  const totalEl = document.querySelector('[data-cart-total]');
  const itemCountEl = document.querySelector('[data-cart-item-count]');

  const FREE_SHIPPING_THRESHOLD = 15000;
  const SHIPPING_FEE = 500;

  function render() {
    const items = Cart.getItems();

    if (items.length === 0) {
      if (cartLayout) cartLayout.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    if (cartLayout) cartLayout.style.display = '';
    if (emptyState) emptyState.style.display = 'none';

    itemsWrap.innerHTML = items
      .map((item) => {
        const product = getProductById(item.id);
        const img = product ? product.image : item.image;
        return `
        <div class="cart-item" data-key="${item.id}::${item.color}::${item.size}">
          <div class="cart-item-product">
            <img src="${img}" alt="${item.name}" class="cart-item-img" />
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-variant">${[item.color, item.size].filter(Boolean).join(' / ') || 'Standard'}</div>
            </div>
          </div>
          <div class="cart-price">${formatPrice(item.price)}</div>
          <div class="cart-qty-control">
            <button class="cart-qty-btn" data-cart-dec>−</button>
            <input type="text" class="cart-qty-value" value="${item.qty}" readonly />
            <button class="cart-qty-btn" data-cart-inc>+</button>
          </div>
          <div class="cart-price">${formatPrice(item.price * item.qty)}</div>
          <button class="cart-remove-btn" data-cart-remove aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>`;
      })
      .join('');

    wireItemEvents();
    renderSummary(items);
  }

  function renderSummary(items) {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;
    const count = items.reduce((s, i) => s + i.qty, 0);

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Complimentary' : formatPrice(shipping);
    if (totalEl) totalEl.textContent = formatPrice(total);
    if (itemCountEl) itemCountEl.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
  }

  function wireItemEvents() {
    itemsWrap.querySelectorAll('.cart-item').forEach((el) => {
      const [id, color, size] = el.dataset.key.split('::');
      const items = Cart.getItems();
      const item = items.find((i) => Cart.lineKey(i.id, i.color, i.size) === el.dataset.key);
      if (!item) return;

      el.querySelector('[data-cart-inc]').addEventListener('click', () => {
        Cart.updateQty(id, color, size, item.qty + 1);
        render();
      });
      el.querySelector('[data-cart-dec]').addEventListener('click', () => {
        if (item.qty <= 1) return;
        Cart.updateQty(id, color, size, item.qty - 1);
        render();
      });
      el.querySelector('[data-cart-remove]').addEventListener('click', () => {
        Cart.removeItem(id, color, size);
        showToast('Item removed from cart');
        render();
      });
    });
  }

  render();
});
