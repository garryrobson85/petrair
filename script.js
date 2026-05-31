const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector("#menu");
const PRICE_FEED_URL =
  new URLSearchParams(location.search).get("feed") ||
  "https://petrair-prices.garryrobson85.workers.dev/";
const LEAD_BRIEF_URL =
  new URLSearchParams(location.search).get("leadBrief") ||
  "https://silent-butterfly-db1f.garryrobson85.workers.dev/";
const PRICE_REFRESH_MS = 60000;
const RTL_LANGUAGES = new Set(["ar"]);

const translations = {
  fr: {
    "nav.products": "Produits",
    "nav.prices": "Cours",
    "nav.operations": "Operations",
    "nav.compliance": "Conformite",
    "nav.documents": "Documents",
    "nav.language": "Langue",
    "nav.contact": "Contacter le desk",
    "hero.eyebrow": "Negoce physique d'energie depuis Geneve",
    "hero.title": "Un partenaire de marche discipline pour le petrole et les produits raffines.",
    "hero.lead": "Petrair SA optimise l'approvisionnement et la commercialisation de petrole brut, Jet A-1, ULSD et EN590 en Europe, en Mediterranee, en Afrique et au Moyen-Orient, avec une discipline institutionnelle suisse.",
    "hero.cta1": "Demander une cotation",
    "hero.cta2": "Notre fonctionnement",
    "panel.executionText": "Adosse a LC, inspecte et controle par documents",
    "prices.eyebrow": "Reference marche",
    "prices.title": "Prix de reference du brut et des produits raffines.",
    "prices.text": "References front-month et evaluations indicatives de produits raffines pour le contexte de marche. Les chiffres sont informatifs et non executables.",
    "prices.instrument": "Instrument",
    "prices.last": "Dernier",
    "prices.change": "Variation",
    "prices.trend": "Tendance",
    "prices.type": "Type",
    "prices.foot": "Source : flux de marche configure lorsqu'il est disponible. Produits raffines indicatifs. Information uniquement; pas une offre de transaction.",
    "products.eyebrow": "Produits et services",
    "products.title": "Barils physiques, coordination logistique et execution structuree.",
    "products.text": "Petrair SA travaille avec des contreparties qualifiees sur des flux de brut et de produits raffines, avec documentation bancaire, inspection independante et controles de risque.",
    "product.crude": "Petrole brut",
    "product.finance": "Financement structure",
    "ops.eyebrow": "Comment Petrair opere",
    "ops.title": "Trading, banque et inspection dans un processus controle.",
    "ops.text": "Les transactions sont traitees comme des operations physiques documentees. Origine, contrepartie, inspection, assurance et banque sont controles avant l'execution commerciale.",
    "contact.eyebrow": "Desk de trading",
    "contact.title": "Demander une cotation.",
    "contact.text": "Envoyez au desk une demande concise avec produit, quantite, lieu de livraison, calendrier et attentes de reglement. Le formulaire ouvre votre email afin qu'aucune donnee sensible ne soit stockee sur le site.",
    "footer.contact": "Contact"
  },
  es: {
    "nav.products": "Productos",
    "nav.prices": "Precios",
    "nav.operations": "Operaciones",
    "nav.compliance": "Cumplimiento",
    "nav.documents": "Documentos",
    "nav.language": "Idioma",
    "nav.contact": "Contactar mesa",
    "hero.eyebrow": "Trading fisico de energia desde Ginebra",
    "hero.title": "Un socio de mercado disciplinado para petroleo y productos refinados.",
    "hero.lead": "Petrair SA optimiza el suministro y la comercializacion de crudo, Jet A-1, ULSD y EN590 en Europa, el Mediterraneo, Africa y Oriente Medio, con disciplina institucional suiza.",
    "hero.cta1": "Solicitar cotizacion",
    "hero.cta2": "Como operamos",
    "prices.eyebrow": "Referencia de mercado",
    "prices.title": "Precios de referencia de crudo y productos refinados.",
    "prices.text": "Referencias front-month y evaluaciones indicativas de productos refinados para contexto de mercado. Las cifras son informativas y no ejecutables.",
    "products.eyebrow": "Productos y servicios",
    "products.title": "Barriles fisicos, coordinacion logistica y ejecucion estructurada.",
    "ops.eyebrow": "Como opera Petrair",
    "ops.title": "Trading, banca e inspeccion bajo un proceso controlado.",
    "contact.eyebrow": "Mesa de trading",
    "contact.title": "Solicitar una cotizacion.",
    "footer.contact": "Contacto"
  },
  de: {
    "nav.products": "Produkte",
    "nav.prices": "Preise",
    "nav.operations": "Betrieb",
    "nav.compliance": "Compliance",
    "nav.documents": "Dokumente",
    "nav.language": "Sprache",
    "nav.contact": "Desk kontaktieren",
    "hero.eyebrow": "Physischer Energiehandel aus Genf",
    "hero.title": "Ein disziplinierter Marktpartner fur Ol und raffinierte Energieprodukte.",
    "hero.cta1": "Angebot anfragen",
    "hero.cta2": "Arbeitsweise",
    "prices.eyebrow": "Marktreferenz",
    "prices.title": "Referenzpreise fur Rohol und Raffinerieprodukte.",
    "products.eyebrow": "Produkte und Services",
    "ops.eyebrow": "So arbeitet Petrair",
    "contact.eyebrow": "Trading Desk",
    "contact.title": "Angebot anfragen.",
    "footer.contact": "Kontakt"
  },
  ar: {
    "nav.products": "المنتجات",
    "nav.prices": "الأسعار",
    "nav.operations": "العمليات",
    "nav.compliance": "الامتثال",
    "nav.documents": "المستندات",
    "nav.language": "اللغة",
    "nav.contact": "اتصل بالمكتب",
    "hero.eyebrow": "تداول طاقة فعلي من جنيف",
    "hero.title": "شريك سوق منضبط للنفط ومنتجات الطاقة المكررة.",
    "hero.cta1": "طلب عرض سعر",
    "hero.cta2": "كيف نعمل",
    "prices.eyebrow": "مرجع السوق",
    "prices.title": "أسعار مرجعية للنفط الخام والمنتجات المكررة.",
    "products.eyebrow": "المنتجات والخدمات",
    "ops.eyebrow": "كيف تعمل Petrair",
    "contact.eyebrow": "مكتب التداول",
    "contact.title": "طلب عرض سعر.",
    "footer.contact": "اتصال"
  },
  zh: {
    "nav.products": "产品",
    "nav.prices": "价格",
    "nav.operations": "运营",
    "nav.compliance": "合规",
    "nav.documents": "文件",
    "nav.language": "语言",
    "nav.contact": "联系交易台",
    "hero.eyebrow": "来自日内瓦的实物能源交易",
    "hero.title": "石油和精炼能源产品的严谨市场伙伴。",
    "hero.cta1": "申请报价",
    "hero.cta2": "运营方式",
    "prices.eyebrow": "市场参考",
    "prices.title": "原油和精炼产品参考价格。",
    "products.eyebrow": "产品和服务",
    "ops.eyebrow": "Petrair 的运营方式",
    "contact.eyebrow": "交易台",
    "contact.title": "申请报价。",
    "footer.contact": "联系"
  }
};

