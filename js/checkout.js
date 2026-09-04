/* =====================================================
   VALORA LUXURY — Checkout Page Logic
   NOTE: Payments are NOT live. This builds a structured
   checkout UI and order summary only. No real payment
   card data is collected or stored in frontend JS.
   Structured so a gateway (e.g. Razorpay) and a backend
   can be wired in later — see the placeOrder() function.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-checkout-page]');
  if (!root) return;

  const orderItemsWrap = document.querySelector('[data-order-items]');
  const subtotalEl = document.querySelector('[data-checkout-subtotal]');
  const shippingEl = document.querySelector('[data-checkout-shipping]');
  const totalEl = document.querySelector('[data-checkout-total]');
  const form = document.querySelector('[data-checkout-form]');
  const paymentOptions = document.querySelectorAll('[data-payment-option]');
  const placeOrderBtn = document.querySelector('[data-place-order]');
  const emptyNotice = document.querySelector('[data-checkout-empty]');
  const checkoutLayout = document.querySelector('.checkout-layout');

  const FREE_SHIPPING_THRESHOLD = 15000;
  const SHIPPING_FEE = 500;
  let selectedPayment = 'card';

  function renderOrderSummary() {
    const items = Cart.getItems();

    if (items.length === 0) {
      if (checkoutLayout) checkoutLayout.style.display = 'none';
      if (emptyNotice) emptyNotice.style.display = 'block';
      return;
    }
    if (checkoutLayout) checkoutLayout.style.display = '';
    if (emptyNotice) emptyNotice.style.display = 'none';

    orderItemsWrap.innerHTML = items
      .map((item) => {
        const product = getProductById(item.id);
        const img = product ? product.image : item.image;
        return `
        <div class="order-item">
          <div class="order-item-img">
            <img src="${img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;" />
            <span class="order-item-qty-badge">${item.qty}</span>
          </div>
          <div class="order-item-details">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-variant">${[item.color, item.size].filter(Boolean).join(' / ') || 'Standard'}</div>
          </div>
          <div class="order-item-price">${formatPrice(item.price * item.qty)}</div>
        </div>`;
      })
      .join('');

    const subtotal = Cart.getSubtotal();
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Complimentary' : formatPrice(shipping);
    if (totalEl) totalEl.textContent = formatPrice(total);
  }

  /* --- Payment method selector --- */
  paymentOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      selectedPayment = opt.dataset.paymentOption;
    });
  });

  /* --- Form validation + "place order" (demo — no live payment) --- */
  function validateForm() {
    if (!form) return true;
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach((field) => {
      const wrap = field.closest('.form-field');
      if (!field.value.trim()) {
        valid = false;
        if (wrap) wrap.querySelector('.form-input').style.borderColor = '#b3261e';
      } else if (wrap) {
        wrap.querySelector('.form-input').style.borderColor = '';
      }
    });
    return valid;
  }

  function placeOrder(e) {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please complete all required fields');
      return;
    }
    if (Cart.getItems().length === 0) {
      showToast('Your bag is empty');
      return;
    }

    /* -----------------------------------------------------
       INTEGRATION POINT — connect a real payment gateway here.
       Example (Razorpay), once a backend order-creation
       endpoint exists:

       const order = await fetch('/api/create-order', {
         method: 'POST',
         body: JSON.stringify({ amount: totalInPaise, items: Cart.getItems() })
       }).then(r => r.json());

       const rzp = new Razorpay({
         key: 'YOUR_RAZORPAY_KEY_ID',
         amount: order.amount,
         order_id: order.id,
         handler: function (response) {
           // verify payment on your backend, then clear cart
           Cart.clear();
           window.location.href = 'order-confirmation.html';
         },
       });
       rzp.open();
       ----------------------------------------------------- */

    showToast('Order details captured — payment integration coming soon');
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing…';

    setTimeout(() => {
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = 'Place Order';
    }, 1800);
  }

  if (form) form.addEventListener('submit', placeOrder);
  if (placeOrderBtn && !form) placeOrderBtn.addEventListener('click', placeOrder);

  renderOrderSummary();
});
