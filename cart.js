/* =====================================================
   VALORA LUXURY — Cart Module
   Persistent shopping cart using localStorage.
   Cart item shape: { id, name, price, image, category,
                       color, size, qty }
   ===================================================== */

const CART_KEY = 'valora_cart';

const Cart = {
  getItems() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Cart read error:', e);
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      Cart.updateBadge();
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
    } catch (e) {
      console.error('Cart save error:', e);
    }
  },

  /* Build a unique line-item key from product id + variant */
  lineKey(id, color, size) {
    return [id, color || '', size || ''].join('::');
  },

  addItem(product, opts = {}) {
    const { color = '', size = '', qty = 1 } = opts;
    const items = Cart.getItems();
    const key = Cart.lineKey(product.id, color, size);
    const existing = items.find(
      (i) => Cart.lineKey(i.id, i.color, i.size) === key
    );

    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.image,
        category: product.category,
        color,
        size,
        qty,
      });
    }
    Cart.saveItems(items);
  },

  removeItem(id, color, size) {
    const key = Cart.lineKey(id, color, size);
    const items = Cart.getItems().filter(
      (i) => Cart.lineKey(i.id, i.color, i.size) !== key
    );
    Cart.saveItems(items);
  },

  updateQty(id, color, size, qty) {
    const items = Cart.getItems();
    const key = Cart.lineKey(id, color, size);
    const item = items.find((i) => Cart.lineKey(i.id, i.color, i.size) === key);
    if (item) {
      item.qty = Math.max(1, qty);
      Cart.saveItems(items);
    }
  },

  clear() {
    Cart.saveItems([]);
  },

  getCount() {
    return Cart.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  getSubtotal() {
    return Cart.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  updateBadge() {
    const badges = document.querySelectorAll('[data-cart-count]');
    const count = Cart.getCount();
    badges.forEach((b) => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  },
};

document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
