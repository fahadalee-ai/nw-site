/**
 * Shop and category filtering, sorting, and pagination.
 * State lives in the query string so a filtered view can be shared.
 */
(function () {
  "use strict";

  var PER_PAGE = 12;
  var PRICE_MIN = 500;
  var PRICE_MAX = 25000;
  var mode = "shop";
  var state = null;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function split(value) {
    return value ? String(value).split(",").filter(Boolean) : [];
  }

  function readState() {
    var q = new URLSearchParams(location.search);
    var locked = mode === "category" ? (q.get("cat") || "") : "";
    return {
      cat: locked ? [locked] : split(q.get("cat")),
      type: split(q.get("type")),
      size: split(q.get("size")),
      color: split(q.get("color")),
      brand: split(q.get("brand")),
      fabric: split(q.get("fabric")),
      rating: Number(q.get("rating") || 0),
      sale: q.get("sale") === "1",
      min: Number(q.get("min") || PRICE_MIN),
      max: Number(q.get("max") || PRICE_MAX),
      sort: q.get("sort") || "featured",
      page: Math.max(1, Number(q.get("page") || 1)),
      q: q.get("q") || "",
      view: localStorage.getItem("luxora_view") || "grid"
    };
  }

  function writeUrl() {
    var q = new URLSearchParams();
    if (mode === "category" && state.cat[0]) q.set("cat", state.cat[0]);
    else if (state.cat.length) q.set("cat", state.cat.join(","));
    if (state.type.length) q.set("type", state.type.join(","));
    if (state.size.length) q.set("size", state.size.join(","));
    if (state.color.length) q.set("color", state.color.join(","));
    if (state.brand.length) q.set("brand", state.brand.join(","));
    if (state.fabric.length) q.set("fabric", state.fabric.join(","));
    if (state.rating) q.set("rating", String(state.rating));
    if (state.sale) q.set("sale", "1");
    if (state.min !== PRICE_MIN) q.set("min", String(state.min));
    if (state.max !== PRICE_MAX) q.set("max", String(state.max));
    if (state.sort !== "featured") q.set("sort", state.sort);
    if (state.page > 1) q.set("page", String(state.page));
    if (state.q) q.set("q", state.q);
    var next = location.pathname + (q.toString() ? "?" + q.toString() : "");
    history.replaceState(null, "", next);
  }

  function textMatch(product, query) {
    var hay = [
      product.name, product.category, product.subCategory, product.brand, product.fabric,
      product.shortDescription, (product.tags || []).join(" "),
      (product.colors || []).map(function (c) { return c.name; }).join(" ")
    ].join(" ").toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean).every(function (word) {
      return hay.indexOf(word) !== -1;
    });
  }

  function passes(product, skip) {
    if (skip !== "q" && state.q && !textMatch(product, state.q)) return false;
    if (skip !== "cat" && state.cat.length && state.cat.indexOf(product.category) === -1) return false;
    if (skip !== "type" && state.type.length && state.type.indexOf(product.subCategory) === -1) return false;
    if (skip !== "size" && state.size.length && !product.sizes.some(function (size) { return state.size.indexOf(size) !== -1; })) return false;
    if (skip !== "color" && state.color.length && !product.colors.some(function (color) { return state.color.indexOf(color.name) !== -1; })) return false;
    if (skip !== "brand" && state.brand.length && state.brand.indexOf(product.brand) === -1) return false;
    if (skip !== "fabric" && state.fabric.length && state.fabric.indexOf(product.fabric) === -1) return false;
    if (skip !== "rating" && state.rating && product.rating < state.rating) return false;
    if (skip !== "sale" && state.sale && !(product.oldPrice && product.oldPrice > product.price)) return false;
    if (skip !== "price" && (product.price < state.min || product.price > state.max)) return false;
    return true;
  }

  function pool() {
    if (mode === "category" && state.cat[0]) {
      return window.LUXORA.products.filter(function (product) { return product.category === state.cat[0]; });
    }
    return window.LUXORA.products.slice();
  }

  function sortList(list) {
    var copy = list.slice();
    if (state.sort === "price-asc") copy.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === "price-desc") copy.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === "newest") copy.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    else if (state.sort === "rating") copy.sort(function (a, b) { return b.rating - a.rating || b.reviewCount - a.reviewCount; });
    else copy.sort(function (a, b) {
      return Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating || b.reviewCount - a.reviewCount;
    });
    return copy;
  }

  function unique(list) {
    var seen = {};
    return list.filter(function (item) {
      if (!item || seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }

  function facetValues(key, picker) {
    var counts = {};
    pool().filter(function (product) { return passes(product, key); }).forEach(function (product) {
      picker(product).forEach(function (value) {
        if (!value) return;
        counts[value] = (counts[value] || 0) + 1;
      });
    });
    return counts;
  }

  function checkList(name, counts, selected) {
    var keys = Object.keys(counts).sort();
    if (!keys.length) return "";
    return keys.map(function (key) {
      var on = selected.indexOf(key) !== -1;
      return '<label class="lx-check-row"><span><input type="checkbox" data-facet="' + name + '" value="' + esc(key) + '"' + (on ? " checked" : "") + "> " + esc(key) + '</span><span>' + counts[key] + "</span></label>";
    }).join("");
  }

  function renderFilters() {
    var body = document.getElementById("filterBody");
    if (!body) return;
    var html = "";
    if (mode !== "category") {
      var cats = facetValues("cat", function (product) {
        var category = window.LUXORA.getCategory(product.category);
        return [category ? category.name + "|" + product.category : ""];
      });
      html += '<div class="lx-filter-group"><h2>Category</h2>' + Object.keys(cats).map(function (key) {
        var parts = key.split("|");
        var id = parts[1];
        var on = state.cat.indexOf(id) !== -1;
        return '<label class="lx-check-row"><span><input type="checkbox" data-facet="cat" value="' + esc(id) + '"' + (on ? " checked" : "") + "> " + esc(parts[0]) + '</span><span>' + cats[key] + "</span></label>";
      }).join("") + "</div>";
    }

    html += '<div class="lx-filter-group"><h2>Type</h2>' + checkList("type", facetValues("type", function (p) { return [p.subCategory]; }), state.type) + "</div>";

    html += '<div class="lx-filter-group"><h2>Price</h2>' +
      '<div class="d-flex justify-content-between small"><span id="priceMinLabel"></span><span id="priceMaxLabel"></span></div>' +
      '<div class="lx-range"><div class="lx-range-track" id="priceTrack"></div>' +
      '<label class="visually-hidden" for="priceMin">Minimum price</label>' +
      '<input type="range" id="priceMin" min="' + PRICE_MIN + '" max="' + PRICE_MAX + '" step="100" value="' + state.min + '">' +
      '<label class="visually-hidden" for="priceMax">Maximum price</label>' +
      '<input type="range" id="priceMax" min="' + PRICE_MIN + '" max="' + PRICE_MAX + '" step="100" value="' + state.max + '">' +
      "</div></div>";

    var sizeOrder = ["S", "M", "L", "XL", "XXL", "Free Size", "50ml", "100ml", "28", "30", "32", "34", "36", "38"];
    var sizes = facetValues("size", function (p) { return p.sizes; });
    html += '<div class="lx-filter-group"><h2>Size</h2><div>' + Object.keys(sizes).sort(function (a, b) {
      var ia = sizeOrder.indexOf(a);
      var ib = sizeOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    }).map(function (size) {
      var on = state.size.indexOf(size) !== -1;
      return '<button type="button" class="lx-size' + (on ? " is-on" : "") + '" data-facet="size" data-value="' + esc(size) + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(size) + "</button>";
    }).join("") + "</div></div>";

    var colors = {};
    pool().filter(function (p) { return passes(p, "color"); }).forEach(function (product) {
      product.colors.forEach(function (color) { colors[color.name] = color.hex; });
    });
    html += '<div class="lx-filter-group"><h2>Colour</h2><div class="lx-swatches">' + Object.keys(colors).sort().map(function (name) {
      var on = state.color.indexOf(name) !== -1;
      return '<button type="button" class="lx-swatch' + (on ? " is-on" : "") + '" data-facet="color" data-value="' + esc(name) + '" data-hex="' + esc(colors[name]) + '" aria-label="' + esc(name) + '" aria-pressed="' + (on ? "true" : "false") + '"></button>';
    }).join("") + "</div></div>";

    html += '<div class="lx-filter-group"><h2>Brand</h2>' + checkList("brand", facetValues("brand", function (p) { return [p.brand]; }), state.brand) + "</div>";
    var fabrics = facetValues("fabric", function (p) { return [p.fabric]; });
    if (Object.keys(fabrics).length) {
      html += '<div class="lx-filter-group"><h2>Fabric</h2>' + checkList("fabric", fabrics, state.fabric) + "</div>";
    }
    html += '<div class="lx-filter-group"><h2>Rating</h2>' +
      '<label><input type="radio" name="rating" data-facet="rating" value="0"' + (!state.rating ? " checked" : "") + "> All</label>" +
      '<label><input type="radio" name="rating" data-facet="rating" value="4"' + (state.rating === 4 ? " checked" : "") + "> 4 stars & up</label>" +
      '<label><input type="radio" name="rating" data-facet="rating" value="3"' + (state.rating === 3 ? " checked" : "") + "> 3 stars & up</label></div>";
    html += '<div class="lx-filter-group"><h2>Offers</h2><label><input type="checkbox" data-facet="sale"' + (state.sale ? " checked" : "") + "> On sale</label></div>";
    html += '<button type="button" class="btn btn-lx-secondary w-100 mt-3" id="clearFilters">Clear filters</button>';
    body.innerHTML = html;
    if (window.LuxoraUI) window.LuxoraUI.paintSwatches(body);
    paintPrice();
  }

  function paintPrice() {
    var minLabel = document.getElementById("priceMinLabel");
    var maxLabel = document.getElementById("priceMaxLabel");
    var track = document.getElementById("priceTrack");
    if (minLabel) minLabel.textContent = window.LUXORA.formatPrice(state.min);
    if (maxLabel) maxLabel.textContent = window.LUXORA.formatPrice(state.max);
    if (track) {
      var span = PRICE_MAX - PRICE_MIN;
      track.style.setProperty("--min", ((state.min - PRICE_MIN) / span * 100) + "%");
      track.style.setProperty("--max", ((state.max - PRICE_MIN) / span * 100) + "%");
    }
  }

  function chips() {
    var box = document.getElementById("activeFilters");
    if (!box) return;
    var items = [];
    if (state.q) items.push(["q", "Search: " + state.q]);
    if (mode !== "category") state.cat.forEach(function (id) {
      var category = window.LUXORA.getCategory(id);
      items.push(["cat:" + id, category ? category.name : id]);
    });
    state.type.forEach(function (v) { items.push(["type:" + v, v]); });
    state.size.forEach(function (v) { items.push(["size:" + v, "Size " + v]); });
    state.color.forEach(function (v) { items.push(["color:" + v, v]); });
    state.brand.forEach(function (v) { items.push(["brand:" + v, v]); });
    state.fabric.forEach(function (v) { items.push(["fabric:" + v, v]); });
    if (state.rating) items.push(["rating", state.rating + "+ stars"]);
    if (state.sale) items.push(["sale", "On sale"]);
    if (state.min !== PRICE_MIN || state.max !== PRICE_MAX) items.push(["price", window.LUXORA.formatPrice(state.min) + " – " + window.LUXORA.formatPrice(state.max)]);
    box.innerHTML = items.map(function (item) {
      return '<button type="button" class="lx-chip" data-clear="' + esc(item[0]) + '">' + esc(item[1]) + " ×</button>";
    }).join("");
  }

  function renderResults() {
    var grid = document.getElementById("productGrid");
    if (!grid || !window.LuxoraUI) return;
    var matched = sortList(pool().filter(function (product) { return passes(product); }));
    var pages = Math.max(1, Math.ceil(matched.length / PER_PAGE));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * PER_PAGE;
    var slice = matched.slice(start, start + PER_PAGE);
    var count = document.getElementById("productCount");
    if (count) {
      count.textContent = matched.length ? (start + 1) + "–" + Math.min(start + PER_PAGE, matched.length) + " of " + matched.length + " pieces" : "No pieces match";
    }
    grid.classList.toggle("is-list", state.view === "list");
    grid.innerHTML = slice.length ? slice.map(window.LuxoraUI.productCard).join("") : '<div class="lx-empty"><h2 class="h5">No matches</h2><p>Try clearing a filter, or search for lawn, oud, or denim.</p></div>';
    renderPager(pages);
    if (window.LuxoraWish) window.LuxoraWish.paint();
    var sort = document.getElementById("sortSelect");
    if (sort) sort.value = state.sort;
    var gridBtn = document.getElementById("viewGrid");
    var listBtn = document.getElementById("viewList");
    if (gridBtn) gridBtn.setAttribute("aria-pressed", state.view === "grid" ? "true" : "false");
    if (listBtn) listBtn.setAttribute("aria-pressed", state.view === "list" ? "true" : "false");
    var search = document.getElementById("navSearch");
    if (search && document.activeElement !== search) search.value = state.q;
  }

  function renderPager(pages) {
    var nav = document.getElementById("pagination");
    if (!nav) return;
    if (pages < 2) { nav.innerHTML = ""; return; }
    var html = '<button type="button" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? " disabled" : "") + ' aria-label="Previous page">‹</button>';
    for (var i = 1; i <= pages; i += 1) {
      html += '<button type="button" data-page="' + i + '"' + (i === state.page ? ' aria-current="page"' : "") + ">" + i + "</button>";
    }
    html += '<button type="button" data-page="' + (state.page + 1) + '"' + (state.page === pages ? " disabled" : "") + ' aria-label="Next page">›</button>';
    nav.innerHTML = html;
  }

  function banner() {
    var slot = document.getElementById("categoryBanner");
    var title = document.getElementById("pageTitle");
    var lead = document.getElementById("pageLead");
    var crumb = document.getElementById("crumb");
    if (mode !== "category") {
      if (title) title.textContent = state.q ? "Search" : "Shop";
      if (lead) lead.textContent = state.q ? "Results for “" + state.q + "”." : "Every piece in the house, from oud to khaddar.";
      if (crumb) crumb.innerHTML = '<li class="breadcrumb-item"><a href="index.html">Home</a></li><li class="breadcrumb-item active" aria-current="page">Shop</li>';
      return;
    }
    var category = window.LUXORA.getCategory(state.cat[0]);
    if (!category) {
      if (slot) slot.hidden = true;
      if (title) title.textContent = "Category not found";
      if (lead) lead.textContent = "That edit isn’t in the house. Browse the full shop instead.";
      document.getElementById("productGrid").innerHTML = '<div class="lx-empty"><a class="btn btn-lx-primary" href="shop.html">Go to the shop</a></div>';
      return false;
    }
    if (title) title.textContent = category.name;
    if (lead) lead.textContent = category.blurb;
    if (crumb) {
      crumb.innerHTML = '<li class="breadcrumb-item"><a href="index.html">Home</a></li><li class="breadcrumb-item"><a href="shop.html">Shop</a></li><li class="breadcrumb-item active" aria-current="page">' + esc(category.name) + "</li>";
    }
    if (slot) {
      slot.hidden = false;
      slot.innerHTML = '<img src="' + esc(window.LUXORA.resolveImage(category.banner)) + '" alt="' + esc(category.name) + ' collection" width="1600" height="640"><div><p class="lx-eyebrow">Collection</p><h2 class="h3 mb-1">' + esc(category.name) + "</h2><p class='mb-0'>" + esc(category.blurb) + "</p></div>";
    }
    document.title = category.name + " — " + window.LUXORA.config.brand;
    return true;
  }

  function toggleValue(list, value) {
    return list.indexOf(value) === -1 ? list.concat(value) : list.filter(function (item) { return item !== value; });
  }

  function refresh(resetPage) {
    if (resetPage) state.page = 1;
    writeUrl();
    if (banner() === false) return;
    renderFilters();
    chips();
    renderResults();
  }

  function bind() {
    var body = document.getElementById("filterBody");
    if (!body || body.dataset.bound) return;
    body.dataset.bound = "1";
    body.addEventListener("change", function (event) {
      var input = event.target;
      var facet = input.getAttribute("data-facet");
      if (!facet) return;
      if (facet === "sale") state.sale = input.checked;
      else if (facet === "rating") state.rating = Number(input.value);
      else state[facet] = toggleValue(state[facet], input.value);
      refresh(true);
    });
    body.addEventListener("click", function (event) {
      var button = event.target.closest("[data-facet='size'], [data-facet='color']");
      if (button) {
        var facet = button.getAttribute("data-facet");
        state[facet] = toggleValue(state[facet], button.getAttribute("data-value"));
        refresh(true);
      }
      if (event.target.closest("#clearFilters")) {
        var cat = mode === "category" ? state.cat : [];
        var query = state.q;
        state = readState();
        state.cat = cat;
        state.type = [];
        state.size = [];
        state.color = [];
        state.brand = [];
        state.fabric = [];
        state.rating = 0;
        state.sale = false;
        state.min = PRICE_MIN;
        state.max = PRICE_MAX;
        state.q = query;
        state.page = 1;
        refresh(false);
      }
    });
    body.addEventListener("input", function (event) {
      if (event.target.id !== "priceMin" && event.target.id !== "priceMax") return;
      var min = Number(document.getElementById("priceMin").value);
      var max = Number(document.getElementById("priceMax").value);
      if (min > max) {
        if (event.target.id === "priceMin") min = max;
        else max = min;
      }
      state.min = min;
      state.max = max;
      paintPrice();
      writeUrl();
      renderResults();
      chips();
    });

    var sort = document.getElementById("sortSelect");
    if (sort) sort.addEventListener("change", function () { state.sort = sort.value; refresh(true); });
    var gridBtn = document.getElementById("viewGrid");
    var listBtn = document.getElementById("viewList");
    function setView(view) {
      state.view = view;
      localStorage.setItem("luxora_view", view);
      renderResults();
    }
    if (gridBtn) gridBtn.addEventListener("click", function () { setView("grid"); });
    if (listBtn) listBtn.addEventListener("click", function () { setView("list"); });
    var pager = document.getElementById("pagination");
    if (pager) pager.addEventListener("click", function (event) {
      var button = event.target.closest("[data-page]");
      if (!button || button.disabled) return;
      state.page = Number(button.getAttribute("data-page"));
      writeUrl();
      renderResults();
      var toolbar = document.querySelector(".lx-toolbar");
      if (toolbar) toolbar.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    var chipBox = document.getElementById("activeFilters");
    if (chipBox) chipBox.addEventListener("click", function (event) {
      var button = event.target.closest("[data-clear]");
      if (!button) return;
      var key = button.getAttribute("data-clear");
      if (key === "q") state.q = "";
      else if (key === "sale") state.sale = false;
      else if (key === "rating") state.rating = 0;
      else if (key === "price") { state.min = PRICE_MIN; state.max = PRICE_MAX; }
      else {
        var parts = key.split(":");
        state[parts[0]] = state[parts[0]].filter(function (item) { return item !== parts.slice(1).join(":"); });
      }
      refresh(true);
    });
  }

  window.LuxoraFilters = {
    init: function () {
      mode = document.body.dataset.page === "category" ? "category" : "shop";
      state = readState();
      bind();
      if (banner() === false) return;
      renderFilters();
      chips();
      renderResults();
    }
  };
})();
