/**
 * Wishlist — localStorage key luxora_wishlist, an array of product ids.
 */
(function () {
  "use strict";

  var KEY = "luxora_wishlist";

  function read() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  function write(ids) {
    localStorage.setItem(KEY, JSON.stringify(ids));
    updateCount();
    paintHearts();
    renderPage();
  }

  function has(id) { return read().indexOf(id) !== -1; }

  function toggle(id) {
    var ids = read();
    var on = ids.indexOf(id) !== -1;
    ids = on ? ids.filter(function (item) { return item !== id; }) : ids.concat(id);
    write(ids);
    var product = window.LUXORA.getProduct(id);
    var name = product ? product.name : "Item";
    return { on: !on, message: on ? name + " removed from wishlist." : name + " saved to your wishlist." };
  }

  function updateCount() {
    var el = document.getElementById("wishCount");
    if (!el) return;
    el.textContent = String(read().length);
    el.dataset.count = String(read().length);
  }

  function paintHearts() {
    document.querySelectorAll("[data-wish]").forEach(function (btn) {
      var on = has(btn.getAttribute("data-wish"));
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Remove from wishlist" : "Add to wishlist");
      var icon = btn.querySelector("i");
      if (icon) icon.className = on ? "bi bi-heart-fill" : "bi bi-heart";
    });
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function renderPage() {
    var app = document.getElementById("wishlistApp");
    if (!app || !window.LuxoraUI) return;
    var products = read().map(window.LUXORA.getProduct).filter(Boolean);
    if (!products.length) {
      app.innerHTML = '<div class="lx-empty"><i class="bi bi-heart" aria-hidden="true"></i><h2 class="h4 mt-2">Nothing saved yet</h2><p>Tap the heart on a piece you want to come back to.</p><a class="btn btn-lx-primary" href="shop.html">Browse the shop</a></div>';
      return;
    }
    app.innerHTML = '<div class="lx-grid">' + products.map(function (product) {
      return '<div class="lx-wish-item">' + window.LuxoraUI.productCard(product) +
        '<div class="d-flex gap-2 p-2 pt-0"><button type="button" class="btn btn-lx-primary flex-grow-1" data-move-cart="' + esc(product.id) + '">Move to cart</button>' +
        '<button type="button" class="btn btn-lx-secondary" data-wish="' + esc(product.id) + '">Remove</button></div></div>';
    }).join("") + "</div>";
    paintHearts();
  }

  document.addEventListener("click", function (event) {
    var wish = event.target.closest("[data-wish]");
    if (wish && !wish.closest(".lx-wish-item .lx-card")) {
      /* hearts inside cards are handled below too — one path */
    }
    if (wish) {
      event.preventDefault();
      var result = toggle(wish.getAttribute("data-wish"));
      if (window.LuxoraToast) window.LuxoraToast(result.message, "success");
      return;
    }
    var move = event.target.closest("[data-move-cart]");
    if (move && window.LuxoraCart) {
      var id = move.getAttribute("data-move-cart");
      var added = window.LuxoraCart.add(id, { qty: 1 });
      if (added.ok) toggle(id);
      if (window.LuxoraToast) window.LuxoraToast(added.ok ? "Moved to your bag." : added.message, added.ok ? "success" : "error");
    }
  });

  window.LuxoraWish = {
    toggle: toggle,
    has: has,
    read: read,
    paint: paintHearts,
    renderPage: renderPage,
    init: function () {
      updateCount();
      paintHearts();
      renderPage();
    }
  };
})();