const specContent = {
  crude: {
    eyebrow: "Crude oil",
    title: "Crude Oil",
    body: "Origination and distribution of light sweet and medium sour crude streams for Mediterranean and Northwest European refineries.",
    rows: [
      ["API gravity", "32-42 degrees typical"],
      ["Sulphur", "0.1-1.5% grade dependent"],
      ["Pricing", "Dated Brent / Platts-linked"],
      ["Inspection", "Recognised inspector at load and discharge"],
      ["Settlement", "LC / documentary"]
    ]
  },
  jet: {
    eyebrow: "Aviation fuel",
    title: "Jet A-1",
    body: "Aviation turbine fuel to AFQRJOS / DEF STAN 91-091 / ASTM D1655 reference, delivered against bank-controlled documentation with independent quality inspection.",
    rows: [
      ["Density at 15C", "775.0-840.0 kg/m3"],
      ["Flash point", "Min 38C"],
      ["Freezing point", "Max -47C"],
      ["Sulphur total", "Max 0.30% m/m"],
      ["Net heat of combustion", "Min 42.8 MJ/kg"]
    ]
  },
  diesel: {
    eyebrow: "Diesel",
    title: "ULSD and EN590",
    body: "Ultra-low-sulphur diesel meeting EN 590 automotive specification for European, Mediterranean and West African networks. Seasonal CFPP grades by destination.",
    rows: [
      ["Cetane number", "Min 51.0"],
      ["Density at 15C", "820.0-845.0 kg/m3"],
      ["Sulphur", "Max 10.0 mg/kg"],
      ["Flash point", "Above 55C"],
      ["FAME content", "Max 7.0% v/v"]
    ]
  },
  finance: {
    eyebrow: "Structured finance",
    title: "Documentary execution",
    body: "A disciplined back-to-back model that minimises market exposure. Settlement under LC-backed mechanisms, pricing linked to Platts benchmarks, with independent inspection at every transfer point.",
    rows: [
      ["Settlement", "LC-backed, bank-controlled"],
      ["Pricing", "Platts-linked benchmarks"],
      ["Execution", "Back-to-back, documentary"],
      ["Inspection", "Recognised inspectors"],
      ["Insurance", "Transaction-based cover review"]
    ]
  }
};

