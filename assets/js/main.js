/**
 * Shared interface: brand tokens, search, product cards, product page,
 * account, order tracking, and scroll behaviour.
 */
(function () {
  "use strict";

  var LX = window.LUXORA;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function catName(id) {
    var category = LX.getCategory(id);
    return category ? category.name : id;
  }

  function stars(rating, count) {
    var full = Math.floor(rating);
    var half = rating - full >= 0.4;
    var icons = "";
    for (var i = 1; i <= 5; i += 1) {
      if (i <= full) icons += '<i class="bi bi-star-fill" aria-hidden="true"></i>';
      else if (i === full + 1 && half) icons += '<i class="bi bi-star-half" aria-hidden="true"></i>';
      else icons += '<i class="bi bi-star" aria-hidden="true"></i>';
    }
    return '<p class="lx-stars" role="img" aria-label="Rated ' + rating + ' out of 5">' + icons +
      (count != null ? "<span>(" + count + ")</span>" : "") + "</p>";
  }

  function productCard(product) {
    var square = product.category === "perfumes" || product.category === "hats";
    var height = square ? 600 : 750;
    var img1 = LX.resolveImage(product.images[0]);
    var img2 = LX.resolveImage(product.images[1] || product.images[0]);
    var badgeClass = product.badge === "Sale" ? "lx-badge--sale" : product.badge === "Best Seller" ? "lx-badge--best" : "lx-badge--new";
    var wished = window.LuxoraWish && window.LuxoraWish.has(product.id);
    var old = product.oldPrice ? '<span class="lx-price-old">' + LX.formatPrice(product.oldPrice) + "</span>" : "";
    var off = product.discountPercent ? '<span class="lx-off">' + product.discountPercent + "% off</span>" : "";
    return '<article class="lx-card' + (square ? " lx-card--square" : "") + '">' +
      '<div class="lx-card-media" data-label="' + esc(catName(product.category)) + '">' +
      '<a href="product.html?id=' + esc(product.id) + '">' +
      '<img class="lx-card-img" src="' + esc(img1) + '" alt="' + esc(product.name) + '" width="600" height="' + height + '" loading="lazy">' +
      '<img class="lx-card-img is-secondary" src="' + esc(img2) + '" alt="" width="600" height="' + height + '" loading="lazy">' +
      "</a>" +
      (product.badge ? '<span class="lx-badge ' + badgeClass + '">' + esc(product.badge) + "</span>" : "") +
      '<div class="lx-card-actions">' +
      '<button type="button" class="lx-icon-btn' + (wished ? " is-on" : "") + '" data-wish="' + esc(product.id) + '" aria-pressed="' + (wished ? "true" : "false") + '" aria-label="' + (wished ? "Remove from wishlist" : "Add to wishlist") + '"><i class="bi ' + (wished ? "bi-heart-fill" : "bi-heart") + '"></i></button>' +
      '<button type="button" class="lx-quick" data-quick="' + esc(product.id) + '">Quick view</button></div></div>' +
      '<div class="lx-card-body"><p class="lx-card-cat">' + esc(catName(product.category)) + "</p>" +
      '<h3 class="lx-card-title"><a href="product.html?id=' + esc(product.id) + '">' + esc(product.name) + "</a></h3>" +
      stars(product.rating, product.reviewCount) +
      '<p class="lx-card-price"><span>' + LX.formatPrice(product.price) + "</span>" + old + off + "</p>" +
      '<p class="lx-card-desc">' + esc(product.shortDescription) + "</p>" +
      '<button type="button" class="btn btn-lx-primary lx-card-atc" data-add-cart="' + esc(product.id) + '"' + (product.stock < 1 ? " disabled" : "") + ">" +
      (product.stock < 1 ? "Out of stock" : "Add to Cart") + "</button></div></article>";
  }

  function paintSwatches(root) {
    (root || document).querySelectorAll("[data-hex]").forEach(function (node) {
      node.style.backgroundColor = node.getAttribute("data-hex");
    });
  }

  function toast(message, type) {
    var stack = document.getElementById("toastStack");
    if (!stack || !window.bootstrap) return;
    var el = document.createElement("div");
    el.className = "toast lx-toast " + (type || "info");
    el.setAttribute("role", "status");
    el.innerHTML = '<div class="toast-body">' + esc(message) + "</div>";
    stack.appendChild(el);
    var instance = new window.bootstrap.Toast(el, { delay: 2800 });
    instance.show();
    el.addEventListener("hidden.bs.toast", function () { el.remove(); });
  }

  function variantControls(product) {
    var html = "";
    var sizeWord = product.category === "jeans" ? "Waist" : "Size";
    var sizeId = product.id + "-size";
    var colorId = product.id + "-color";
    var stitchId = product.id + "-stitch";
    if (product.sizes && product.sizes.length) {
      html += '<div class="lx-variant"><p id="' + sizeId + '">' + sizeWord + '</p><div role="group" aria-labelledby="' + sizeId + '">' +
        product.sizes.map(function (size, index) {
          return '<button type="button" class="lx-size' + (index === 0 ? " is-on" : "") + '" data-option="size" data-value="' + esc(size) + '" aria-pressed="' + (index === 0 ? "true" : "false") + '">' + esc(size) + "</button>";
        }).join("") + "</div></div>";
    }
    if (product.colors && product.colors.length > 1) {
      html += '<div class="lx-variant"><p id="' + colorId + '">Colour</p><div class="lx-swatches" role="group" aria-labelledby="' + colorId + '">' +
        product.colors.map(function (color, index) {
          return '<button type="button" class="lx-swatch' + (index === 0 ? " is-on" : "") + '" data-option="color" data-value="' + esc(color.name) + '" data-hex="' + esc(color.hex) + '" aria-label="' + esc(color.name) + '" aria-pressed="' + (index === 0 ? "true" : "false") + '"></button>';
        }).join("") + "</div></div>";
    } else if (product.colors && product.colors[0]) {
      html += '<p class="small mb-2">Colour: ' + esc(product.colors[0].name) + "</p>";
    }
    if (product.stitchOptions && product.stitchOptions.length) {
      html += '<div class="lx-variant"><p id="' + stitchId + '">Stitching</p><div role="group" aria-labelledby="' + stitchId + '">' +
        product.stitchOptions.map(function (option, index) {
          return '<button type="button" class="lx-size' + (index === 0 ? " is-on" : "") + '" data-option="stitch" data-value="' + esc(option) + '" aria-pressed="' + (index === 0 ? "true" : "false") + '">' + esc(option) + "</button>";
        }).join("") + "</div></div>";
    }
    return html;
  }

  function readSelection(root, product) {
    function value(name, fallback) {
      var el = root.querySelector('[data-option="' + name + '"].is-on');
      return el ? el.getAttribute("data-value") : fallback;
    }
    return {
      size: value("size", (product.sizes && product.sizes[0]) || ""),
      color: value("color", (product.colors[0] && product.colors[0].name) || ""),
      stitch: value("stitch", (product.stitchOptions && product.stitchOptions[0]) || "")
    };
  }

  function priced(product, selection) {
    var price = window.LuxoraCart.unitPrice(product, selection);
    var old = null;
    if (selection.stitch && product.stitchPrices) old = product.stitchOldPrices ? product.stitchOldPrices[selection.stitch] : null;
    else if (selection.size && product.variantPrices && product.variantPrices[selection.size] != null) old = product.variantOldPrices ? product.variantOldPrices[selection.size] : null;
    else old = product.oldPrice;
    if (!old || old <= price) old = null;
    return { price: price, old: old, discount: old ? Math.round((1 - price / old) * 100) : 0 };
  }

  function paintPrice(root, product) {
    var node = root.querySelector("[data-price]");
    if (!node) return;
    var deal = priced(product, readSelection(root, product));
    node.innerHTML = "<strong>" + LX.formatPrice(deal.price) + "</strong>" +
      (deal.old ? ' <span class="lx-price-old">' + LX.formatPrice(deal.old) + "</span>" : "") +
      (deal.discount ? ' <span class="lx-off">' + deal.discount + "% off</span>" : "");
  }

  function bindOptions(root, product) {
    root.addEventListener("click", function (event) {
      var button = event.target.closest("[data-option]");
      if (!button || !root.contains(button)) return;
      var name = button.getAttribute("data-option");
      root.querySelectorAll('[data-option="' + name + '"]').forEach(function (item) {
        var on = item === button;
        item.classList.toggle("is-on", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      paintPrice(root, product);
    });
  }

  function scroller(products) {
    if (!products.length) return "";
    return '<div class="lx-scroller">' + products.map(productCard).join("") + "</div>";
  }

  function observe(root) {
    if (!("IntersectionObserver" in window)) {
      (root || document).querySelectorAll(".lx-reveal").forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        watcher.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    (root || document).querySelectorAll(".lx-reveal").forEach(function (el) { watcher.observe(el); });
  }

  window.LuxoraUI = { productCard: productCard, paintSwatches: paintSwatches, toast: toast, observe: observe };
  window.LuxoraToast = toast;

  function replaceBrand(value) {
    return String(value || "").split("LUXORA").join(LX.config.brand);
  }

  function applyBrand() {
    var brand = LX.config.brand;
    document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = brand; });
    document.querySelectorAll("[data-tagline]").forEach(function (el) { el.textContent = LX.config.tagline; });
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.textContent = LX.config.email;
      if (el.tagName === "A") el.href = "mailto:" + LX.config.email;
    });
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      el.textContent = LX.config.whatsappDisplay;
      if (el.tagName === "A") el.href = "tel:+" + LX.config.whatsappNumber;
    });
    document.querySelectorAll("[data-address]").forEach(function (el) {
      el.textContent = LX.config.addresses[el.getAttribute("data-address")] || "";
    });
    document.querySelectorAll("[data-hours]").forEach(function (el) { el.textContent = LX.config.hours; });
    document.querySelectorAll("[data-handle]").forEach(function (el) { el.textContent = LX.config.instagramHandle; });
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
    var title = document.querySelector("title");
    if (title && title.dataset.pageTitle) document.title = title.dataset.pageTitle + " — " + brand;
    document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"]').forEach(function (meta) {
      var content = meta.getAttribute("content");
      if (content) meta.setAttribute("content", replaceBrand(content));
    });
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var text = replaceBrand(el.getAttribute("data-wa-text") || ("Hello " + brand + ", I would like to know more about your collection."));
      el.href = "https://wa.me/" + LX.config.whatsappNumber + "?text=" + encodeURIComponent(text);
    });
    if (LX.config.imageMode === "webp" || LX.config.imageMode === "photo") {
      document.querySelectorAll("[data-photo]").forEach(function (img) {
        var next = img.getAttribute("data-photo");
        if (LX.config.imageMode === "photo") next = next.replace(/\.webp$/i, ".jpg");
        img.src = next;
      });
    }
  }

  function measure() {
    var bar = document.getElementById("topbar");
    if (bar) document.documentElement.style.setProperty("--topbar-h", bar.offsetHeight + "px");
  }

  function chrome() {
    var announce = document.getElementById("announceBar");
    if (announce && localStorage.getItem("luxora_announce_hidden") === "1") announce.remove();
    var close = document.getElementById("announceClose");
    if (close) close.addEventListener("click", function () {
      localStorage.setItem("luxora_announce_hidden", "1");
      if (announce) announce.remove();
      measure();
    });
    var topbar = document.getElementById("topbar");
    var back = document.getElementById("backToTop");
    function onScroll() {
      var y = window.scrollY || 0;
      if (topbar) {
        topbar.classList.toggle("is-shrunk", y > 48);
        topbar.classList.toggle("is-solid", y > 24);
      }
      if (back) back.hidden = y < 480;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (back) back.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    window.addEventListener("resize", measure);
    measure();
  }

  function bindSearch(input, panel) {
    if (!input || !panel) return;
    var active = -1;
    var timer = 0;
    function results(query) {
      var words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.length) return [];
      return LX.products.filter(function (product) {
        var hay = (product.name + " " + product.subCategory + " " + catName(product.category) + " " + product.brand + " " + product.fabric + " " + (product.tags || []).join(" ")).toLowerCase();
        return words.every(function (word) { return hay.indexOf(word) !== -1; });
      }).slice(0, 6);
    }
    function paint(list, query) {
      active = -1;
      if (!query.trim()) { panel.hidden = true; panel.innerHTML = ""; return; }
      panel.hidden = false;
      if (!list.length) {
        panel.innerHTML = '<p class="p-3 mb-0 small">No matches. Try oud, lawn, or denim.</p>';
        return;
      }
      panel.innerHTML = list.map(function (product) {
        return '<a role="option" href="product.html?id=' + esc(product.id) + '"><img src="' + esc(LX.resolveImage(product.images[0])) + '" alt=""><span>' + esc(product.name) + "<small>" + esc(catName(product.category)) + '</small></span><strong>' + LX.formatPrice(product.price) + "</strong></a>";
      }).join("");
    }
    input.addEventListener("input", function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { paint(results(input.value), input.value); }, 220);
    });
    input.addEventListener("keydown", function (event) {
      var links = panel.querySelectorAll("a");
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (!links.length) return;
        event.preventDefault();
        active += event.key === "ArrowDown" ? 1 : -1;
        if (active < 0) active = links.length - 1;
        if (active >= links.length) active = 0;
        links.forEach(function (link, index) { link.classList.toggle("is-active", index === active); });
      } else if (event.key === "Enter" && active >= 0 && links[active]) {
        event.preventDefault();
        location.href = links[active].getAttribute("href");
      } else if (event.key === "Escape") {
        panel.hidden = true;
      }
    });
    document.addEventListener("click", function (event) {
      if (!panel.contains(event.target) && event.target !== input) panel.hidden = true;
    });
  }

  function newsletter(event) {
    var form = event.target.closest("[data-newsletter]");
    if (!form || event.target !== form) return;
    event.preventDefault();
    var email = (form.email.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Enter a valid email address.", "error");
      return;
    }
    var list = [];
    try { list = JSON.parse(localStorage.getItem("luxora_news") || "[]"); } catch (err) { list = []; }
    if (list.indexOf(email) === -1) list.push(email);
    localStorage.setItem("luxora_news", JSON.stringify(list));
    form.reset();
    toast("You’re on the list. We’ll write when the next edit lands.", "success");
  }

  function qtyClick(event) {
    var button = event.target.closest("[data-qty]");
    if (!button) return;
    var group = button.closest("[data-qty-group]");
    if (!group) return;
    var input = group.querySelector("input");
    var next = Number(input.value || 1) + Number(button.getAttribute("data-qty"));
    var min = Number(input.getAttribute("min") || 1);
    var max = Number(input.getAttribute("max") || 20);
    input.value = String(Math.min(max, Math.max(min, next)));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function openQuick(id) {
    var product = LX.getProduct(id);
    var modalEl = document.getElementById("quickView");
    var body = document.getElementById("quickViewBody");
    if (!product || !modalEl || !body) return;
    body.innerHTML =
      '<div class="modal-header"><h2 class="modal-title h4" id="quickViewTitle">' + esc(product.name) + '</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body"><div class="qv-grid"><img src="' + esc(LX.resolveImage(product.images[0])) + '" alt="' + esc(product.name) + '">' +
      "<div>" + stars(product.rating, product.reviewCount) + '<p class="lx-card-price" data-price></p><p>' + esc(product.shortDescription) + "</p>" +
      variantControls(product) +
      '<div data-qty-group class="my-2"><div class="lx-qty"><button type="button" data-qty="-1" aria-label="Decrease quantity">−</button><input name="qty" type="number" min="1" max="' + product.stock + '" value="1" aria-label="Quantity"><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div></div>' +
      '<div class="d-flex gap-2 flex-wrap"><button type="button" class="btn btn-lx-primary" data-product-atc>Add to Cart</button><a class="btn btn-lx-secondary" href="product.html?id=' + esc(product.id) + '">View details</a></div></div></div></div>';
    paintSwatches(body);
    paintPrice(body, product);
    bindOptions(body, product);
    body.querySelector("[data-product-atc]").addEventListener("click", function () {
      var result = window.LuxoraCart.add(product.id, Object.assign({ qty: Number(body.querySelector("input[name=qty]").value || 1) }, readSelection(body, product)));
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) window.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    });
    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  function initHome() {
    var arrivals = document.getElementById("newArrivals");
    if (arrivals) {
      var newest = LX.products.filter(function (product) { return product.isNew; })
        .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); })
        .slice(0, 8);
      arrivals.innerHTML = newest.map(productCard).join("");
    }
    var tabs = document.getElementById("bestTabs");
    var panels = document.getElementById("bestPanels");
    if (tabs && panels) {
      tabs.innerHTML = LX.categories.map(function (category, index) {
        return '<li class="nav-item"><button class="nav-link' + (index === 0 ? " active" : "") + '" data-bs-toggle="tab" data-bs-target="#best-' + category.id + '" type="button" role="tab">' + esc(category.name) + "</button></li>";
      }).join("");
      panels.innerHTML = LX.categories.map(function (category, index) {
        var best = LX.products.filter(function (product) { return product.category === category.id && product.isBestSeller; });
        var more = LX.products.filter(function (product) { return product.category === category.id && !product.isBestSeller; })
          .sort(function (a, b) { return b.rating - a.rating; });
        var items = best.concat(more).slice(0, 4);
        return '<div class="tab-pane fade' + (index === 0 ? " show active" : "") + '" id="best-' + category.id + '" role="tabpanel"><div class="lx-grid mt-3">' + items.map(productCard).join("") + "</div></div>";
      }).join("");
    }
    document.querySelectorAll("[data-hotspot]").forEach(function (link) {
      var product = LX.getProduct(link.getAttribute("data-hotspot"));
      if (!product) return;
      var card = link.querySelector(".lx-hotspot-card");
      if (card) card.innerHTML = "<strong>" + esc(product.name) + "</strong><br>" + LX.formatPrice(product.price);
      link.setAttribute("aria-label", product.name + ", " + LX.formatPrice(product.price));
    });
    var clock = document.getElementById("countdown");
    if (clock) {
      var end = new Date("2026-11-30T23:59:59+05:00").getTime();
      function tick() {
        var diff = end - Date.now();
        if (diff <= 0) {
          clock.innerHTML = "<p class='mb-0'>This edit has closed. The sale pieces are still in the shop.</p>";
          return;
        }
        var days = Math.floor(diff / 86400000);
        var hours = Math.floor((diff / 3600000) % 24);
        var mins = Math.floor((diff / 60000) % 60);
        var secs = Math.floor((diff / 1000) % 60);
        clock.innerHTML = [days, hours, mins, secs].map(function (num, index) {
          var label = ["Days", "Hours", "Mins", "Secs"][index];
          return "<div><strong>" + String(num).padStart(2, "0") + "</strong><span>" + label + "</span></div>";
        }).join("");
      }
      tick();
      window.setInterval(tick, 1000);
    }
  }

  function breakdown(rating, count) {
    var five = rating >= 4.7 ? 0.7 : rating >= 4.4 ? 0.58 : 0.48;
    var weights = [five, 0.22, 0.08, 0.04, Math.max(0.02, 1 - five - 0.34)];
    var sum = weights.reduce(function (a, b) { return a + b; }, 0);
    return weights.map(function (weight, index) {
      var pct = Math.round((weight / sum) * 100);
      return { stars: 5 - index, pct: pct, count: Math.max(0, Math.round(count * weight / sum)) };
    });
  }

  function remember(id) {
    var ids = [];
    try { ids = JSON.parse(localStorage.getItem("luxora_recent") || "[]"); } catch (err) { ids = []; }
    ids = [id].concat(ids.filter(function (item) { return item !== id; })).slice(0, 8);
    localStorage.setItem("luxora_recent", JSON.stringify(ids));
  }

  function initProduct() {
    var params = new URLSearchParams(location.search);
    var product = LX.getProduct(params.get("id"));
    var app = document.getElementById("productApp");
    var crumb = document.getElementById("crumb");
    if (!app) return;
    if (!product) {
      if (crumb) crumb.innerHTML = '<li class="breadcrumb-item"><a href="index.html">Home</a></li><li class="breadcrumb-item active">Not found</li>';
      app.innerHTML = '<div class="lx-empty"><h1 class="h3">We couldn’t find that piece</h1><p>It may have left the edit.</p><a class="btn btn-lx-primary" href="shop.html">Browse the shop</a></div>';
      return;
    }
    remember(product.id);
    document.title = product.name + " — " + LX.config.brand;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", product.shortDescription);
    if (crumb) {
      crumb.innerHTML = '<li class="breadcrumb-item"><a href="index.html">Home</a></li><li class="breadcrumb-item"><a href="category.html?cat=' + esc(product.category) + '">' + esc(catName(product.category)) + '</a></li><li class="breadcrumb-item active" aria-current="page">' + esc(product.name) + "</li>";
    }
    var square = product.category === "perfumes" || product.category === "hats";
    var kind = product.category === "perfumes" ? "perfume" : "apparel";
    var reviews = LX.reviews.filter(function (review) { return review.kind === kind || review.kind === "any"; }).slice(0, 4);
    var bars = breakdown(product.rating, product.reviewCount).map(function (row) {
      return '<div><span>' + row.stars + ' ★</span><i class="lx-bar"><span data-pct="' + row.pct + '"></span></i><span>' + row.pct + "%</span></div>";
    }).join("");
    var detailRows = Object.keys(product.details || {}).map(function (key) {
      return "<tr><th>" + esc(key.replace(/([A-Z])/g, " $1")) + "</th><td>" + esc(product.details[key]) + "</td></tr>";
    }).join("");
    if (product.fabric) detailRows += "<tr><th>Fabric</th><td>" + esc(product.fabric) + "</td></tr>";
    var notes = "";
    if (product.notes) {
      notes = '<div class="lx-notes"><div><strong>Top</strong><p class="mb-0">' + esc(product.notes.top) + "</p></div><div><strong>Heart</strong><p class='mb-0'>" + esc(product.notes.heart) + "</p></div><div><strong>Base</strong><p class='mb-0'>" + esc(product.notes.base) + "</p></div></div>";
    }
    var cities = '<option value="">Select a city</option>' + LX.cities.map(function (city) {
      return '<option value="' + esc(city.name) + '">' + esc(city.name) + "</option>";
    }).join("");
    app.innerHTML =
      '<div class="lx-product"><div><div class="lx-gallery-main' + (square ? " is-square" : "") + '" id="galleryMain"><img id="mainImage" src="' + esc(LX.resolveImage(product.images[0])) + '" alt="' + esc(product.name) + '" width="900" height="' + (square ? 900 : 1125) + '"></div>' +
      '<div class="lx-thumbs" id="thumbs">' + product.images.map(function (image, index) {
        return '<button type="button" data-thumb="' + index + '" aria-label="Image ' + (index + 1) + '" aria-current="' + (index === 0 ? "true" : "false") + '"><img src="' + esc(LX.resolveImage(image)) + '" alt="" width="74" height="92"></button>';
      }).join("") + '</div><p class="small text-muted mt-2" id="imageCount">1 / ' + product.images.length + "</p></div>" +
      '<div class="lx-product-info" id="productInfo"><p class="lx-eyebrow">' + esc(catName(product.category)) + "</p><h1>" + esc(product.name) + "</h1>" +
      '<p class="lx-sku">SKU ' + esc(product.details.sku || product.id) + "</p>" + stars(product.rating, product.reviewCount) +
      '<p class="lx-card-price fs-5" data-price></p>' +
      (product.stock <= 5 ? '<p class="lx-low">Only ' + product.stock + " left</p>" : "") +
      "<p>" + esc(product.shortDescription) + "</p>" + variantControls(product) +
      '<div data-qty-group class="mb-2"><div class="lx-qty"><button type="button" data-qty="-1" aria-label="Decrease quantity">−</button><input id="productQty" type="number" min="1" max="' + product.stock + '" value="1" aria-label="Quantity"><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div></div>' +
      '<div class="lx-buy-row" id="buyRow"><button type="button" class="btn btn-lx-primary" data-product-atc id="addBtn"' + (product.stock < 1 ? " disabled" : "") + '>Add to Cart</button>' +
      '<button type="button" class="btn btn-lx-secondary" id="buyNow"' + (product.stock < 1 ? " disabled" : "") + ">Buy Now</button></div>" +
      '<div class="d-flex gap-2 flex-wrap"><button type="button" class="btn btn-lx-secondary" data-wish="' + esc(product.id) + '"><i class="bi bi-heart"></i> Wishlist</button>' +
      '<a class="btn btn-lx-secondary" id="waOrder" data-wa target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Order via WhatsApp</a>' +
      '<button type="button" class="btn btn-lx-secondary" data-bs-toggle="modal" data-bs-target="#sizeGuide">Size guide</button></div>' +
      '<div class="lx-trust"><div><i class="bi bi-cash-coin"></i> Cash on delivery</div><div><i class="bi bi-arrow-repeat"></i> 7-day returns</div><div><i class="bi bi-patch-check"></i> Authentic pieces</div></div>' +
      '<label class="form-label mt-3" for="shipCity">Estimate delivery</label><select class="form-select" id="shipCity">' + cities + '</select><p id="shipEstimate" class="small mt-2"></p></div></div>' +
      '<div class="lx-detail-tabs"><ul class="nav nav-tabs" role="tablist"><li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabDesc" type="button">Description</button></li>' +
      '<li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabDetails" type="button">Details & notes</button></li>' +
      '<li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabDelivery" type="button">Delivery & returns</button></li>' +
      '<li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabReviews" type="button">Reviews</button></li></ul>' +
      '<div class="tab-content"><div class="tab-pane fade show active" id="tabDesc"><p>' + esc(product.description) + "</p></div>" +
      '<div class="tab-pane fade" id="tabDetails">' + notes + '<table class="table mt-3"><tbody>' + detailRows + "</tbody></table></div>" +
      '<div class="tab-pane fade" id="tabDelivery"><p>Standard delivery is ' + LX.formatPrice(LX.config.standardFee) + " and becomes free on orders of " + LX.formatPrice(LX.config.freeDeliveryMin) + " or more. Express is 1–2 days and adds " + LX.formatPrice(LX.config.expressSurcharge) + ".</p><p>Unworn items with tags can be exchanged or returned within 7 days. Perfumes must be unopened. Stitched salwar kameez made to your size can be exchanged for size only if unworn.</p></div>" +
      '<div class="tab-pane fade" id="tabReviews"><div class="lx-bars">' + bars + '</div><div class="lx-review-list">' + reviews.map(function (review) {
        return "<article><strong>" + esc(review.title) + "</strong> " + stars(review.rating) + "<p>" + esc(review.text) + '</p><footer class="small text-muted">' + esc(review.name) + " · " + esc(review.city) + " · " + esc(review.date) + "</footer></article>";
      }).join("") + "</div></div></div></div>" +
      '<section class="lx-section"><div class="lx-section-head"><h2>You may also like</h2></div><div id="related"></div></section>' +
      '<section class="lx-section pt-0" id="recentSection"><div class="lx-section-head"><h2>Recently viewed</h2></div><div id="recent"></div></section>';

    paintSwatches(app);
    app.querySelectorAll("[data-pct]").forEach(function (el) { el.style.width = el.getAttribute("data-pct") + "%"; });
    paintPrice(app, product);
    bindOptions(app, product);
    window.LuxoraWish.paint();
    gallery(product);
    var guide = LX.sizeGuides[product.category];
    var guideBody = document.getElementById("sizeGuideBody");
    var guideTitle = document.getElementById("sizeGuideTitle");
    if (guide && guideBody) {
      if (guideTitle) guideTitle.textContent = guide.title;
      guideBody.innerHTML = "<p>" + esc(guide.note) + "</p><div class='table-responsive'><table class='table'><thead><tr>" +
        guide.columns.map(function (col) { return "<th>" + esc(col) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        guide.rows.map(function (row) { return "<tr>" + row.map(function (cell) { return "<td>" + esc(cell) + "</td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table></div>";
    }
    function selectionQty() {
      return Object.assign({ qty: Number(document.getElementById("productQty").value || 1) }, readSelection(app, product));
    }
    document.getElementById("addBtn").addEventListener("click", function () {
      var result = window.LuxoraCart.add(product.id, selectionQty());
      toast(result.message, result.ok ? "success" : "error");
    });
    document.getElementById("buyNow").addEventListener("click", function () {
      var result = window.LuxoraCart.add(product.id, selectionQty());
      if (!result.ok) { toast(result.message, "error"); return; }
      location.href = "checkout.html";
    });
    var sticky = document.getElementById("stickyAtc");
    if (sticky) {
      sticky.innerHTML = "<div><strong>" + esc(product.name) + '</strong><span data-price></span></div><button type="button" class="btn btn-lx-primary" data-product-atc>Add to Cart</button>';
      paintPrice(sticky, product);
      sticky.querySelector("button").addEventListener("click", function () { document.getElementById("addBtn").click(); });
      var buyRow = document.getElementById("buyRow");
      if (buyRow && "IntersectionObserver" in window) {
        var stickyWatcher = new IntersectionObserver(function (entries) {
          sticky.classList.toggle("is-on", !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
        });
        stickyWatcher.observe(buyRow);
      }
    }
    document.getElementById("shipCity").addEventListener("change", function (event) {
      var city = LX.cities.find(function (item) { return item.name === event.target.value; });
      var slot = document.getElementById("shipEstimate");
      if (!city) { slot.textContent = ""; return; }
      slot.textContent = "Standard delivery to " + city.name + ": " + city.days + " working days. Shipping " + LX.formatPrice(city.fee) + ", free when your order is " + LX.formatPrice(LX.config.freeDeliveryMin) + " or more.";
    });
    function waLink() {
      var selection = readSelection(app, product);
      var variant = [selection.size, selection.color, selection.stitch].filter(Boolean).join(", ");
      var text = "Hello " + LX.config.brand + ", I want to order " + product.name + (variant ? " (" + variant + ")" : "") + ". " + location.href;
      document.getElementById("waOrder").href = "https://wa.me/" + LX.config.whatsappNumber + "?text=" + encodeURIComponent(text);
    }
    waLink();
    app.addEventListener("click", function (event) {
      if (!event.target.closest("[data-option]")) return;
      waLink();
      var bar = document.getElementById("stickyAtc");
      if (bar) paintPrice(bar, product);
    });
    var related = LX.products.filter(function (item) { return item.category === product.category && item.id !== product.id; }).slice(0, 4);
    document.getElementById("related").innerHTML = '<div class="lx-grid">' + related.map(productCard).join("") + "</div>";
    var recentIds = [];
    try { recentIds = JSON.parse(localStorage.getItem("luxora_recent") || "[]"); } catch (err) { recentIds = []; }
    var recent = recentIds.map(LX.getProduct).filter(function (item) { return item && item.id !== product.id; }).slice(0, 4);
    var recentSection = document.getElementById("recentSection");
    if (!recent.length) recentSection.hidden = true;
    else document.getElementById("recent").innerHTML = '<div class="lx-grid">' + recent.map(productCard).join("") + "</div>";
    window.LuxoraWish.paint();
    var zoom = document.getElementById("galleryMain");
    var mainImage = document.getElementById("mainImage");
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      zoom.addEventListener("mousemove", function (event) {
        var rect = zoom.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;
        mainImage.style.transformOrigin = x + "% " + y + "%";
        mainImage.style.transform = "scale(1.65)";
      });
      zoom.addEventListener("mouseleave", function () { mainImage.style.transform = ""; });
    }
  }

  function gallery(product) {
    var index = 0;
    var mainImage = document.getElementById("mainImage");
    var count = document.getElementById("imageCount");
    function show(next) {
      index = (next + product.images.length) % product.images.length;
      mainImage.src = LX.resolveImage(product.images[index]);
      mainImage.alt = product.name + " — view " + (index + 1);
      count.textContent = (index + 1) + " / " + product.images.length;
      document.querySelectorAll("[data-thumb]").forEach(function (button) {
        var on = Number(button.getAttribute("data-thumb")) === index;
        button.setAttribute("aria-current", on ? "true" : "false");
      });
    }
    document.getElementById("thumbs").addEventListener("click", function (event) {
      var button = event.target.closest("[data-thumb]");
      if (button) show(Number(button.getAttribute("data-thumb")));
    });
    var startX = 0;
    var zone = document.getElementById("galleryMain");
    zone.addEventListener("touchstart", function (event) { startX = event.changedTouches[0].clientX; }, { passive: true });
    zone.addEventListener("touchend", function (event) {
      var delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) show(index + (delta < 0 ? 1 : -1));
    });
  }

  function orders() {
    try { return JSON.parse(localStorage.getItem("luxora_orders") || "[]"); }
    catch (err) { return []; }
  }

  function formatWhen(iso) {
    return new Date(iso).toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function initSuccess() {
    var app = document.getElementById("successApp");
    if (!app) return;
    var id = new URLSearchParams(location.search).get("id") || localStorage.getItem("luxora_last_order");
    var order = orders().find(function (item) { return item.id === id; });
    if (!order) {
      app.innerHTML = '<div class="lx-empty"><h1 class="h3">No order on this device</h1><p>If you just checked out in another browser, track it with your order ID and phone.</p><a class="btn btn-lx-primary" href="track-order.html">Track an order</a></div>';
      return;
    }
    var lines = order.items.map(function (line) {
      return "<li>" + esc(line.name) + " × " + line.qty + " — " + LX.formatPrice(line.unitPrice * line.qty) + "</li>";
    }).join("");
    var share = "My " + LX.config.brand + " order " + order.id + " is confirmed.";
    app.innerHTML =
      '<div class="lx-success"><svg class="lx-check-anim" viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="40"/><path d="M26 45 l12 12 24-26"/></svg>' +
      '<p class="lx-eyebrow">Thank you</p><h1>Order confirmed</h1><p class="lead">' + esc(order.id) + "</p>" +
      "<p>Estimated delivery <strong>" + esc(formatWhen(order.eta)) + "</strong> via " + (order.deliveryMethod === "express" ? "express" : "standard") + " delivery.</p>" +
      '<ul class="list-unstyled">' + lines + "</ul><p class='fw-bold'>Total " + LX.formatPrice(order.totals.total) + "</p>" +
      '<div class="d-flex flex-wrap gap-2 justify-content-center"><a class="btn btn-lx-primary" href="track-order.html">Track order</a><a class="btn btn-lx-secondary" href="shop.html">Continue shopping</a>' +
      '<a class="btn btn-lx-secondary" data-wa data-wa-text="' + esc(share) + '">Share on WhatsApp</a></div></div>';
    applyBrand();
  }

  function statusIndex(iso) {
    var hours = (Date.now() - new Date(iso).getTime()) / 36e5;
    if (hours < 1) return 0;
    if (hours < 6) return 1;
    if (hours < 24) return 2;
    if (hours < 72) return 3;
    return 4;
  }

  function initTrack() {
    var form = document.getElementById("trackForm");
    var result = document.getElementById("trackResult");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var id = form.orderId.value.trim().toUpperCase();
      var phone = form.phone.value.replace(/\D/g, "");
      if (phone.indexOf("92") === 0) phone = "0" + phone.slice(2);
      var order = orders().find(function (item) { return item.id.toUpperCase() === id; });
      if (!order || order.customer.phone.replace(/\D/g, "") !== phone) {
        result.innerHTML = '<div class="lx-empty mt-3"><h2 class="h5">We can’t match that order</h2><p>Check the order ID and the mobile number used at checkout. Orders stay on this browser only.</p></div>';
        return;
      }
      var labels = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];
      var current = statusIndex(order.createdAt);
      var hours = [0, 1, 6, 24, 72];
      result.innerHTML = '<h2 class="h4 mt-4">' + esc(order.id) + "</h2><p>" + esc(order.customer.name) + " · " + esc(order.customer.city) + "</p><ol class='lx-timeline'>" +
        labels.map(function (label, index) {
          var when = new Date(new Date(order.createdAt).getTime() + hours[index] * 3600000);
          var cls = index < current ? "is-done" : index === current ? "is-current" : "";
          return '<li class="' + cls + '"><strong>' + label + "</strong><br><span>" + (index <= current ? formatWhen(when.toISOString()) : "Pending") + "</span></li>";
        }).join("") + "</ol>";
    });
  }

  function users() {
    try { return JSON.parse(localStorage.getItem("luxora_users") || "[]"); }
    catch (err) { return []; }
  }

  function saveUsers(list) { localStorage.setItem("luxora_users", JSON.stringify(list)); }

  function initAccount() {
    var guest = document.getElementById("accountGuest");
    var dash = document.getElementById("accountDash");
    if (!guest || !dash) return;
    function show() {
      var email = localStorage.getItem("luxora_session");
      var user = users().find(function (item) { return item.email === email; });
      if (!user) { guest.hidden = false; dash.hidden = true; return; }
      guest.hidden = true;
      dash.hidden = false;
      var mine = orders().filter(function (order) {
        return order.customer.email.toLowerCase() === user.email.toLowerCase() || order.customer.phone === user.phone;
      });
      dash.innerHTML = '<h2 class="h3">Hello, ' + esc(user.name) + '</h2><p class="text-muted">' + esc(user.email) + (user.phone ? " · " + esc(user.phone) : "") + "</p>" +
        '<div class="row g-3"><div class="col-md-6"><div class="lx-panel-card"><h3 class="h5">Order history</h3>' +
        (mine.length ? mine.map(function (order) {
          return '<article class="lx-order"><h3>' + esc(order.id) + '</h3><p class="mb-1 small">' + formatWhen(order.createdAt) + " · " + LX.formatPrice(order.totals.total) + '</p><a href="track-order.html">Track</a></article>';
        }).join("") : "<p>No orders yet for this profile.</p>") +
        '</div></div><div class="col-md-6"><div class="lx-panel-card"><h3 class="h5">Saved addresses</h3>' +
        ((user.addresses && user.addresses.length) ? user.addresses.map(function (address) {
          return "<p>" + esc(address.address) + "<br>" + esc(address.city) + ", " + esc(address.province) + "</p>";
        }).join("") : "<p>Save an address at checkout next time.</p>") +
        '</div><p class="mt-3"><a class="btn btn-lx-secondary" href="wishlist.html">View wishlist</a></p></div></div>' +
        '<button type="button" class="btn btn-lx-primary mt-3" id="logoutBtn">Log out</button>';
      document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("luxora_session");
        show();
        toast("Signed out on this browser.", "success");
      });
    }
    var login = document.getElementById("loginForm");
    var register = document.getElementById("registerForm");
    if (login) login.addEventListener("submit", function (event) {
      event.preventDefault();
      var user = users().find(function (item) {
        return item.email.toLowerCase() === login.email.value.trim().toLowerCase() && item.password === login.password.value;
      });
      if (!user) { toast("Those details don’t match a profile on this browser.", "error"); return; }
      localStorage.setItem("luxora_session", user.email);
      login.reset();
      show();
    });
    if (register) register.addEventListener("submit", function (event) {
      event.preventDefault();
      var list = users();
      var email = register.email.value.trim();
      if (email && list.some(function (item) { return item.email.toLowerCase() === email.toLowerCase(); })) {
        toast("That email already has a demo profile here.", "error");
        return;
      }
      var user = {
        name: register.name.value.trim(),
        email: email,
        phone: register.phone.value.trim(),
        password: register.password.value,
        addresses: []
      };
      list.push(user);
      saveUsers(list);
      localStorage.setItem("luxora_session", user.email);
      register.reset();
      toast("Profile saved on this browser.", "success");
      show();
    });
    show();
  }

  function initContact() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var phone = form.phone.value.replace(/\D/g, "");
      if (phone.indexOf("92") === 0) phone = "0" + phone.slice(2);
      if (phone && !/^03\d{9}$/.test(phone)) form.phone.setCustomValidity("Use a 03XX mobile number.");
      else form.phone.setCustomValidity("");
      if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
      var messages = [];
      try { messages = JSON.parse(localStorage.getItem("luxora_messages") || "[]"); } catch (err) { messages = []; }
      messages.push({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        topic: form.topic.value,
        message: form.message.value.trim(),
        at: new Date().toISOString()
      });
      localStorage.setItem("luxora_messages", JSON.stringify(messages));
      form.reset();
      form.classList.remove("was-validated");
      toast("Message noted on this device. For a faster reply, WhatsApp us.", "success");
    });
  }

  function initFaq() {
    var hash = location.hash;
    if (!hash || !window.bootstrap) return;
    var pane = document.querySelector(hash);
    if (pane && pane.classList.contains("accordion-collapse")) {
      window.bootstrap.Collapse.getOrCreateInstance(pane).show();
    }
  }

  function boot() {
    applyBrand();
    chrome();
    bindSearch(document.getElementById("navSearch"), document.getElementById("searchPanel"));
    bindSearch(document.getElementById("mobileSearch"), document.getElementById("mobileSearchPanel"));
    document.addEventListener("click", function (event) {
      var quick = event.target.closest("[data-quick]");
      if (quick) openQuick(quick.getAttribute("data-quick"));
    });
    document.addEventListener("click", qtyClick);
    document.addEventListener("submit", newsletter);
    document.querySelectorAll("[data-scroll]").forEach(function (button) {
      button.addEventListener("click", function () {
        var scrollerEl = document.querySelector(button.getAttribute("data-scroll"));
        if (!scrollerEl) return;
        scrollerEl.scrollBy({ left: Number(button.getAttribute("data-dir") || 1) * scrollerEl.clientWidth * 0.85, behavior: "smooth" });
      });
    });
    document.addEventListener("error", function (event) {
      var img = event.target;
      if (!img || img.tagName !== "IMG" || img.dataset.fallback) return;
      img.dataset.fallback = "1";
      img.classList.add("is-missing");
    }, true);
    var page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "product") initProduct();
    if (page === "success") initSuccess();
    if (page === "track") initTrack();
    if (page === "account") initAccount();
    if (page === "contact") initContact();
    if (page === "faq") initFaq();
    if (window.LuxoraCart) window.LuxoraCart.init();
    if (window.LuxoraWish) window.LuxoraWish.init();
    if (window.LuxoraFilters && document.getElementById("productGrid")) window.LuxoraFilters.init();
    if (window.LuxoraCheckout && document.getElementById("checkoutForm")) window.LuxoraCheckout.init();
    observe(document);
  }

  if (document.readyState === "complete") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
