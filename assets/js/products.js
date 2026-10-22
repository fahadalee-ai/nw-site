/**
 * LUXORA catalogue — the only data file.
 * Change LUXORA.config.brand (and colours in assets/css/style.css) to rebrand.
 * Product photos: each images[] entry is the final WebP path. Matching SVG
 * placeholders ship beside them. Set config.imageMode to "webp" once photos exist.
 */
(function (root) {
  "use strict";

  var config = {
    brand: "Nawab Sahab",
    tagline: "Wear Your Story",
    urduWelcome: "خوش آمدید",
    currencyLabel: "Rs.",
    locale: "en-PK",
    freeDeliveryMin: 5000,
    standardFee: 250,
    expressSurcharge: 400,
    whatsappNumber: "923001234567",
    whatsappDisplay: "+92 300 1234567",
    email: "hello@nawabsahab.pk",
    instagram: "https://instagram.com/nawabsahab",
    instagramHandle: "@nawabsahab",
    facebook: "https://facebook.com/nawabsahab",
    tiktok: "https://www.tiktok.com/@nawabsahab",
    siteUrl: "https://nawabsahab.pk",
    imageMode: "photo",
    addresses: {
      lahore: "12-C, Gulberg III, Lahore",
      karachi: "Plot 18, Bukhari Commercial, DHA Phase 6, Karachi"
    },
    hours: "Mon–Sat 11:00–20:00 PKT · Sunday 12:00–18:00",
    promoCodes: { NAWAB10: 10, WELCOME15: 15 },
    payments: {
      jazzcash: { account: "0300-1234567", title: "Nawab Sahab" },
      easypaisa: { account: "0301-1234567", title: "Nawab Sahab" },
      bank: {
        bank: "Meezan Bank",
        title: "Nawab Sahab (Pvt.) Ltd",
        account: "0123-4567890",
        iban: "PK00MEZN0001234567890123"
      }
    },
    mapQuery: "Gulberg III Lahore"
  };

  var categories = [
    {
      id: "perfumes",
      name: "Perfumes",
      blurb: "Oud, rose, and citrus composed for warm evenings — bottled in sizes you can travel with or keep on the dresser.",
      ratio: "square",
      image: "assets/images/categories/cat-perfumes.webp",
      banner: "assets/images/banners/banner-perfumes.webp",
      subs: ["Men", "Women", "Unisex"]
    },
    {
      id: "clothes",
      name: "Clothes",
      blurb: "Kurtas, co-ord sets, shirts, and jackets cut with a quieter luxury — made for iftars, offices, and weekends.",
      ratio: "portrait",
      image: "assets/images/categories/cat-clothes.webp",
      banner: "assets/images/banners/banner-clothes.webp",
      subs: ["Kurtas", "Co-ord Sets", "Shirts", "Jackets"]
    },
    {
      id: "tshirts",
      name: "T-Shirts",
      blurb: "Heavyweight cotton tees in a clean palette. Designed to sit well on their own or under a jacket.",
      ratio: "portrait",
      image: "assets/images/categories/cat-tshirts.webp",
      banner: "assets/images/banners/banner-tshirts.webp",
      subs: ["Essential", "Graphic", "Oversized"]
    },
    {
      id: "hats",
      name: "Hats",
      blurb: "Caps, bucket hats, and beanies in free size — the small piece that finishes a look.",
      ratio: "square",
      image: "assets/images/categories/cat-hats.webp",
      banner: "assets/images/banners/banner-hats.webp",
      subs: ["Caps", "Bucket Hats", "Beanies"]
    },
    {
      id: "jeans",
      name: "Jeans",
      blurb: "Slim, straight, and relaxed denim with waist sizes 28–38. Washes chosen for Pakistani light.",
      ratio: "portrait",
      image: "assets/images/categories/cat-jeans.webp",
      banner: "assets/images/banners/banner-jeans.webp",
      subs: ["Slim", "Straight", "Relaxed"]
    },
    {
      id: "salwar-kameez",
      name: "Salwar Kameez",
      blurb: "Lawn, cotton, khaddar, and wash & wear. Stitched or unstitched, in two- and three-piece sets.",
      ratio: "portrait",
      image: "assets/images/categories/cat-salwar.webp",
      banner: "assets/images/banners/banner-salwar.webp",
      subs: ["2-Piece", "3-Piece"]
    }
  ];

  var cities = [
    { name: "Karachi", province: "Sindh", days: "2–4", fee: 250 },
    { name: "Lahore", province: "Punjab", days: "2–4", fee: 250 },
    { name: "Islamabad", province: "Islamabad Capital Territory", days: "2–3", fee: 250 },
    { name: "Rawalpindi", province: "Punjab", days: "2–4", fee: 250 },
    { name: "Faisalabad", province: "Punjab", days: "3–5", fee: 250 },
    { name: "Multan", province: "Punjab", days: "3–5", fee: 300 },
    { name: "Peshawar", province: "Khyber Pakhtunkhwa", days: "3–5", fee: 300 },
    { name: "Quetta", province: "Balochistan", days: "4–6", fee: 350 },
    { name: "Hyderabad", province: "Sindh", days: "3–5", fee: 300 },
    { name: "Sialkot", province: "Punjab", days: "3–5", fee: 250 },
    { name: "Gujranwala", province: "Punjab", days: "3–5", fee: 250 },
    { name: "Abbottabad", province: "Khyber Pakhtunkhwa", days: "4–6", fee: 350 },
    { name: "Sukkur", province: "Sindh", days: "4–6", fee: 350 },
    { name: "Bahawalpur", province: "Punjab", days: "3–5", fee: 300 },
    { name: "Sargodha", province: "Punjab", days: "3–5", fee: 300 },
    { name: "Muzaffarabad", province: "Azad Jammu & Kashmir", days: "4–7", fee: 400 },
    { name: "Gilgit", province: "Gilgit-Baltistan", days: "5–8", fee: 500 }
  ];

  var sizeGuides = {
    perfumes: {
      title: "Fragrance size guide",
      note: "Both sizes use the same concentration. 100ml is the better value if this is a signature scent.",
      columns: ["Size", "Best for", "Typical longevity"],
      rows: [
        ["50ml", "Travel, gifting, trying a new scent", "6–8 hours"],
        ["100ml", "Everyday signature", "8–12 hours"]
      ]
    },
    clothes: {
      title: "Clothing size guide",
      note: "Kurtas and co-ords are cut with ease. If you are between sizes, choose the larger one for a relaxed drape.",
      columns: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["S", "38", "38", "16.5"],
        ["M", "40", "39", "17.5"],
        ["L", "42", "40", "18.5"],
        ["XL", "45", "41", "19.5"],
        ["XXL", "48", "42", "20.5"]
      ]
    },
    tshirts: {
      title: "T-shirt size guide",
      note: "Measurements are garment chest, laid flat and doubled. Oversized styles already include extra room.",
      columns: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      rows: [
        ["S", "38", "27", "16.5"],
        ["M", "40", "28", "17.5"],
        ["L", "42", "29", "18.5"],
        ["XL", "45", "30", "19.5"],
        ["XXL", "48", "31", "20.5"]
      ]
    },
    hats: {
      title: "Hat size guide",
      note: "All hats are free size with an inner adjuster or soft knit that fits most adults.",
      columns: ["Size", "Circumference", "Fit"],
      rows: [["Free Size", "56–59 cm", "Adjustable band or stretch knit"]]
    },
    jeans: {
      title: "Jeans waist guide",
      note: "Sizes are waist inches. Measure a favourite pair laid flat across the waistband and double it.",
      columns: ["Waist", "Relaxed hip room"],
      rows: [
        ["28", "Slim through the thigh"],
        ["30", "Everyday fit"],
        ["32", "Everyday fit"],
        ["34", "Room through the seat"],
        ["36", "Room through the seat"],
        ["38", "Relaxed waist"]
      ]
    },
    "salwar-kameez": {
      title: "Salwar kameez size guide",
      note: "Stitched sets follow the chart below. Unstitched includes standard meterage listed on the product (usually 4–5 metres plus dupatta) so your tailor can cut to you.",
      columns: ["Size", "Chest (in)", "Shirt length (in)", "Trouser length (in)"],
      rows: [
        ["S", "36", "38", "40"],
        ["M", "38", "39", "41"],
        ["L", "41", "40", "42"],
        ["XL", "44", "41", "42"]
      ]
    }
  };

  var reviews = [
    { name: "Ayesha Rahman", city: "Karachi", rating: 5, kind: "apparel", title: "Stitching I can trust", text: "The stitching is clean and the colour matched the photos. I wore the lawn set to a dholki and kept getting asked where it was from.", date: "12 Sep 2026" },
    { name: "Hassan Ali", city: "Lahore", rating: 5, kind: "perfume", title: "Oud, but polished", text: "It smells expensive without filling the whole office. Still there on my sleeve at maghrib. The bottle has a proper weight to it.", date: "2 Oct 2026" },
    { name: "Fatima Noor", city: "Islamabad", rating: 4, kind: "any", title: "Careful delivery", text: "Arrived in three days, folded properly, no plastic smell. I checked the size chart and the fit was exactly as described.", date: "28 Aug 2026" },
    { name: "Bilal Ahmed", city: "Faisalabad", rating: 5, kind: "any", title: "COD was simple", text: "Paid cash on delivery, opened the parcel in front of the rider, and the quality was well above this price. Will order again before Eid.", date: "18 Sep 2026" },
    { name: "Maham Siddiqui", city: "Karachi", rating: 4, kind: "apparel", title: "Beautiful fall", text: "Embroidery is neat and the lawn falls well. The dupatta could be a little longer for my height, but the print is lovely in daylight.", date: "9 Jul 2026" },
    { name: "Usman Tariq", city: "Peshawar", rating: 5, kind: "perfume", title: "A real gift", text: "Bought the 100ml as a gift. Box, cap, and scent all feel like a house fragrance, not a copy. He has worn it every Friday since.", date: "21 Aug 2026" },
    { name: "Zara Iqbal", city: "Lahore", rating: 5, kind: "any", title: "WhatsApp actually replied", text: "I was unsure between two sizes. They answered on WhatsApp in a few minutes and the exchange, when I needed it, took a week.", date: "4 Oct 2026" },
    { name: "Hira Shah", city: "Multan", rating: 4, kind: "apparel", title: "Denim that holds", text: "Sturdy denim, clean wash, true to the waist chart. It softened after two wears without losing shape.", date: "15 Sep 2026" },
    { name: "Ahmed Raza", city: "Rawalpindi", rating: 5, kind: "any", title: "Better in person", text: "Packed in a rigid box. The colour is deeper than the screen suggested, in a good way. Delivery to Islamabad was on time.", date: "11 Oct 2026" },
    { name: "Sana Javed", city: "Hyderabad", rating: 4, kind: "perfume", title: "Soft, not synthetic", text: "A floral that doesn’t turn sharp in the heat. I could still smell it on my shawl the next morning.", date: "30 Sep 2026" }
  ];

  function imagesFor(category, slug) {
    return ["assets/images/products/" + category + "/" + category + "-" + slug + "-1.jpg"];
  }

  function item(p) {
    var oldPrice = p.oldPrice || null;
    var discountPercent = oldPrice ? Math.round((1 - p.price / oldPrice) * 100) : 0;
    var badge = p.badge || null;
    if (!badge && p.isNew) badge = "New";
    else if (!badge && discountPercent >= 10) badge = "Sale";
    else if (!badge && p.isBestSeller) badge = "Best Seller";
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      subCategory: p.subCategory,
      price: p.price,
      oldPrice: oldPrice,
      discountPercent: discountPercent,
      rating: p.rating,
      reviewCount: p.reviewCount,
      badge: badge,
      sizes: p.sizes,
      colors: p.colors,
      images: imagesFor(p.category, p.slug),
      shortDescription: p.shortDescription,
      description: p.description,
      details: p.details,
      fabric: p.fabric || "",
      notes: p.notes || null,
      stock: p.stock,
      isNew: !!p.isNew,
      isBestSeller: !!p.isBestSeller,
      tags: p.tags,
      brand: p.brand,
      variantPrices: p.variantPrices || null,
      variantOldPrices: p.variantOldPrices || null,
      stitchOptions: p.stitchOptions || null,
      stitchPrices: p.stitchPrices || null,
      stitchOldPrices: p.stitchOldPrices || null,
      pieces: p.pieces || "",
      createdAt: p.createdAt
    };
  }

  var teeSizes = ["S", "M", "L", "XL", "XXL"];
  var apparelSizes = ["S", "M", "L", "XL"];
  var waist = ["28", "30", "32", "34", "36", "38"];
  var salwarSizes = ["S", "M", "L", "XL"];

  var products = [
    item({
      id: "pf01", slug: "noir-intense", name: "Noir Intense Eau de Parfum", category: "perfumes", subCategory: "Men",
      price: 8500, oldPrice: 12000, rating: 4.8, reviewCount: 186, isBestSeller: true, stock: 22, brand: "Nawab Sahab Noir",
      sizes: ["50ml", "100ml"], variantPrices: { "50ml": 8500, "100ml": 14500 }, variantOldPrices: { "50ml": 12000, "100ml": 18000 },
      colors: [{ name: "Noir", hex: "#1C1916" }], createdAt: "2026-05-12",
      tags: ["oud", "evening", "men", "office"],
      shortDescription: "A polished oud with bergamot and vanilla — present, never loud.",
      description: "Noir Intense is our evening oud for men who want presence without a trail that fills the room. Bergamot and black pepper open clean, iris and rose keep it tailored, and a vanilla-amber base settles close to the skin. Composed for air-conditioned offices and warm Pakistani nights alike.",
      notes: { top: "Bergamot, black pepper", heart: "Iris, Turkish rose", base: "Oud, vanilla, amber" },
      details: { sku: "LX-PF-001", concentration: "Eau de Parfum", origin: "Filled and packed in Lahore", longevity: "8–10 hours on skin", season: "Year round, best after dusk", care: "Keep the bottle upright, away from direct sun and car dashboards." }
    }),
    item({
      id: "pf02", slug: "velvet-oud", name: "Velvet Oud Eau de Parfum", category: "perfumes", subCategory: "Unisex",
      price: 12500, oldPrice: 16000, rating: 4.9, reviewCount: 142, isBestSeller: true, isNew: true, stock: 14, brand: "Nawab Sahab Atelier",
      sizes: ["50ml", "100ml"], variantPrices: { "50ml": 12500, "100ml": 17500 }, variantOldPrices: { "50ml": 16000, "100ml": 18000 },
      colors: [{ name: "Amber", hex: "#8A5A2B" }], createdAt: "2026-09-18",
      tags: ["oud", "unisex", "saffron", "wedding"],
      shortDescription: "Saffron, smoked oud, and a soft leather accord for evenings that run late.",
      description: "Velvet Oud is the bottle people borrow. Saffron lifts a dense oud, and a suede-leather accord keeps the dry-down elegant rather than sweet. Wear it to a baraat or a dinner in Karachi when you want one scent to do the talking.",
      notes: { top: "Saffron, cardamom", heart: "Rose absolute, smoked oud", base: "Leather, sandalwood, musk" },
      details: { sku: "LX-PF-002", concentration: "Eau de Parfum", origin: "Filled and packed in Lahore", longevity: "10–12 hours", season: "Autumn and winter evenings", care: "A little goes further in humidity. Two sprays is enough." }
    }),
    item({
      id: "pf03", slug: "rose-de-lahore", name: "Rose de Lahore Eau de Parfum", category: "perfumes", subCategory: "Women",
      price: 9800, oldPrice: null, rating: 4.7, reviewCount: 168, isBestSeller: true, stock: 26, brand: "Nawab Sahab Atelier",
      sizes: ["50ml", "100ml"], variantPrices: { "50ml": 9800, "100ml": 15500 }, variantOldPrices: null,
      colors: [{ name: "Rose", hex: "#C45B6A" }], createdAt: "2026-03-02",
      tags: ["rose", "floral", "women", "day"],
      shortDescription: "Turkish rose and peony over a clean musk — fresh at noon, softer by evening.",
      description: "Named for the flower stalls of Liberty, Rose de Lahore is a modern rose: dewy at the open, never powdery. Peony keeps it light for daytime, and a white musk base stays polite in closed rooms.",
      notes: { top: "Lychee, pink pepper", heart: "Turkish rose, peony", base: "White musk, cedar" },
      details: { sku: "LX-PF-003", concentration: "Eau de Parfum", origin: "Filled and packed in Lahore", longevity: "7–9 hours", season: "Spring and summer days", care: "Spray on clothing if your skin drinks fragrance quickly." }
    }),
    item({
      id: "pf04", slug: "citrus-dawn", name: "Citrus Dawn Eau de Toilette", category: "perfumes", subCategory: "Men",
      price: 4500, oldPrice: 6200, rating: 4.5, reviewCount: 97, isNew: false, stock: 40, brand: "Nawab Sahab Essentials",
      sizes: ["50ml", "100ml"], variantPrices: { "50ml": 4500, "100ml": 7500 }, variantOldPrices: { "50ml": 6200, "100ml": 9800 },
      colors: [{ name: "Citrus", hex: "#E2B657" }], createdAt: "2026-04-19",
      tags: ["citrus", "office", "fresh", "men"],
      shortDescription: "Lemon, neroli, and vetiver — a clean start for hot commutes.",
      description: "Citrus Dawn is the shirt-fresh scent. Bitter lemon and neroli stay bright, then vetiver keeps it from disappearing after lunch. An eau de toilette, so it wears lighter than our parfums.",
      notes: { top: "Lemon, bergamot", heart: "Neroli, ginger", base: "Vetiver, white musk" },
      details: { sku: "LX-PF-004", concentration: "Eau de Toilette", origin: "Filled and packed in Lahore", longevity: "5–7 hours", season: "High summer", care: "Reapply after a long outdoor afternoon if you like." }
    }),
    item({
      id: "pf05", slug: "amber-nights", name: "Amber Nights Extrait", category: "perfumes", subCategory: "Unisex",
      price: 11800, oldPrice: null, rating: 4.8, reviewCount: 76, isNew: true, stock: 11, brand: "Nawab Sahab Atelier",
      sizes: ["50ml", "100ml"], variantPrices: { "50ml": 11800, "100ml": 17500 }, variantOldPrices: null,
      colors: [{ name: "Amber", hex: "#C4843C" }], createdAt: "2026-10-01",
      tags: ["amber", "extrait", "evening", "unisex"],
      shortDescription: "A thick amber extrait with incense and tonka. One spray is the outfit.",
      description: "Amber Nights is our richest juice — an extrait meant for weddings, winter dinners, and shawls that hold scent. Incense keeps the sweetness serious. It projects gently and lasts.",
      notes: { top: "Elemi, orange blossom", heart: "Labdanum, incense", base: "Amber, tonka, vanilla" },
      details: { sku: "LX-PF-005", concentration: "Extrait de Parfum", origin: "Filled and packed in Lahore", longevity: "12 hours or more", season: "October to February", care: "Extrait stains light fabric if oversprayed. Use on skin." }
    }),
    item({
      id: "pf06", slug: "jasmine-silk", name: "Jasmine Silk Eau de Parfum", category: "perfumes", subCategory: "Women",
      price: 7200, oldPrice: 9500, rating: 4.6, reviewCount: 121, isNew: false, stock: 19, brand: "Nawab Sahab Atelier",
      sizes: ["50ml", "100ml"], variantPrices: { "50ml": 7200, "100ml": 12000 }, variantOldPrices: { "50ml": 9500, "100ml": 15000 },
      colors: [{ name: "Ivory", hex: "#F3E6C8" }], createdAt: "2026-02-14",
      tags: ["jasmine", "floral", "women", "mehndi"],
      shortDescription: "Jasmine sambac on a sandalwood cushion — floral, not sugary.",
      description: "Jasmine Silk is cut for mehndi mornings and Friday lunches. The flower is green and creamy rather than candy-like, and sandalwood gives it a quiet base that works with lawn and silk equally.",
      notes: { top: "Green tea, pear", heart: "Jasmine sambac, orange blossom", base: "Sandalwood, musk" },
      details: { sku: "LX-PF-006", concentration: "Eau de Parfum", origin: "Filled and packed in Lahore", longevity: "7–9 hours", season: "Spring through early autumn", care: "Store the cap closed. Jasmine darkens if left in a sunny window." }
    }),
    item({
      id: "pf07", slug: "cedar-smoke", name: "Cedar & Smoke Cologne", category: "perfumes", subCategory: "Men",
      price: 5800, oldPrice: null, rating: 4.4, reviewCount: 64, isNew: true, stock: 28, brand: "Nawab Sahab Noir",
      sizes: ["50ml", "100ml"], variantPrices: { "50ml": 5800, "100ml": 9200 }, variantOldPrices: null,
      colors: [{ name: "Cedar", hex: "#6B4A32" }], createdAt: "2026-08-20",
      tags: ["woody", "cedar", "men", "day"],
      shortDescription: "Dry cedar, a thread of incense, and clean musk. Easy for every day.",
      description: "Cedar & Smoke is the cologne you can wear to work without announcing it in the lift. The incense is a hint, not a bakhoor cloud, and the musk dries down like sun-warmed wood.",
      notes: { top: "Grapefruit, juniper", heart: "Cedarwood, incense", base: "Musk, ambroxan" },
      details: { sku: "LX-PF-007", concentration: "Cologne", origin: "Filled and packed in Lahore", longevity: "6–8 hours", season: "Year round", care: "Cologne sits lighter. Don’t judge it in the first minute." }
    }),
    item({
      id: "pf08", slug: "white-musk", name: "White Musk Lumière Eau de Parfum", category: "perfumes", subCategory: "Women",
      price: 11000, oldPrice: 14000, rating: 4.7, reviewCount: 88, isBestSeller: true, stock: 16, brand: "Nawab Sahab Atelier",
      sizes: ["50ml", "100ml"], variantPrices: { "50ml": 11000, "100ml": 16500 }, variantOldPrices: { "50ml": 14000, "100ml": 18000 },
      colors: [{ name: "Pearl", hex: "#E7E2DA" }], createdAt: "2026-06-08",
      tags: ["musk", "clean", "women", "gift"],
      shortDescription: "Pear, cashmere musk, and a pale wood — the ‘you smell good’ scent.",
      description: "White Musk Lumière is what people notice when they lean in, not across the room. A pear opening keeps it modern; cashmere musk and pale woods make it the easiest gift in the cabinet.",
      notes: { top: "Pear, bergamot", heart: "Cashmere musk, muguet", base: "Blond woods, soft amber" },
      details: { sku: "LX-PF-008", concentration: "Eau de Parfum", origin: "Filled and packed in Lahore", longevity: "8 hours", season: "Year round", care: "Ideal on scarves. The musk blooms in heat." }
    }),

    item({
      id: "cl01", slug: "midnight-kurta", name: "Midnight Embroidered Kurta", category: "clothes", subCategory: "Kurtas",
      price: 8900, oldPrice: 11000, rating: 4.7, reviewCount: 134, isBestSeller: true, stock: 15, brand: "Nawab Sahab Heritage", fabric: "Cambric",
      sizes: apparelSizes, colors: [{ name: "Charcoal", hex: "#2A2A2E" }, { name: "Ivory", hex: "#F4EFE6" }], createdAt: "2026-07-01",
      tags: ["kurta", "eid", "embroidery", "men"],
      shortDescription: "A charcoal cambric kurta with tone-on-tone embroidery at the placket.",
      description: "Cut long and straight for Eid and Friday prayers, Midnight is embroidered by hand along the placket and cuffs in a thread one shade lighter than the cloth. The cambric breathes in April heat and still looks formal under a waistcoat.",
      details: { sku: "LX-CL-001", fit: "Straight", length: "Knee length", care: "Dry clean, or cold hand wash and dry in shade. Iron the embroidery on the reverse.", origin: "Stitched in Lahore" }
    }),
    item({
      id: "cl02", slug: "ivory-linen-coord", name: "Ivory Linen Co-ord Set", category: "clothes", subCategory: "Co-ord Sets",
      price: 12500, oldPrice: null, rating: 4.6, reviewCount: 72, isNew: true, stock: 12, brand: "Nawab Sahab Atelier", fabric: "Linen",
      sizes: apparelSizes, colors: [{ name: "Ivory", hex: "#F3EEE4" }, { name: "Sand", hex: "#D9C7A6" }], createdAt: "2026-09-28",
      tags: ["coord", "linen", "summer", "women"],
      shortDescription: "A breathable ivory linen shirt and trouser, cut as a set.",
      description: "Two pieces, one cloth. The shirt is slightly oversized, the trouser straight, and the linen is garment-washed so it doesn’t shine. Wear it to a brunch in Clifton or a lunch that might become a photoshoot.",
      details: { sku: "LX-CL-002", fit: "Relaxed", pieces: "Shirt and trouser", care: "Machine wash cold, hang dry. Linen likes a little crease.", origin: "Stitched in Karachi" }
    }),
    item({
      id: "cl03", slug: "gold-thread-kurta", name: "Gold-Thread Festive Kurta", category: "clothes", subCategory: "Kurtas",
      price: 11900, oldPrice: 14900, rating: 4.8, reviewCount: 109, isBestSeller: true, stock: 9, brand: "Nawab Sahab Heritage", fabric: "Cotton Silk",
      sizes: apparelSizes, colors: [{ name: "Ivory", hex: "#F7F1E4" }, { name: "Maroon", hex: "#6E2430" }], createdAt: "2026-08-04",
      tags: ["kurta", "wedding", "festive", "gold"],
      shortDescription: "Festive kurta with a fine gold thread border — formal without costume.",
      description: "Made for the events where a plain kurta feels underdressed and a sherwani feels like too much. A narrow gold border traces the collar and cuffs. The cotton-silk holds a press through a long baraat.",
      details: { sku: "LX-CL-003", fit: "Tailored straight", length: "Below knee", care: "Dry clean only. Store folded in muslin, not plastic.", origin: "Embroidered in Lahore" }
    }),
    item({
      id: "cl04", slug: "wool-overshirt", name: "Structured Wool-Blend Overshirt", category: "clothes", subCategory: "Shirts",
      price: 9800, oldPrice: null, rating: 4.5, reviewCount: 48, isNew: true, stock: 18, brand: "Nawab Sahab Noir", fabric: "Wool Blend",
      sizes: ["S", "M", "L", "XL", "XXL"], colors: [{ name: "Charcoal", hex: "#3A3A3C" }, { name: "Camel", hex: "#A67C52" }], createdAt: "2026-10-06",
      tags: ["overshirt", "winter", "layer"],
      shortDescription: "A shirt-jacket in wool blend for Lahore winters and cold offices.",
      description: "Wear it open over a tee or buttoned as a shirt. The wool blend is mid-weight — enough for December evenings, not so heavy that an indoor heater becomes a problem. Two flap pockets, corozo buttons.",
      details: { sku: "LX-CL-004", fit: "Regular", care: "Dry clean or cool wool cycle. Reshape while damp.", origin: "Stitched in Lahore" }
    }),
    item({
      id: "cl05", slug: "sage-cotton-coord", name: "Sage Cotton Co-ord", category: "clothes", subCategory: "Co-ord Sets",
      price: 10500, oldPrice: 13000, rating: 4.6, reviewCount: 83, isNew: false, stock: 14, brand: "Nawab Sahab Atelier", fabric: "Cotton",
      sizes: apparelSizes, colors: [{ name: "Sage", hex: "#8FA58B" }, { name: "Ivory", hex: "#F4F0E8" }], createdAt: "2026-05-22",
      tags: ["coord", "cotton", "day", "women"],
      shortDescription: "Washed cotton co-ord in a muted sage, with a self-tie at the waist.",
      description: "A summer set that doesn’t cling. The top is a soft square neck with a tie, the trouser is wide and cropped. Sage reads expensive in photographs and hides a day’s dust better than white.",
      details: { sku: "LX-CL-005", fit: "Relaxed", pieces: "Top and trouser", care: "Cold machine wash with similar colours. Iron damp.", origin: "Stitched in Karachi" }
    }),
    item({
      id: "cl06", slug: "black-satin-shirt", name: "Black Tailored Shirt — Satin Finish", category: "clothes", subCategory: "Shirts",
      price: 6500, oldPrice: null, rating: 4.4, reviewCount: 57, isNew: false, stock: 24, brand: "Nawab Sahab Noir", fabric: "Cotton Satin",
      sizes: apparelSizes.concat(["XXL"]), colors: [{ name: "Black", hex: "#141416" }, { name: "White", hex: "#F7F7F5" }], createdAt: "2026-01-30",
      tags: ["shirt", "evening", "formal"],
      shortDescription: "A black shirt with a quiet satin face — for dinners, not costumes.",
      description: "The cloth catches light only when you move. Cut with a narrower shoulder and a clean collar so it works with denim or with a blazer. Mother-of-pearl-look buttons, no logos.",
      details: { sku: "LX-CL-006", fit: "Tailored", care: "Cold wash inside out. Hang immediately. Low iron on the reverse.", origin: "Stitched in Lahore" }
    }),
    item({
      id: "cl07", slug: "camel-utility-jacket", name: "Camel Utility Jacket", category: "clothes", subCategory: "Jackets",
      price: 14200, oldPrice: null, rating: 4.7, reviewCount: 61, isBestSeller: true, isNew: true, stock: 10, brand: "Nawab Sahab Noir", fabric: "Cotton Twill",
      sizes: ["S", "M", "L", "XL"], colors: [{ name: "Camel", hex: "#C4A574" }, { name: "Black", hex: "#1A1A1C" }], createdAt: "2026-10-12",
      tags: ["jacket", "utility", "winter", "layer"],
      shortDescription: "A camel utility jacket with a clean shoulder and hidden hood.",
      description: "Four pockets, a short zip hood that disappears into the collar, and a camel that works with indigo denim. Lined just enough for November mornings in Islamabad. This is the jacket in our shop-the-look edit.",
      details: { sku: "LX-CL-007", fit: "Regular", care: "Wipe with a damp cloth. Spot clean. Do not machine dry.", origin: "Stitched in Lahore" }
    }),
    item({
      id: "cl08", slug: "pearl-kurta", name: "Pearl White Kurta Set", category: "clothes", subCategory: "Kurtas",
      price: 7800, oldPrice: 9500, rating: 4.5, reviewCount: 90, isNew: false, stock: 20, brand: "Nawab Sahab Heritage", fabric: "Wash & Wear",
      sizes: apparelSizes, colors: [{ name: "Pearl", hex: "#F6F3EE" }], createdAt: "2026-04-02",
      tags: ["kurta", "jumma", "white", "men"],
      shortDescription: "An easy wash-and-wear kurta with a matching shalwar for Jummah.",
      description: "Not every kurta needs embroidery. Pearl White is cut well, finished cleanly, and made in a wash-and-wear that survives a week of office Fridays. The shalwar is included.",
      details: { sku: "LX-CL-008", fit: "Regular", pieces: "Kurta and shalwar", care: "Machine wash cold. Hang dry. Light iron.", origin: "Stitched in Faisalabad" }
    }),

    item({
      id: "ts01", slug: "heavyweight-black", name: "Essential Heavyweight Tee — Black", category: "tshirts", subCategory: "Essential",
      price: 2200, oldPrice: null, rating: 4.6, reviewCount: 210, isBestSeller: true, stock: 48, brand: "Nawab Sahab Essentials", fabric: "Cotton Jersey",
      sizes: teeSizes, colors: [{ name: "Black", hex: "#121214" }, { name: "White", hex: "#F5F5F3" }, { name: "Ivory", hex: "#EFE8DC" }], createdAt: "2026-01-15",
      tags: ["tee", "basic", "heavyweight"],
      shortDescription: "240gsm cotton jersey in true black. The tee the rest of the wardrobe leans on.",
      description: "A heavier jersey that doesn’t twist after the third wash. Rib collar that keeps its shape, shoulder taped, and a length that covers the waistband of our jeans. No print, no logo on the chest.",
      details: { sku: "LX-TS-001", fit: "Regular", gsm: "240", care: "Machine wash cold inside out. Tumble low or hang dry.", origin: "Knit and cut in Lahore" }
    }),
    item({
      id: "ts02", slug: "champagne-script", name: "Champagne Script Tee", category: "tshirts", subCategory: "Graphic",
      price: 2800, oldPrice: 3500, rating: 4.5, reviewCount: 77, isNew: true, stock: 26, brand: "Nawab Sahab Atelier", fabric: "Cotton Jersey",
      sizes: teeSizes, colors: [{ name: "Champagne", hex: "#E6D3B1" }, { name: "Black", hex: "#161616" }], createdAt: "2026-09-09",
      tags: ["tee", "graphic", "script"],
      shortDescription: "A small gold script on champagne jersey — readable up close, quiet from afar.",
      description: "The wordmark sits on the left chest, tone-on-tone, so it reads as texture more than a slogan. Cut in the same block as our essential tee. Champagne photographs well at golden hour.",
      details: { sku: "LX-TS-002", fit: "Regular", gsm: "220", care: "Wash inside out with similar colours. Do not bleach.", origin: "Printed and cut in Lahore" }
    }),
    item({
      id: "ts03", slug: "emerald-crest", name: "Emerald Crest Tee", category: "tshirts", subCategory: "Graphic",
      price: 2500, oldPrice: null, rating: 4.4, reviewCount: 54, isNew: false, stock: 30, brand: "Nawab Sahab Noir", fabric: "Cotton Jersey",
      sizes: teeSizes, colors: [{ name: "Emerald", hex: "#0F4C3A" }, { name: "Ivory", hex: "#F3EEE6" }], createdAt: "2026-06-18",
      tags: ["tee", "emerald", "crest"],
      shortDescription: "Deep emerald jersey with a small embroidered crest.",
      description: "The green is the same emerald we use on our sale seals — dense, not neon. A tonal crest is embroidered at the chest so it survives washes that kill prints. Pairs with stone denim and camel jackets.",
      details: { sku: "LX-TS-003", fit: "Regular", gsm: "220", care: "Cold wash. Embroidery likes to be ironed on the reverse.", origin: "Embroidered in Lahore" }
    }),
    item({
      id: "ts04", slug: "oversized-ivory", name: "Oversized Ivory Tee", category: "tshirts", subCategory: "Oversized",
      price: 3200, oldPrice: null, rating: 4.7, reviewCount: 96, isBestSeller: true, isNew: true, stock: 22, brand: "Nawab Sahab Essentials", fabric: "Cotton Jersey",
      sizes: teeSizes, colors: [{ name: "Ivory", hex: "#F1EBE1" }, { name: "Charcoal", hex: "#3C3C40" }], createdAt: "2026-10-02",
      tags: ["tee", "oversized", "street"],
      shortDescription: "Dropped shoulder, longer body, heavy ivory jersey.",
      description: "The oversized tee in our streetwear hero. Shoulders drop just past the seam, the hem sits lower, and the jersey is dense enough that it doesn’t go sheer. Wear it with the straight midnight jean.",
      details: { sku: "LX-TS-004", fit: "Oversized", gsm: "260", care: "Wash cold. Dry flat the first time so the shoulder stays dropped.", origin: "Cut in Lahore" }
    }),
    item({
      id: "ts05", slug: "noir-graphic", name: "Noir Graphic Tee", category: "tshirts", subCategory: "Graphic",
      price: 1900, oldPrice: 2600, rating: 4.3, reviewCount: 68, isNew: false, stock: 34, brand: "Nawab Sahab Noir", fabric: "Cotton Jersey",
      sizes: teeSizes, colors: [{ name: "Black", hex: "#101012" }, { name: "Ivory", hex: "#EFEAE2" }], createdAt: "2026-03-11",
      tags: ["tee", "graphic", "sale"],
      shortDescription: "A large back print, a clean front. Black jersey, stone ink.",
      description: "The front is almost empty — a tiny neck label print — and the story sits on the back in a stone-coloured graphic. Cut regular so it layers under the utility jacket without bulk.",
      details: { sku: "LX-TS-005", fit: "Regular", gsm: "200", care: "Wash inside out to keep the print. Avoid high heat.", origin: "Printed in Lahore" }
    }),
    item({
      id: "ts06", slug: "striped-resort", name: "Striped Resort Tee", category: "tshirts", subCategory: "Essential",
      price: 2400, oldPrice: null, rating: 4.5, reviewCount: 41, isNew: true, stock: 20, brand: "Nawab Sahab Atelier", fabric: "Cotton Jersey",
      sizes: teeSizes, colors: [{ name: "Navy", hex: "#1E2A44" }, { name: "Ivory", hex: "#F4F0E8" }], createdAt: "2026-08-29",
      tags: ["tee", "stripe", "resort"],
      shortDescription: "Fine navy and ivory stripes, a softer drape for warmer days.",
      description: "Yarn-dyed stripes, not a print, so the lines stay sharp. The fit is a touch shorter and finer than the heavyweight tee — the one you pack for a weekend in Murree or a lunch by the sea.",
      details: { sku: "LX-TS-006", fit: "Regular", gsm: "180", care: "Wash with similar colours. The navy can release a little dye the first wash.", origin: "Knit in Karachi" }
    }),
    item({
      id: "ts07", slug: "monogram-pocket", name: "Monogram Pocket Tee", category: "tshirts", subCategory: "Essential",
      price: 3100, oldPrice: 3600, rating: 4.6, reviewCount: 52, isBestSeller: true, stock: 18, brand: "Nawab Sahab Atelier", fabric: "Cotton Jersey",
      sizes: teeSizes, colors: [{ name: "White", hex: "#F7F7F4" }, { name: "Black", hex: "#1B1B1D" }, { name: "Sage", hex: "#9AAB96" }], createdAt: "2026-07-19",
      tags: ["tee", "pocket", "monogram"],
      shortDescription: "A single chest pocket with a tone-on-tone monogram.",
      description: "The pocket is the detail: bar-tacked, slightly deeper than usual, with a monogram stitched in the same thread as the cloth. It dresses up a denim look without a logo shouting across the chest.",
      details: { sku: "LX-TS-007", fit: "Regular", gsm: "220", care: "Cold wash. Iron the pocket from the inside.", origin: "Stitched in Lahore" }
    }),
    item({
      id: "ts08", slug: "washed-charcoal", name: "Washed Charcoal Tee", category: "tshirts", subCategory: "Essential",
      price: 1750, oldPrice: null, rating: 4.2, reviewCount: 39, isNew: false, stock: 42, brand: "Nawab Sahab Essentials", fabric: "Cotton Jersey",
      sizes: teeSizes, colors: [{ name: "Charcoal", hex: "#4A4A4E" }, { name: "Stone", hex: "#C8C0B4" }], createdAt: "2026-02-08",
      tags: ["tee", "washed", "basic"],
      shortDescription: "Garment-washed charcoal so it looks lived-in on day one.",
      description: "A lighter price, the same block, washed so the black isn’t harsh under afternoon sun. The collar is enzyme-softened. A useful second tee, and the easiest one to gift.",
      details: { sku: "LX-TS-008", fit: "Regular", gsm: "200", care: "Machine wash cold. Washed jersey fades gently, which is the point.", origin: "Cut in Lahore" }
    }),

    item({
      id: "ht01", slug: "classic-cap", name: "Classic Cotton Cap — Black", category: "hats", subCategory: "Caps",
      price: 1500, oldPrice: null, rating: 4.5, reviewCount: 118, isBestSeller: true, stock: 36, brand: "Nawab Sahab Essentials", fabric: "Cotton",
      sizes: ["Free Size"], colors: [{ name: "Black", hex: "#161616" }, { name: "Ivory", hex: "#F2EEE6" }, { name: "Navy", hex: "#1D2B45" }], createdAt: "2026-01-20",
      tags: ["cap", "cotton", "daily"],
      shortDescription: "An unstructured cotton cap with a brass-tone adjuster.",
      description: "Six panels, a soft brim, and no giant logo — a small gold stitch at the side is the only mark. The adjuster is metal, not plastic, and the sweatband is cotton so it survives a Karachi afternoon.",
      details: { sku: "LX-HT-001", fit: "Free size, 56–59 cm", care: "Spot clean. Stuff with tissue to keep the crown.", origin: "Made in Sialkot" }
    }),
    item({
      id: "ht02", slug: "sand-bucket", name: "Bucket Hat — Sand", category: "hats", subCategory: "Bucket Hats",
      price: 1800, oldPrice: 2400, rating: 4.4, reviewCount: 63, isNew: true, stock: 24, brand: "Nawab Sahab Atelier", fabric: "Cotton",
      sizes: ["Free Size"], colors: [{ name: "Sand", hex: "#D8C4A4" }, { name: "Black", hex: "#1A1A1A" }], createdAt: "2026-09-14",
      tags: ["bucket", "sun", "summer"],
      shortDescription: "A sand cotton bucket with a short brim and a gold eyelet.",
      description: "Short brim, deep enough crown, and a sand that doesn’t show dust the way white does. Worn in our streetwear look with the oversized ivory tee. Packs flat.",
      details: { sku: "LX-HT-002", fit: "Free size", care: "Hand wash cold if needed. Dry over a bowl to keep the brim.", origin: "Made in Sialkot" }
    }),
    item({
      id: "ht03", slug: "wool-beanie", name: "Wool Beanie — Charcoal", category: "hats", subCategory: "Beanies",
      price: 2200, oldPrice: null, rating: 4.6, reviewCount: 44, isBestSeller: true, stock: 20, brand: "Nawab Sahab Heritage", fabric: "Wool",
      sizes: ["Free Size"], colors: [{ name: "Charcoal", hex: "#3A3A3E" }, { name: "Camel", hex: "#B08968" }], createdAt: "2026-10-08",
      tags: ["beanie", "wool", "winter"],
      shortDescription: "Fine-gauge merino-blend beanie. Warm, not itchy.",
      description: "A short cuff, a fine gauge, and a wool blend chosen because pure wool can itch in heated rooms. It sits close, so it works under a jacket hood on the motorway to Murree.",
      details: { sku: "LX-HT-003", fit: "Free size, stretch", care: "Hand wash cold. Dry flat. Do not tumble.", origin: "Knit in Lahore" }
    }),
    item({
      id: "ht04", slug: "gold-emblem-cap", name: "Gold-Emblem Cap", category: "hats", subCategory: "Caps",
      price: 2600, oldPrice: null, rating: 4.7, reviewCount: 51, isNew: true, stock: 16, brand: "Nawab Sahab Atelier", fabric: "Cotton",
      sizes: ["Free Size"], colors: [{ name: "Black", hex: "#141414" }, { name: "Ivory", hex: "#F6F1E8" }], createdAt: "2026-08-16",
      tags: ["cap", "emblem", "gift"],
      shortDescription: "Structured cap with a small gold-tone metal emblem.",
      description: "The structured crown holds a cleaner shape for people who find unstructured caps too slouchy. The emblem is metal, riveted, and small enough to pass a dress code that bans logos.",
      details: { sku: "LX-HT-004", fit: "Free size, adjustable", care: "Spot clean only. Keep the emblem dry.", origin: "Made in Sialkot" }
    }),
    item({
      id: "ht05", slug: "linen-bucket", name: "Linen Bucket Hat — Ivory", category: "hats", subCategory: "Bucket Hats",
      price: 1900, oldPrice: null, rating: 4.3, reviewCount: 29, isNew: false, stock: 18, brand: "Nawab Sahab Atelier", fabric: "Linen",
      sizes: ["Free Size"], colors: [{ name: "Ivory", hex: "#F3EBDD" }, { name: "Sage", hex: "#A3B29A" }], createdAt: "2026-05-03",
      tags: ["bucket", "linen", "summer"],
      shortDescription: "Crushed linen bucket in ivory. Better once it creases.",
      description: "Linen that looks right the moment it isn’t perfect. A sage option if ivory feels too bright for the afternoon. The brim is slightly longer at the front.",
      details: { sku: "LX-HT-005", fit: "Free size", care: "Hand wash, reshape, dry in shade. Embrace the crease.", origin: "Made in Karachi" }
    }),
    item({
      id: "ht06", slug: "ribbed-beanie", name: "Ribbed Beanie — Emerald", category: "hats", subCategory: "Beanies",
      price: 1400, oldPrice: 1800, rating: 4.4, reviewCount: 37, isNew: false, stock: 27, brand: "Nawab Sahab Essentials", fabric: "Cotton",
      sizes: ["Free Size"], colors: [{ name: "Emerald", hex: "#0F4C3A" }, { name: "Black", hex: "#1A1A1A" }], createdAt: "2026-11-01",
      tags: ["beanie", "rib", "winter"],
      note: "Created for late autumn. Cotton rib, so it isn’t only for the hills.",
      shortDescription: "A cotton rib beanie in deep emerald — light enough for city winters.",
      description: "Not every winter day in Lahore needs wool. This ribbed cotton beanie is the layer you throw on after maghrib when the air drops and a wool hat would be too much indoors.",
      details: { sku: "LX-HT-006", fit: "Free size, stretch", care: "Machine wash cold. Dry flat.", origin: "Knit in Lahore" }
    }),
    item({
      id: "ht07", slug: "stone-dad-cap", name: "Structured Dad Cap — Stone", category: "hats", subCategory: "Caps",
      price: 2100, oldPrice: null, rating: 4.5, reviewCount: 33, isBestSeller: true, stock: 21, brand: "Nawab Sahab Essentials", fabric: "Cotton",
      sizes: ["Free Size"], colors: [{ name: "Stone", hex: "#C9C1B4" }, { name: "Black", hex: "#202022" }], createdAt: "2026-06-25",
      tags: ["cap", "dad cap", "stone"],
      shortDescription: "A higher crown dad cap in stone washed cotton.",
      description: "The curved brim and taller crown are a nod to classic dad caps, washed so the stone looks sun-faded rather than new. Pairs with almost every tee in the line.",
      details: { sku: "LX-HT-007", fit: "Free size, snap adjuster", care: "Spot clean. Do not crush the brim flat.", origin: "Made in Sialkot" }
    }),
    item({
      id: "ht08", slug: "camel-beanie", name: "Winter Beanie — Camel", category: "hats", subCategory: "Beanies",
      price: 1650, oldPrice: null, rating: 4.3, reviewCount: 22, isNew: true, stock: 19, brand: "Nawab Sahab Heritage", fabric: "Wool",
      sizes: ["Free Size"], colors: [{ name: "Camel", hex: "#C6A36E" }, { name: "Charcoal", hex: "#44444A" }], createdAt: "2026-10-18",
      tags: ["beanie", "camel", "winter"],
      shortDescription: "Camel wool-blend beanie with a deep fold cuff.",
      description: "The camel matches our utility jacket closely enough to look intended. Deep cuff, so you can wear it folded or pulled lower when the wind picks up on the ring road.",
      details: { sku: "LX-HT-008", fit: "Free size", care: "Hand wash cold. Reshape the cuff while drying.", origin: "Knit in Lahore" }
    }),

    item({
      id: "jn01", slug: "slim-indigo", name: "Slim Indigo Selvedge", category: "jeans", subCategory: "Slim",
      price: 6900, oldPrice: 8200, rating: 4.7, reviewCount: 101, isBestSeller: true, stock: 17, brand: "Nawab Sahab Denim", fabric: "Denim",
      sizes: waist, colors: [{ name: "Indigo", hex: "#1E3A6E" }], createdAt: "2026-04-11",
      tags: ["denim", "selvedge", "slim"],
      shortDescription: "13oz indigo selvedge, slim from hip to hem.",
      description: "A dry indigo that creases at the knee and stays deep at the thigh. The selvedge line shows when you turn the cuff once. Slim, not skinny — you can sit through a long drive.",
      details: { sku: "LX-JN-001", fit: "Slim", weight: "13oz", rise: "Mid", care: "Wash inside out, cold, only when they need it. Hang dry.", origin: "Cut in Lahore, denim milled for us" }
    }),
    item({
      id: "jn02", slug: "straight-midnight", name: "Straight Midnight Wash", category: "jeans", subCategory: "Straight",
      price: 5500, oldPrice: null, rating: 4.6, reviewCount: 88, isBestSeller: true, isNew: true, stock: 23, brand: "Nawab Sahab Denim", fabric: "Denim",
      sizes: waist, colors: [{ name: "Midnight", hex: "#161A24" }], createdAt: "2026-09-21",
      tags: ["denim", "straight", "black"],
      shortDescription: "A straight midnight wash that reads black until the sun hits it.",
      description: "The denim in our shop-the-look. Straight through the leg, a rise you don’t have to hike up, and a wash dark enough for a dinner reservation. Sits cleanly over a simple shoe.",
      details: { sku: "LX-JN-002", fit: "Straight", weight: "12oz", rise: "Mid", care: "Turn inside out. Wash cold with darks. The indigo cast is meant to stay.", origin: "Cut in Lahore" }
    }),
    item({
      id: "jn03", slug: "relaxed-stone", name: "Relaxed Stone Wash", category: "jeans", subCategory: "Relaxed",
      price: 4800, oldPrice: 6000, rating: 4.4, reviewCount: 59, isNew: false, stock: 21, brand: "Nawab Sahab Denim", fabric: "Denim",
      sizes: ["30", "32", "34", "36", "38"], colors: [{ name: "Stone", hex: "#8FA0B5" }], createdAt: "2026-03-27",
      tags: ["denim", "relaxed", "stone"],
      shortDescription: "Room through the thigh, a soft stone wash, a lower price.",
      description: "For days when slim feels like a decision. The stone wash is even, not streaky, and the relaxed block still has a hem that stacks once rather than pooling.",
      details: { sku: "LX-JN-003", fit: "Relaxed", weight: "11oz", rise: "Mid", care: "Machine wash cold. Stone wash lightens slightly over time.", origin: "Cut in Karachi" }
    }),
    item({
      id: "jn04", slug: "slim-black", name: "Slim Black Stretch", category: "jeans", subCategory: "Slim",
      price: 6200, oldPrice: null, rating: 4.5, reviewCount: 74, isNew: false, stock: 19, brand: "Nawab Sahab Denim", fabric: "Denim",
      sizes: waist, colors: [{ name: "Black", hex: "#121214" }], createdAt: "2026-05-16",
      tags: ["denim", "black", "stretch", "slim"],
      shortDescription: "True black denim with a little stretch for a long day.",
      description: "Two percent elastane, enough that the knee doesn’t bag by evening and the black stays black. A five-pocket jean with matte hardware — no contrast stitching.",
      details: { sku: "LX-JN-004", fit: "Slim", weight: "12oz with stretch", rise: "Mid", care: "Wash inside out, cold. Hang dry to protect the black.", origin: "Cut in Lahore" }
    }),
    item({
      id: "jn05", slug: "straight-vintage", name: "Straight Vintage Blue", category: "jeans", subCategory: "Straight",
      price: 5100, oldPrice: null, rating: 4.3, reviewCount: 46, isNew: true, stock: 16, brand: "Nawab Sahab Denim", fabric: "Denim",
      sizes: ["28", "30", "32", "34", "36"], colors: [{ name: "Vintage Blue", hex: "#3E5C8A" }], createdAt: "2026-08-08",
      tags: ["denim", "vintage", "straight"],
      shortDescription: "A mid blue with natural-looking fade at the thigh.",
      description: "Whiskers are placed where a body actually bends, not stamped at random. Straight leg, so it works with the camel jacket and a simple loafer or a clean runner.",
      details: { sku: "LX-JN-005", fit: "Straight", weight: "12oz", rise: "Mid", care: "Cold wash inside out. Fades will settle after a few wears.", origin: "Cut in Lahore" }
    }),
    item({
      id: "jn06", slug: "relaxed-charcoal", name: "Relaxed Charcoal", category: "jeans", subCategory: "Relaxed",
      price: 4500, oldPrice: 5800, rating: 4.2, reviewCount: 38, isNew: false, stock: 20, brand: "Nawab Sahab Denim", fabric: "Denim",
      sizes: ["30", "32", "34", "36", "38"], colors: [{ name: "Charcoal", hex: "#3E4450" }], createdAt: "2026-02-21",
      tags: ["denim", "relaxed", "charcoal"],
      shortDescription: "Charcoal denim with an easy thigh — closer to a trouser than a skinny jean.",
      description: "If you want denim that feels like the trousers you already trust, start here. Charcoal hides city dust, the rise is comfortable, and the sale price is the one we keep for repeat customers.",
      details: { sku: "LX-JN-006", fit: "Relaxed", weight: "11oz", rise: "Mid-high", care: "Wash cold with similar colours.", origin: "Cut in Karachi" }
    }),
    item({
      id: "jn07", slug: "slim-light", name: "Slim Light Wash", category: "jeans", subCategory: "Slim",
      price: 3900, oldPrice: null, rating: 4.1, reviewCount: 27, isNew: false, stock: 25, brand: "Nawab Sahab Essentials", fabric: "Denim",
      sizes: ["28", "30", "32", "34", "36"], colors: [{ name: "Light Wash", hex: "#A9B7C9" }], createdAt: "2026-06-02",
      tags: ["denim", "light", "slim"],
      shortDescription: "A pale slim wash for summer, still fully lined at the pocket.",
      description: "Light denim that isn’t see-through. Pockets are lined, the slim leg is cropped a touch so it doesn’t stack on sandals, and the price sits at the easy end of the denim range.",
      details: { sku: "LX-JN-007", fit: "Slim", weight: "10oz", rise: "Mid", care: "Wash separately the first time. Cold water.", origin: "Cut in Karachi" }
    }),
    item({
      id: "jn08", slug: "straight-raw", name: "Straight Raw Indigo", category: "jeans", subCategory: "Straight",
      price: 7400, oldPrice: null, rating: 4.8, reviewCount: 55, isBestSeller: true, isNew: true, stock: 12, brand: "Nawab Sahab Denim", fabric: "Denim",
      sizes: waist, colors: [{ name: "Raw Indigo", hex: "#1A2744" }], createdAt: "2026-10-09",
      tags: ["denim", "raw", "selvedge"],
      shortDescription: "Unwashed 14oz raw denim. It will fade where you live in it.",
      description: "Sold stiff on purpose. Wear it for a month before the first soak and the fades will map your week — wallet, phone, the commute. Straight, 14oz, sanforized just enough that the waist you order is the waist you keep.",
      details: { sku: "LX-JN-008", fit: "Straight", weight: "14oz raw", rise: "Mid", care: "Hold off washing as long as you can. Then cold soak, inside out, hang dry.", origin: "Cut in Lahore" }
    }),

    item({
      id: "sk01", slug: "sage-lawn", name: "Embroidered Lawn 3-Piece — Sage Green", category: "salwar-kameez", subCategory: "3-Piece",
      price: 14500, oldPrice: 18500, rating: 4.9, reviewCount: 156, isBestSeller: true, stock: 13, brand: "Nawab Sahab Atelier", fabric: "Lawn",
      sizes: salwarSizes, stitchOptions: ["Stitched", "Unstitched"],
      stitchPrices: { Stitched: 14500, Unstitched: 11900 }, stitchOldPrices: { Stitched: 18500, Unstitched: 15000 },
      colors: [{ name: "Sage", hex: "#8EA48A" }, { name: "Ivory", hex: "#F4F0E6" }], createdAt: "2026-03-20",
      pieces: "3-Piece", tags: ["lawn", "eid", "embroidered", "3-piece"],
      shortDescription: "Digital lawn with tonal embroidery, dupatta, and trouser. Sage that flatters in daylight.",
      description: "Our most-requested lawn. The print is small and tonal so the embroidery can lead, and the sage holds up in both morning light and warm indoor bulbs. Order stitched in your size, or unstitched if your tailor already knows you.",
      details: { sku: "LX-SK-001", pieces: "Shirt, trouser, dupatta", meterage: "Unstitched: 4.5m shirt, 2.5m trouser, 2.5m dupatta", care: "Cold wash, mild detergent, dry in shade. Iron the embroidery on the reverse.", origin: "Printed in Lahore, stitched to order" }
    }),
    item({
      id: "sk02", slug: "ivory-cotton", name: "Cotton 2-Piece — Ivory", category: "salwar-kameez", subCategory: "2-Piece",
      price: 6500, oldPrice: null, rating: 4.5, reviewCount: 84, isNew: false, stock: 22, brand: "Nawab Sahab Essentials", fabric: "Cotton",
      sizes: salwarSizes, stitchOptions: ["Stitched", "Unstitched"],
      stitchPrices: { Stitched: 6500, Unstitched: 5200 }, stitchOldPrices: null,
      colors: [{ name: "Ivory", hex: "#F6F2EA" }], createdAt: "2026-02-02",
      pieces: "2-Piece", tags: ["cotton", "daily", "2-piece"],
      shortDescription: "A plain ivory cotton kameez and trouser for days that don’t need a print.",
      description: "Soft cambric-weight cotton, a modest neckline, and side slits that sit correctly when you walk. This is the set we recommend under a waistcoat or with a printed dupatta you already own. Dupatta is not included.",
      details: { sku: "LX-SK-002", pieces: "Shirt and trouser", meterage: "Unstitched: 4m shirt, 2.5m trouser", care: "Machine wash cold. Ivory stays ivory if you skip the bleach.", origin: "Stitched in Faisalabad" }
    }),
    item({
      id: "sk03", slug: "maroon-khaddar", name: "Khaddar Winter 3-Piece — Maroon", category: "salwar-kameez", subCategory: "3-Piece",
      price: 9800, oldPrice: 12000, rating: 4.7, reviewCount: 93, isBestSeller: true, stock: 14, brand: "Nawab Sahab Heritage", fabric: "Khaddar",
      sizes: salwarSizes, stitchOptions: ["Stitched", "Unstitched"],
      stitchPrices: { Stitched: 9800, Unstitched: 8200 }, stitchOldPrices: { Stitched: 12000, Unstitched: 10000 },
      colors: [{ name: "Maroon", hex: "#6E2430" }, { name: "Mustard", hex: "#C4922A" }], createdAt: "2026-10-04",
      pieces: "3-Piece", tags: ["khaddar", "winter", "3-piece"],
      shortDescription: "Mid-weight khaddar in maroon, with a woven contrast dupatta.",
      description: "Khaddar that is warm by December and still wearable in an office with the heater on. The dupatta carries a thin gold-tone woven border. Maroon is dyed twice so it doesn’t turn brown after washing.",
      details: { sku: "LX-SK-003", pieces: "Shirt, trouser, dupatta", meterage: "Unstitched: 4.5m shirt, 2.5m trouser, 2.5m dupatta", care: "Dry clean the first season, or cold hand wash and dry flat.", origin: "Woven and stitched in Lahore" }
    }),
    item({
      id: "sk04", slug: "navy-washwear", name: "Wash & Wear 2-Piece — Navy", category: "salwar-kameez", subCategory: "2-Piece",
      price: 5200, oldPrice: null, rating: 4.4, reviewCount: 70, isNew: false, stock: 30, brand: "Nawab Sahab Essentials", fabric: "Wash & Wear",
      sizes: salwarSizes, stitchOptions: ["Stitched", "Unstitched"],
      stitchPrices: { Stitched: 5200, Unstitched: 4500 }, stitchOldPrices: null,
      colors: [{ name: "Navy", hex: "#1B2740" }, { name: "Black", hex: "#161616" }], createdAt: "2026-01-08",
      pieces: "2-Piece", tags: ["wash and wear", "office", "2-piece"],
      shortDescription: "Navy wash-and-wear that holds a crease through a workday.",
      description: "The practical set: a firm hand, a colour that doesn’t show the commute, and a trouser with a comfortable rise. It is the piece to order if you want something ready for the office on Monday.",
      details: { sku: "LX-SK-004", pieces: "Shirt and trouser", meterage: "Unstitched: 4m shirt, 2.5m trouser", care: "Machine wash. Hang immediately and the crease mostly returns.", origin: "Stitched in Faisalabad" }
    }),
    item({
      id: "sk05", slug: "blush-lawn", name: "Festive Lawn 3-Piece — Blush", category: "salwar-kameez", subCategory: "3-Piece",
      price: 18900, oldPrice: 22000, rating: 4.8, reviewCount: 67, isNew: true, isBestSeller: true, stock: 8, brand: "Nawab Sahab Atelier", fabric: "Lawn",
      sizes: salwarSizes, stitchOptions: ["Stitched", "Unstitched"],
      stitchPrices: { Stitched: 18900, Unstitched: 15900 }, stitchOldPrices: { Stitched: 22000, Unstitched: 18500 },
      colors: [{ name: "Blush", hex: "#E7B7B0" }, { name: "Sage", hex: "#9AAD96" }], createdAt: "2026-09-30",
      pieces: "3-Piece", tags: ["lawn", "festive", "embroidery", "eid"],
      shortDescription: "A heavier festive lawn with scalloped embroidery and a silk-touch dupatta.",
      description: "Blush is the Eid set. Scalloped embroidery frames the neck and the dupatta border, and the lawn is a denser weave than our everyday prints so it holds the thread. Limited each season — the blush dye lot is small.",
      details: { sku: "LX-SK-005", pieces: "Shirt, trouser, dupatta", meterage: "Unstitched: 5m shirt, 2.5m trouser, 2.5m dupatta", care: "Dry clean recommended. If washing, cold water, no wringing.", origin: "Embroidered in Karachi" }
    }),
    item({
      id: "sk06", slug: "mustard-unstitched", name: "Unstitched Lawn — Mustard", category: "salwar-kameez", subCategory: "3-Piece",
      price: 7500, oldPrice: null, rating: 4.6, reviewCount: 58, isNew: true, stock: 18, brand: "Nawab Sahab Heritage", fabric: "Lawn",
      sizes: salwarSizes, stitchOptions: ["Unstitched", "Stitched"],
      stitchPrices: { Unstitched: 7500, Stitched: 9800 }, stitchOldPrices: null,
      colors: [{ name: "Mustard", hex: "#C8962E" }], createdAt: "2026-08-12",
      pieces: "3-Piece", tags: ["lawn", "unstitched", "mustard"],
      shortDescription: "Mustard lawn sold as a full three-piece length for your own tailor.",
      description: "A clear mustard — not orange, not brown — printed with a small booti that tailor shops handle cleanly. We list it unstitched first because the cloth is the point. Stitching is available if you would rather we handle it.",
      details: { sku: "LX-SK-006", pieces: "Shirt, trouser, dupatta lengths", meterage: "4.5m shirt, 2.5m trouser, 2.5m dupatta", care: "Soak separately the first wash. Dry in shade to keep the mustard.", origin: "Printed in Lahore" }
    }),
    item({
      id: "sk07", slug: "dusty-rose", name: "Cotton 3-Piece — Dusty Rose", category: "salwar-kameez", subCategory: "3-Piece",
      price: 11200, oldPrice: null, rating: 4.5, reviewCount: 49, isNew: false, stock: 15, brand: "Nawab Sahab Atelier", fabric: "Cotton",
      sizes: salwarSizes, stitchOptions: ["Stitched", "Unstitched"],
      stitchPrices: { Stitched: 11200, Unstitched: 9400 }, stitchOldPrices: null,
      colors: [{ name: "Dusty Rose", hex: "#C98B8B" }, { name: "Ivory", hex: "#F3EEE6" }], createdAt: "2026-05-29",
      pieces: "3-Piece", tags: ["cotton", "3-piece", "day"],
      shortDescription: "Dusty rose cotton with a self-print dupatta. Cooler than lawn in a heatwave.",
      description: "When lawn feels too fine and khaddar too heavy, this cotton sits in the middle. The print is woven-look, the dupatta is the same cloth, and dusty rose is easier to rewear than a bright pink.",
      details: { sku: "LX-SK-007", pieces: "Shirt, trouser, dupatta", meterage: "Unstitched: 4.5m shirt, 2.5m trouser, 2.5m dupatta", care: "Cold machine wash. Iron while slightly damp.", origin: "Stitched in Lahore" }
    }),
    item({
      id: "sk08", slug: "olive-khaddar", name: "Khaddar 2-Piece — Olive", category: "salwar-kameez", subCategory: "2-Piece",
      price: 8600, oldPrice: 10500, rating: 4.6, reviewCount: 41, isNew: false, stock: 12, brand: "Nawab Sahab Heritage", fabric: "Khaddar",
      sizes: salwarSizes, stitchOptions: ["Stitched", "Unstitched"],
      stitchPrices: { Stitched: 8600, Unstitched: 7200 }, stitchOldPrices: { Stitched: 10500, Unstitched: 8900 },
      colors: [{ name: "Olive", hex: "#5C6B45" }, { name: "Charcoal", hex: "#3A3A38" }], createdAt: "2026-10-15",
      pieces: "2-Piece", tags: ["khaddar", "olive", "winter", "2-piece"],
      shortDescription: "Olive khaddar shirt and trouser. Add your own shawl.",
      description: "A two-piece for people who already own a good shawl. The olive is greyed, so it sits calmly next to camel, black, and mustard. Winter weight, straight cut, side pockets on the shirt.",
      details: { sku: "LX-SK-008", pieces: "Shirt and trouser", meterage: "Unstitched: 4.5m shirt, 2.5m trouser", care: "Dry clean, or cold hand wash and dry flat so the khaddar doesn’t pull.", origin: "Woven in Lahore" }
    })
  ];

  function formatPrice(amount) {
    var n = Math.round(Number(amount) || 0);
    return config.currencyLabel + " " + n.toLocaleString(config.locale);
  }

  function getProduct(id) {
    return products.find(function (p) { return p.id === id || p.slug === id; }) || null;
  }

  function getCategory(id) {
    return categories.find(function (c) { return c.id === id; }) || null;
  }

  function resolveImage(path) {
    if (!path) return path;
    if (/\.jpe?g$/i.test(path)) return path;
    if (config.imageMode === "photo") return String(path).replace(/\.webp$/i, ".jpg");
    if (config.imageMode === "webp") return path;
    return String(path).replace(/\.webp$/i, ".svg");
  }

  root.LUXORA = {
    config: config,
    categories: categories,
    products: products,
    cities: cities,
    sizeGuides: sizeGuides,
    reviews: reviews,
    formatPrice: formatPrice,
    getProduct: getProduct,
    getCategory: getCategory,
    resolveImage: resolveImage
  };
})(typeof window !== "undefined" ? window : globalThis);