const instruments = [
  { id: "brent", name: "ICE Brent", sub: "Front-month crude", live: true, seed: 82.44, unit: "", decimals: 2 },
  { id: "wti", name: "NYMEX WTI", sub: "Front-month crude", live: true, seed: 77.91, unit: "", decimals: 2 },
  { id: "diesel", name: "Diesel (proxy)", sub: "NY ULSD futures", live: true, seed: 2.55, unit: "$/gal", decimals: 3 },
  { id: "jet", name: "Jet A-1 CIF Med", sub: "Indicative assessment", live: false, seed: 845.25, unit: "$/MT", decimals: 2 },
  { id: "ulsd", name: "ULSD 10ppm", sub: "Indicative assessment", live: false, seed: 812.25, unit: "$/MT", decimals: 2 }
];

const priceState = Object.fromEntries(
  instruments.map((instrument) => [
    instrument.id,
    {
      price: instrument.seed,
      previous: instrument.seed,
      history: Array.from({ length: 12 }, () => instrument.seed * (1 + (Math.random() - 0.5) * 0.01))
    }
  ])
);

menuButton?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

menu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menu.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

function applyLanguage(lang) {
  const dictionary = translations[lang] || {};
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGUAGES.has(lang) ? "rtl" : "ltr";
  localStorage.setItem("petrair_lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    if (!element.dataset.i18nDefault) {
      element.dataset.i18nDefault = element.textContent;
    }
    const key = element.dataset.i18n;
    element.textContent = dictionary[key] || element.dataset.i18nDefault;
  });
}

const languageSelect = document.querySelector("#language-select");
const savedLanguage = localStorage.getItem("petrair_lang") || "en";
if (languageSelect) {
  languageSelect.value = savedLanguage;
  languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
}
applyLanguage(savedLanguage);

