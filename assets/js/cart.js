/**
 * Cart — localStorage key luxora_cart.
 * Line identity is product + size + colour + stitch.
 */
(function () {
  "use strict";

  var KEY = "luxora_cart";
  var PROMO_KEY = "luxora_promo";

  function read() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    renderMini();
    updateCount();
    if (document.getElementById("cartApp")) renderPage();
    if (window.LuxoraCheckout && document.getElementById("checkoutApp")) {
      window.LuxoraCheckout.refreshSummary();
    }
  }

  function lineKey(id, size, color, stitch) {
    return [id, size || "", color || "", stitch || ""].join("::");
  }

  function unitPrice(product, selection) {
    selection = selection || {};
    if (selection.stitch && product.stitchPrices && product.stitchPrices[selection.stitch] != null) {
      return product.stitchPrices[selection.stitch];
    }
    if (selection.size && product.variantPrices && product.variantPrices[selection.size] != null) {
      return product.variantPrices[selection.size];
    }
    return product.price;
  }

  function add(id, opts) {
    opts = opts || {};
    var product = window.LUXORA.getProduct(id);
    if (!product) return { ok: false, message: "That piece is no longer listed." };
    if (product.stock < 1) return { ok: false, message: "This piece is out of stock." };

    var size = opts.size || (product.sizes && product.sizes[0]) || "";
    var color = opts.color || (product.colors[0] && product.colors[0].name) || "";
    var stitch = opts.stitch || (product.stitchOptions && product.stitchOptions[0]) || "";
    var qty = Math.max(1, Number(opts.qty) || 1);
    var items = read();
    var key = lineKey(product.id, size, color, stitch);
    var existing = items.find(function (line) { return line.key === key; });
    var nextQty = (existing ? existing.qty : 0) + qty;
    if (nextQty > product.stock) {
      return { ok: false, message: "Only " + product.stock + " left in stock." };
    }
    var line = {
      key: key,
      id: product.id,
      name: product.name,
      image: product.images[0],
      size: size,
      color: color,
      stitch: stitch,
      unitPrice: unitPrice(product, { size: size, stitch: stitch }),
      qty: nextQty
    };
    if (existing) {
      items = items.map(function (item) { return item.key === key ? line : item; });
    } else {
      items.push(line);
    }
    write(items);
    var variant = [size, color, stitch].filter(Boolean).join(" · ");
    return { ok: true, message: product.name + (variant ? " (" + variant + ")" : "") + " added to your bag." };
  }

  function update(key, qty) {
    qty = Number(qty);
    if (qty < 1) return remove(key);
    var items = read();
    var line = items.find(function (item) { return item.key === key; });
    if (!line) return;
    var product = window.LUXORA.getProduct(line.id);
    if (product && qty > product.stock) {
      toast(product.name + " only has " + product.stock + " in stock.", "error");
      qty = product.stock;
    }
    write(items.map(function (item) {
      return item.key === key ? Object.assign({}, item, { qty: qty }) : item;
    }));
  }

  function remove(key) {
    write(read().filter(function (item) { return item.key !== key; }));
  }

  function clear() {
    write([]);
    localStorage.removeItem(PROMO_KEY);
  }

  function count() {
    return read().reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function subtotal() {
    return read().reduce(function (sum, item) { return sum + item.unitPrice * item.qty; }, 0);
  }

  function getPromo() {
    return localStorage.getItem(PROMO_KEY) || "";
  }

  function setPromo(code) {
    var clean = String(code || "").trim().toUpperCase();
    if (!clean) {
      localStorage.removeItem(PROMO_KEY);
      return { ok: true, message: "Promo removed." };
    }
    var table = window.LUXORA.config.promoCodes || {};
    if (!table[clean]) return { ok: false, message: "That code isn’t valid. Try NAWAB10 or WELCOME15." };
    localStorage.setItem(PROMO_KEY, clean);
    return { ok: true, message: clean + " applied — " + table[clean] + "% off." };
  }

  function deliveryFee(merchandise, method) {
    var cfg = window.LUXORA.config;
    var base = merchandise >= cfg.freeDeliveryMin ? 0 : cfg.standardFee;
    if (method === "express") return base + cfg.expressSurcharge;
    return base;
  }

  function totals(method) {
    var cfg = window.LUXORA.config;
    var goods = subtotal();
    var code = getPromo();
    var percent = (cfg.promoCodes && cfg.promoCodes[code]) || 0;
    var discount = Math.round(goods * (percent / 100));
    var after = Math.max(0, goods - discount);
    var delivery = deliveryFee(goods, method || "standard");
    return {
      subtotal: goods,
      code: code,
      percent: percent,
      discount: discount,
      delivery: delivery,
      total: after + delivery,
      method: method || "standard"
    };
  }

  function money(n) { return window.LUXORA.formatPrice(n); }

  function variantLabel(line) {
    return [line.size, line.color, line.stitch].filter(Boolean).join(" · ");
  }

  function updateCount() {
    var el = document.getElementById("cartCount");
    if (!el) return;
    var n = count();
    el.textContent = String(n);
    el.dataset.count = String(n);
  }

  function toast(message, type) {
    if (window.LuxoraToast) window.LuxoraToast(message, type);
  }

  function renderMini() {
    var box = document.getElementById("miniCartBody");
    if (!box) return;
    var items = read();
    var foot = document.getElementById("miniCartFoot");
    if (!items.length) {
      box.innerHTML = '<div class="lx-empty"><i class="bi bi-bag" aria-hidden="true"></i><h2 class="h5 mt-2">Your bag is empty</h2><p>When you add a piece, it will wait for you here.</p><a class="btn btn-lx-primary" href="shop.html">Continue shopping</a></div>';
      if (foot) foot.hidden = true;
      return;
    }
    if (foot) foot.hidden = false;
    box.innerHTML = items.map(function (line) {
      var img = window.LUXORA.resolveImage(line.image);
      return '<article class="lx-mini-row">' +
        '<img src="' + esc(img) + '" alt="" width="64" height="80">' +
        '<div><strong>' + esc(line.name) + '</strong>' +
        '<div class="text-muted small">' + esc(variantLabel(line)) + '</div>' +
        '<div class="d-flex justify-content-between align-items-center mt-1">' +
        '<span>' + line.qty + ' × ' + money(line.unitPrice) + '</span>' +
        '<button class="lx-remove" type="button" data-remove-line="' + esc(line.key) + '">Remove</button></div></div></article>';
    }).join("");
    var totalEl = document.getElementById("miniCartTotal");
    if (totalEl) totalEl.textContent = money(totals().total);
  }

  function renderPage() {
    var app = document.getElementById("cartApp");
    if (!app) return;
    var items = read();
    if (!items.length) {
      app.innerHTML = '<div class="lx-empty"><i class="bi bi-bag" aria-hidden="true"></i><h2 class="h4 mt-2">Your bag is empty</h2><p>Perfumes, lawn, denim — the edit is ready when you are.</p><a class="btn btn-lx-primary" href="shop.html">Continue shopping</a></div>';
      return;
    }
    var rows = items.map(function (line) {
      var img = window.LUXORA.resolveImage(line.image);
      return '<article class="lx-cart-row">' +
        '<a href="product.html?id=' + esc(line.id) + '"><img src="' + esc(img) + '" alt="' + esc(line.name) + '" width="110" height="140"></a>' +
        '<div><h2><a href="product.html?id=' + esc(line.id) + '">' + esc(line.name) + '</a></h2>' +
        '<p class="mb-2 text-muted small">' + esc(variantLabel(line) || "Standard") + '</p>' +
        '<div data-qty-group><div class="lx-qty">' +
        '<button type="button" data-qty="-1" data-line="' + esc(line.key) + '" aria-label="Decrease quantity">−</button>' +
        '<input type="number" min="1" max="20" value="' + line.qty + '" aria-label="Quantity" data-line-input="' + esc(line.key) + '">' +
        '<button type="button" data-qty="1" data-line="' + esc(line.key) + '" aria-label="Increase quantity">+</button>' +
        '</div></div>' +
        '<button class="lx-remove mt-2" type="button" data-remove-line="' + esc(line.key) + '">Remove</button></div>' +
        '<strong>' + money(line.unitPrice * line.qty) + '</strong></article>';
    }).join("");
    var t = totals();
    var cfg = window.LUXORA.config;
    app.innerHTML =
      '<div class="lx-cart-layout"><div>' + rows +
      '<a class="btn btn-lx-secondary mt-2" href="shop.html">Continue shopping</a></div>' +
      '<aside class="lx-summary is-sticky"><h2>Order summary</h2>' +
      summaryRows(t) +
      '<form class="lx-promo-form" id="promoForm"><label class="visually-hidden" for="promoCode">Promo code</label>' +
      '<input class="form-control" id="promoCode" name="promo" placeholder="Promo code" value="' + esc(t.code) + '">' +
      '<button class="btn btn-lx-secondary" type="submit">Apply</button></form>' +
      '<p class="small text-muted">NAWAB10 saves 10%. WELCOME15 saves 15%. Delivery is free above ' + money(cfg.freeDeliveryMin) + '.</p>' +
      '<a class="btn btn-lx-primary w-100" href="checkout.html">Proceed to checkout</a></aside></div>';
  }

  function summaryRows(t) {
    return '<div class="lx-summary-row"><span>Subtotal</span><span>' + money(t.subtotal) + '</span></div>' +
      (t.discount ? '<div class="lx-summary-row"><span>Discount (' + esc(t.code) + ')</span><span>− ' + money(t.discount) + '</span></div>' : '') +
      '<div class="lx-summary-row"><span>Delivery</span><span>' + (t.delivery === 0 ? "Free" : money(t.delivery)) + '</span></div>' +
      '<div class="lx-total"><span>Total</span><span>' + money(t.total) + '</span></div>';
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  document.addEventListener("click", function (event) {
    var addBtn = event.target.closest("[data-add-cart]");
    if (addBtn && !addBtn.hasAttribute("data-product-atc")) {
      event.preventDefault();
      var result = add(addBtn.getAttribute("data-add-cart"), { qty: 1 });
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) {
        var panel = document.getElementById("miniCart");
        if (panel && window.bootstrap) window.bootstrap.Offcanvas.getOrCreateInstance(panel).show();
      }
    }
    var removeBtn = event.target.closest("[data-remove-line]");
    if (removeBtn) remove(removeBtn.getAttribute("data-remove-line"));
  });

  document.addEventListener("change", function (event) {
    var input = event.target.closest("[data-line-input]");
    if (!input) return;
    update(input.getAttribute("data-line-input"), input.value);
  });

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (form.id !== "promoForm") return;
    event.preventDefault();
    var result = setPromo(form.promo.value);
    toast(result.message, result.ok ? "success" : "error");
    renderPage();
    renderMini();
  });

  window.LuxoraCart = {
    add: add,
    update: update,
    remove: remove,
    clear: clear,
    read: read,
    count: count,
    totals: totals,
    unitPrice: unitPrice,
    getPromo: getPromo,
    setPromo: setPromo,
    summaryRows: summaryRows,
    money: money,
    renderMini: renderMini,
    renderPage: renderPage,
    init: function () {
      updateCount();
      renderMini();
      renderPage();
    }
  };
})();
