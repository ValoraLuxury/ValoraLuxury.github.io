/* =====================================================
   VALORA LUXURY — Wishlist Module
   Persistent wishlist using localStorage. Stores an
   array of product IDs.
   ===================================================== */

const WISHLIST_KEY = 'valora_wishlist';

const Wishlist = {
  getIds() {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Wishlist read error:', e);
      return [];
    }
  },

  saveIds(ids) {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
      Wishlist.updateBadge();
      document.dispatchEvent(new CustomEvent('wishlist:updated', { detail: ids }));
    } catch (e) {
      console.error('Wishlist save error:', e);
    }
  },

  has(id) {
    return Wishlist.getIds().includes(id);
  },

  toggle(id) {
    let ids = Wishlist.getIds();
    if (ids.includes(id)) {
      ids = ids.filter((i) => i !== id);
    } else {
      ids.push(id);
    }
    Wishlist.saveIds(ids);
    return ids.includes(id);
  },

  remove(id) {
    const ids = Wishlist.getIds().filter((i) => i !== id);
    Wishlist.saveIds(ids);
  },

  getCount() {
    return Wishlist.getIds().length;
  },

  updateBadge() {
    const badges = document.querySelectorAll('[data-wishlist-count]');
    const count = Wishlist.getCount();
    badges.forEach((b) => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  },
};

document.addEventListener('DOMContentLoaded', () => Wishlist.updateBadge());