function createSparkline(history) {
  const width = 84;
  const height = 28;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const points = history
    .map((value, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 5) - 2.5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const rising = history[history.length - 1] >= history[0];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  svg.setAttribute("class", "spark");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");
  line.setAttribute("points", points);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", rising ? "#75d19f" : "#ef8585");
  line.setAttribute("stroke-width", "1.8");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("stroke-linejoin", "round");
  svg.append(line);
  return svg;
}

function buildPriceBoard() {
  const rows = document.querySelector("#price-rows");
  if (!rows) return;
  rows.textContent = "";

  for (const instrument of instruments) {
    const row = document.createElement("tr");
    row.dataset.instrument = instrument.id;

    const symbol = document.createElement("td");
    symbol.className = "price-symbol";
    symbol.textContent = instrument.name;
    const sub = document.createElement("small");
    sub.textContent = `${instrument.sub}${instrument.unit ? ` · ${instrument.unit}` : ""}`;
    symbol.append(sub);

    const last = document.createElement("td");
    last.className = "price-last";
    last.dataset.field = "last";

    const change = document.createElement("td");
    change.className = "price-change";
    change.dataset.field = "change";

    const trend = document.createElement("td");
    trend.className = "hide-sm";
    trend.dataset.field = "trend";

    const type = document.createElement("td");
    const tag = document.createElement("span");
    tag.className = instrument.live ? "price-tag" : "price-tag indicative";
    tag.textContent = instrument.live ? "Live" : "Indic.";
    type.append(tag);

    row.append(symbol, last, change, trend, type);
    rows.append(row);
  }
}

function formatPrice(instrument, state) {
  return `${state.price.toFixed(instrument.decimals)}${instrument.unit ? ` ${instrument.unit}` : ""}`;
}

function formatChange(instrument, state) {
  const delta = state.price - state.previous;
  const pct = state.previous ? (delta / state.previous) * 100 : 0;
  const rising = delta >= 0;
  return {
    rising,
    text: `${rising ? "+" : "-"}${Math.abs(delta).toFixed(instrument.decimals)} (${Math.abs(pct).toFixed(2)}%)`
  };
}

function createTickerGroup(hidden) {
  const group = document.createElement("span");
  group.className = "ticker-group";
  if (hidden) group.setAttribute("aria-hidden", "true");

  for (const instrument of instruments) {
    const state = priceState[instrument.id];
    const change = formatChange(instrument, state);
    const item = document.createElement("span");
    item.className = "ticker-item";

    const name = document.createElement("small");
    name.textContent = instrument.name;
    const price = document.createElement("span");
    price.textContent = formatPrice(instrument, state);
    const move = document.createElement("span");
    move.className = `ticker-change ${change.rising ? "up" : "down"}`;
    move.textContent = change.text;

    item.append(name, price, move);
    group.append(item);
  }

  return group;
}

function renderTicker() {
  const track = document.querySelector("#market-ticker-track");
  if (!track) return;
  track.textContent = "";
  track.append(createTickerGroup(false), createTickerGroup(true));
}

function renderPrices() {
  for (const instrument of instruments) {
    const row = document.querySelector(`[data-instrument="${instrument.id}"]`);
    if (!row) continue;
    const state = priceState[instrument.id];
    const changeData = formatChange(instrument, state);
    const delta = state.price - state.previous;
    const pct = state.previous ? (delta / state.previous) * 100 : 0;
    const rising = changeData.rising;
    const last = row.querySelector('[data-field="last"]');
    const change = row.querySelector('[data-field="change"]');
    const trend = row.querySelector('[data-field="trend"]');

    last.textContent = formatPrice(instrument, state);
    change.className = `price-change ${changeData.rising ? "up" : "down"}`;
    change.textContent = `${rising ? "▲" : "▼"} ${Math.abs(delta).toFixed(instrument.decimals)} (${Math.abs(pct).toFixed(2)}%)`;
    change.textContent = changeData.text;
    trend.textContent = "";
    trend.append(createSparkline(state.history));
  }

  renderTicker();

  const updated = document.querySelector("#price-updated");
  if (updated) {
    updated.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
}

function setPriceStatus(label, mode) {
  const status = document.querySelector("#price-status");
  const dot = document.querySelector("#price-status-dot");
  if (status) status.textContent = label;
  if (dot) {
    dot.style.background = mode === "live" ? "#75d19f" : mode === "error" ? "#aeb8c7" : "var(--gold)";
  }
}

function applyDemoMove() {
  for (const instrument of instruments) {
    const state = priceState[instrument.id];
    state.previous = state.price;
    state.price = Number((state.price * (1 + (Math.random() - 0.5) * 0.004)).toFixed(4));
    state.history.push(state.price);
    if (state.history.length > 12) state.history.shift();
  }
}

async function refreshPrices() {
  if (!document.querySelector("#price-rows")) return;

  if (!PRICE_FEED_URL) {
    applyDemoMove();
    setPriceStatus("Demo prices", "demo");
    renderPrices();
    return;
  }

  try {
    const response = await fetch(PRICE_FEED_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Price feed returned ${response.status}`);
    const data = await response.json();

    for (const id of ["brent", "wti", "diesel", "jet", "ulsd"]) {
      if (data[id] && typeof data[id].price === "number") {
        const state = priceState[id];
        state.previous = typeof data[id].prev === "number" ? data[id].prev : state.price;
        state.price = data[id].price;
        state.history.push(state.price);
        if (state.history.length > 12) state.history.shift();
      }
    }

    setPriceStatus("Streaming", "live");
    renderPrices();
  } catch {
    applyDemoMove();
    setPriceStatus("Indicative fallback", "error");
    renderPrices();
  }
}

buildPriceBoard();
refreshPrices();
setInterval(refreshPrices, PRICE_REFRESH_MS);

const modal = document.querySelector("#spec-modal");
const modalTitle = document.querySelector("#modal-title");
const modalEyebrow = document.querySelector("#modal-eyebrow");
const modalBody = document.querySelector("#modal-body");
const modalTable = document.querySelector("#modal-table");
const modalClose = document.querySelector(".modal-close");

function openSpec(key) {
  const spec = specContent[key];
  if (!spec || !modal) return;
  modalEyebrow.textContent = spec.eyebrow;
  modalTitle.textContent = spec.title;
  modalBody.textContent = spec.body;
  modalTable.textContent = "";
  for (const row of spec.rows) {
    const tr = document.createElement("tr");
    const keyCell = document.createElement("td");
    const valueCell = document.createElement("td");
    keyCell.textContent = row[0];
    valueCell.textContent = row[1];
    tr.append(keyCell, valueCell);
    modalTable.append(tr);
  }
  modal.hidden = false;
  modalClose?.focus();
}

function closeSpec() {
  if (modal) modal.hidden = true;
}

document.querySelectorAll("[data-spec]").forEach((button) => {
  button.addEventListener("click", () => openSpec(button.dataset.spec));
});
modalClose?.addEventListener("click", closeSpec);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeSpec();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSpec();
});

const form = document.querySelector("#rfq-form");
const note = document.querySelector("#form-note");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const email = String(data.get("Email") || "").trim();

  if (!email || !email.includes("@")) {
    note.textContent = "Please add a valid email address first.";
    return;
  }

  const lines = [];
  for (const [key, value] of data.entries()) {
    const text = String(value).trim();
    if (text) lines.push(`${key}: ${text}`);
  }

  if (LEAD_BRIEF_URL) {
    const payload = Object.fromEntries([...data.entries()].map(([key, value]) => [key, String(value).trim()]));
    payload.Page = location.href;
    payload.SubmittedAt = new Date().toISOString();
    fetch(LEAD_BRIEF_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  }

  const subject = encodeURIComponent(`Petrair SA enquiry - ${data.get("Product") || "Trading"}`);
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:sales@petrairsa.com?subject=${subject}&body=${body}`;
  note.textContent = "Opening your email client with the enquiry prepared.";
});
