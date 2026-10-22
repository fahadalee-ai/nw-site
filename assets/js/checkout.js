/**
 * Checkout — validates the Pakistani address form and stores the order locally.
 * Card numbers are never written to localStorage.
 */
(function () {
  "use strict";

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function digits(value) {
    var raw = String(value || "").replace(/\D/g, "");
    if (raw.indexOf("92") === 0) raw = "0" + raw.slice(2);
    return raw;
  }

  function validPhone(value) {
    return /^03\d{9}$/.test(digits(value));
  }

  function formatPhone(value) {
    var raw = digits(value);
    if (raw.length !== 11) return value;
    return raw.slice(0, 4) + "-" + raw.slice(4);
  }

  function orders() {
    try { return JSON.parse(localStorage.getItem("luxora_orders") || "[]"); }
    catch (err) { return []; }
  }

  function saveOrders(list) {
    localStorage.setItem("luxora_orders", JSON.stringify(list));
  }

  function orderId(existing) {
    var year = new Date().getFullYear();
    var id = "";
    var guard = 0;
    do {
      id = "LX-" + year + "-" + Math.floor(10000 + Math.random() * 90000);
      guard += 1;
    } while (existing.some(function (order) { return order.id === id; }) && guard < 30);
    return id;
  }

  function refreshSummary() {
    var box = document.getElementById("checkoutSummary");
    if (!box || !window.LuxoraCart) return;
    var method = (document.querySelector('input[name="delivery"]:checked') || {}).value || "standard";
    var totals = window.LuxoraCart.totals(method);
    var items = window.LuxoraCart.read();
    box.innerHTML = "<h2>Your order</h2>" + items.map(function (line) {
      return '<div class="lx-summary-row"><span>' + esc(line.name) + " × " + line.qty + "</span><span>" + window.LUXORA.formatPrice(line.unitPrice * line.qty) + "</span></div>";
    }).join("") + window.LuxoraCart.summaryRows(totals) +
      '<p class="small text-muted mb-0">Cash on delivery is available nationwide. Express adds ' + window.LUXORA.formatPrice(window.LUXORA.config.expressSurcharge) + ".</p>";
  }

  function fillPlaces() {
    var province = document.getElementById("province");
    var city = document.getElementById("city");
    if (!province || !city) return;
    var names = [];
    window.LUXORA.cities.forEach(function (item) {
      if (names.indexOf(item.province) === -1) names.push(item.province);
    });
    province.innerHTML = '<option value="">Select province</option>' + names.map(function (name) {
      return '<option value="' + esc(name) + '">' + esc(name) + "</option>";
    }).join("");
    function fillCities() {
      var list = window.LUXORA.cities.filter(function (item) {
        return !province.value || item.province === province.value;
      });
      city.innerHTML = '<option value="">Select city</option>' + list.map(function (item) {
        return '<option value="' + esc(item.name) + '">' + esc(item.name) + "</option>";
      }).join("");
    }
    province.addEventListener("change", fillCities);
    fillCities();
  }

  function fillPaymentCopy() {
    var pay = window.LUXORA.config.payments;
    var jazz = document.getElementById("jazzcashNo");
    var easy = document.getElementById("easypaisaNo");
    var bank = document.getElementById("bankDetails");
    if (jazz) jazz.textContent = pay.jazzcash.title + " · " + pay.jazzcash.account;
    if (easy) easy.textContent = pay.easypaisa.title + " · " + pay.easypaisa.account;
    if (bank) bank.textContent = pay.bank.bank + " · " + pay.bank.title + " · A/C " + pay.bank.account + " · IBAN " + pay.bank.iban;
  }

  function showPanel() {
    var selected = (document.querySelector('input[name="payment"]:checked') || {}).value || "cod";
    document.querySelectorAll("[data-pay-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-pay-panel") !== selected;
    });
  }

  function emptyState() {
    var form = document.getElementById("checkoutForm");
    var empty = document.getElementById("checkoutEmpty");
    if (window.LuxoraCart.read().length) {
      if (form) form.hidden = false;
      if (empty) empty.hidden = true;
      return false;
    }
    if (form) form.hidden = true;
    if (empty) empty.hidden = false;
    return true;
  }

  function init() {
    if (emptyState()) return;
    fillPlaces();
    fillPaymentCopy();
    showPanel();
    refreshSummary();
    document.querySelectorAll('input[name="payment"]').forEach(function (input) {
      input.addEventListener("change", showPanel);
    });
    document.querySelectorAll('input[name="delivery"]').forEach(function (input) {
      input.addEventListener("change", refreshSummary);
    });
    var phone = document.getElementById("phone");
    if (phone) {
      phone.addEventListener("blur", function () {
        if (validPhone(phone.value)) phone.value = formatPhone(phone.value);
      });
    }
    var form = document.getElementById("checkoutForm");
    form.addEventListener("submit", submit);
    var session = localStorage.getItem("luxora_session");
    if (session) {
      try {
        var users = JSON.parse(localStorage.getItem("luxora_users") || "[]");
        var user = users.find(function (item) { return item.email === session; });
        if (user) {
          document.getElementById("fullName").value = user.name || "";
          document.getElementById("email").value = user.email || "";
          if (user.phone) document.getElementById("phone").value = user.phone;
        }
      } catch (err) { /* ignore broken demo storage */ }
    }
  }

  function submit(event) {
    event.preventDefault();
    var form = event.target;
    var phone = document.getElementById("phone");
    phone.setCustomValidity(validPhone(phone.value) ? "" : "Enter a Pakistani mobile number, 03XX-XXXXXXX.");
    var postal = document.getElementById("postal");
    if (postal.value && !/^\d{5}$/.test(postal.value.trim())) postal.setCustomValidity("Use a 5-digit postal code, or leave it blank.");
    else postal.setCustomValidity("");
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      var first = form.querySelector(":invalid");
      if (first) first.focus();
      return;
    }
    var existing = orders();
    var id = orderId(existing);
    var method = (document.querySelector('input[name="delivery"]:checked') || {}).value || "standard";
    var payment = (document.querySelector('input[name="payment"]:checked') || {}).value || "cod";
    var totals = window.LuxoraCart.totals(method);
    var eta = new Date();
    eta.setDate(eta.getDate() + (method === "express" ? 2 : 5));
    var proof = document.querySelector('[data-pay-panel="' + payment + '"] input[type="file"]');
    var order = {
      id: id,
      createdAt: new Date().toISOString(),
      items: window.LuxoraCart.read(),
      customer: {
        name: document.getElementById("fullName").value.trim(),
        phone: formatPhone(phone.value),
        email: document.getElementById("email").value.trim(),
        province: document.getElementById("province").value,
        city: document.getElementById("city").value,
        address: document.getElementById("address").value.trim(),
        postal: postal.value.trim(),
        notes: document.getElementById("notes").value.trim()
      },
      deliveryMethod: method,
      paymentMethod: payment,
      paymentNote: proof && proof.files && proof.files[0] ? proof.files[0].name : "",
      totals: totals,
      eta: eta.toISOString()
    };
    existing.unshift(order);
    saveOrders(existing);
    localStorage.setItem("luxora_last_order", id);
    if (document.getElementById("saveAddress") && document.getElementById("saveAddress").checked) {
      saveAddress(order.customer);
    }
    window.LuxoraCart.clear();
    location.href = "order-success.html?id=" + encodeURIComponent(id);
  }

  function saveAddress(customer) {
    var email = localStorage.getItem("luxora_session");
    if (!email) return;
    var users = JSON.parse(localStorage.getItem("luxora_users") || "[]");
    users = users.map(function (user) {
      if (user.email !== email) return user;
      var addresses = user.addresses || [];
      addresses.push({
        province: customer.province,
        city: customer.city,
        address: customer.address,
        postal: customer.postal
      });
      user.addresses = addresses.slice(-5);
      user.phone = user.phone || customer.phone;
      user.name = user.name || customer.name;
      return user;
    });
    localStorage.setItem("luxora_users", JSON.stringify(users));
  }

  window.LuxoraCheckout = { init: init, refreshSummary: refreshSummary };
})();
