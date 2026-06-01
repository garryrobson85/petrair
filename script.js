const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector("#menu");
const PRICE_FEED_URL =
  new URLSearchParams(location.search).get("feed") ||
  "https://petrair-prices.garryrobson85.workers.dev/";
const LEAD_BRIEF_URL =
  new URLSearchParams(location.search).get("leadBrief") ||
  "https://contactform.garryrobson85.workers.dev/";
const PRICE_REFRESH_MS = 60000;
const RTL_LANGUAGES = new Set(["ar"]);
let clickAudioContext;

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
    "hero.lead": "Petrair SA optimise l'approvisionnement et la commercialisation de petrole brut et de produits raffines depuis Geneve en Europe, en Mediterranee, en Afrique et au Moyen-Orient.",
    "hero.cta1": "Demander une cotation",
    "hero.cta2": "Notre fonctionnement",
    "panel.executionText": "Adosse a LC, inspecte et controle par documents",
    "prices.eyebrow": "Reference marche",
    "prices.title": "Prix de reference du brut et des produits raffines.",
    "prices.text": "Contrats a terme front-month pour les references suivies par Petrair SA. Les variations sont mesurees face au precedent settlement ou prior close du flux.",
    "prices.instrument": "Instrument",
    "prices.last": "Dernier prix",
    "prices.change": "Variation vs prior close",
    "prices.trend": "Tendance",
    "prices.type": "Type",
    "prices.foot": "Source : contrats front-month via flux de marche public configure. Prix en USD par unite indiquee. Variations face au previous settlement ou prior close fourni par le flux. Indicatif, non negociable et pas une offre de transaction.",
    "products.eyebrow": "Produits et services",
    "products.title": "Nos produits et services de trading",
    "products.text1": "Petrair SA est engagee dans le negoce international de petrole brut, de produits petroliers raffines et de certaines commodites energetiques. La societe identifie, structure et execute des transactions physiques avec des contreparties etablies sur les marches mondiaux.",
    "products.text2": "Les activites reposent sur une evaluation commerciale disciplinee, une gestion prudente du risque et une forte attention a l'execution des transactions et a la fiabilite des contreparties. En combinant expertise de marche, agilite commerciale et standards operationnels professionnels, Petrair vise des relations de trading durables et une plateforme capable de soutenir des flux repetes sur plusieurs produits et juridictions.",
    "products.text3": "L'objectif de la societe est d'etablir une presence credible et durable sur les marches internationaux de l'energie grace a une performance commerciale constante, une discipline operationnelle et une croissance responsable.",
    "product.crude": "Petrole brut",
    "product.lpgText": "Gaz de petrole liquefie, combustible hydrocarbure polyvalent de propane et butane utilise dans de multiples secteurs.",
    "ops.eyebrow": "Comment Petrair opere",
    "ops.title": "Trading, banque et inspection dans un processus controle.",
    "ops.text": "Les transactions sont traitees comme des operations physiques documentees. Origine, contrepartie, inspection, assurance et banque sont controles avant l'execution commerciale.",
    "compliance.eyebrow": "Conformite et risque",
    "compliance.title": "Des standards stricts pour des contreparties serieuses.",
    "compliance.text": "Le site evite les promesses publiques de prix ou les offres ouvertes. Toute discussion commerciale reste soumise a la due diligence, a la disponibilite produit, a la documentation, aux controles sanctions et aux conditions contractuelles finales.",
    "assurance.eyebrow": "Assurance contrepartie",
    "assurance.title": "Canaux officiels et verification des mandats.",
    "assurance.text": "Le trading d'energie attire de fausses revendications de mandat et des approches non autorisees. Petrair SA rend son canal officiel clair et demande aux contreparties de verifier toute communication inattendue avant de partager documents ou informations bancaires.",
    "assurance.noticeTitle": "Avis de verification",
    "assurance.noticeText": "Petrair SA ne considere pas le contenu public du site comme une offre, un mandat, une allocation ou un engagement de transaction. Si un tiers pretend representer Petrair SA, verifiez directement via",
    "documents.eyebrow": "Centre documentaire",
    "documents.title": "Documents de reference pour contreparties qualifiees.",
    "documents.text": "Cette section accueillera les PDF officiels lorsqu'ils seront prets. D'ici la, les liens sont clairement marques comme demandes par email afin d'eviter les documents provisoires casses.",
    "corporate.eyebrow": "Informations corporate",
    "corporate.title": "Details de la societe genevoise enregistree.",
    "corporate.text": "Des informations claires sur la societe sont importantes pour la confiance, la due diligence et l'interpretation par l'IA et la recherche.",
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
    "hero.lead": "Petrair SA optimiza el suministro y la comercializacion de crudo y productos refinados desde Ginebra en Europa, el Mediterraneo, Africa y Oriente Medio.",
    "hero.cta1": "Solicitar cotizacion",
    "hero.cta2": "Como operamos",
    "prices.eyebrow": "Referencia de mercado",
    "prices.title": "Precios de referencia de crudo y productos refinados.",
    "prices.text": "Futuros front-month de los benchmarks contra los que opera Petrair SA. Las variaciones se miden frente al settlement previo o prior close del feed.",
    "products.eyebrow": "Productos y servicios",
    "products.title": "Nuestros productos y servicios de trading",
    "products.text1": "Petrair SA participa en el comercio internacional de crudo, productos petroliferos refinados y materias primas energeticas seleccionadas. La compania se centra en identificar, estructurar y ejecutar transacciones fisicas con contrapartes establecidas en mercados globales.",
    "products.text2": "Las actividades se guian por evaluacion comercial disciplinada, gestion prudente del riesgo y fuerte enfasis en la ejecucion y fiabilidad de las contrapartes. Combinando experiencia de mercado, agilidad comercial y estandares operativos profesionales, Petrair busca relaciones de trading a largo plazo y una plataforma escalable para flujos repetidos.",
    "products.text3": "El objetivo de la compania es establecer una presencia creible y sostenible en los mercados internacionales de energia mediante rendimiento comercial constante, disciplina operativa y crecimiento responsable.",
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
    "products.title": "Unsere Handelsprodukte und Dienstleistungen",
    "products.text1": "Petrair SA ist im internationalen Handel mit Rohol, raffinierten Erdolprodukten und ausgewahlten Energierohstoffen tatig. Das Unternehmen konzentriert sich auf die Identifizierung, Strukturierung und Ausfuhrung physischer Warentransaktionen mit etablierten Gegenparteien auf globalen Markten.",
    "products.text2": "Die Aktivitaten werden durch disziplinierte kommerzielle Bewertung, umsichtiges Risikomanagement und einen starken Fokus auf Transaktionsausfuhrung und Zuverlassigkeit der Gegenparteien geleitet.",
    "products.text3": "Ziel des Unternehmens ist es, durch bestandige kommerzielle Leistung, operative Disziplin und verantwortungsvolles Wachstum eine glaubwurdige und nachhaltige Prasenz auf internationalen Energiemarkten aufzubauen.",
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

const translationOverrides = {
  fr: {
    "nav.products": "Produits",
    "nav.prices": "Cours",
    "nav.operations": "Operations",
    "nav.compliance": "Conformite",
    "nav.documents": "Documents",
    "nav.language": "Langue",
    "nav.contact": "Contacter le desk",
    "hero.eyebrow": "Negoce physique depuis Geneve",
    "hero.title": "Un marche mondial pour le petrole et les produits energetiques.",
    "hero.lead": "Petrair SA optimise l'approvisionnement et la commercialisation de petrole brut et de produits raffines depuis Geneve en Europe, en Mediterranee, en Afrique et au Moyen-Orient.",
    "hero.cta1": "Demander une cotation",
    "hero.cta2": "Explorer notre trading",
    "prices.eyebrow": "Reference marche",
    "prices.title": "Prix de reference du brut et des produits raffines.",
    "prices.text": "Contrats a terme front-month pour les benchmarks utilises par Petrair SA. Les variations sont mesurees par rapport au previous settlement ou prior close fourni par le flux.",
    "prices.instrument": "Instrument",
    "prices.last": "Dernier prix",
    "prices.change": "Variation vs prior close",
    "prices.trend": "Tendance",
    "prices.type": "Type",
    "prices.foot": "Source : contrats front-month via le flux de marche public configure. Les prix sont en USD par unite indiquee. Les variations referencent le previous settlement ou prior close fourni par le flux. Indicatif, non negociable et pas une offre de transaction.",
    "products.eyebrow": "Notre offre",
    "products.title": "Nos produits et services de trading",
    "products.text1": "Petrair SA est engagee dans le negoce international de petrole brut, de produits petroliers raffines et de certaines commodites energetiques. La societe se concentre sur l'identification, la structuration et l'execution de transactions physiques avec des contreparties etablies sur les marches mondiaux.",
    "products.text2": "Les activites sont guidees par une evaluation commerciale disciplinee, une gestion prudente du risque et une forte attention a l'execution des transactions et a la fiabilite des contreparties. En combinant expertise de marche, agilite commerciale et standards operationnels professionnels, Petrair vise a construire des relations de trading durables et une plateforme scalable capable de soutenir des flux repetes sur plusieurs produits et juridictions.",
    "products.text3": "L'objectif de la societe est d'etablir une presence credible et durable sur les marches internationaux de l'energie grace a une performance commerciale constante, une discipline operationnelle et une croissance responsable.",
    "product.crude": "Petrole brut",
    "product.crudeText": "Origination et distribution de bruts legers doux et moyens soufres pour les systemes de raffinage et les canaux de trading.",
    "product.jetText": "Carburant aviation gere selon des specifications reconnues, une documentation controlee par banque et une inspection qualite independante.",
    "product.dieselText": "Diesel ultra-bas soufre, carburant automobile de haute qualite conforme a des standards environnementaux et de performance stricts.",
    "product.lpgText": "Gaz de petrole liquefie, combustible hydrocarbure polyvalent de propane et butane utilise dans de multiples secteurs.",
    "product.viewSpec": "Voir la specification",
    "supply.eyebrow": "Capacite chaine d'approvisionnement",
    "supply.title": "Acheminer les commodites physiques de facon sure, fiable et efficace.",
    "supply.text": "Petrair relie sourcing, coordination logistique, interface stockage, inspection, financement et documentation de livraison dans une histoire commerciale claire.",
    "reach.eyebrow": "Corridors operationnels",
    "reach.title": "Approvisionnement et commercialisation sur des routes energetiques etablies.",
    "reach.text": "Nous approvisionnons et commercialisons du petrole brut et des produits raffines a l'echelle mondiale, en coordonnant le transport maritime et la couverture produit depuis le desk de Geneve.",
    "ops.eyebrow": "Comment Petrair opere",
    "ops.title": "Trading, banque et inspection dans un processus controle.",
    "ops.text": "Les transactions sont traitees comme des operations physiques documentees. Origine, contrepartie, inspection, assurance et banque sont controles avant l'execution commerciale.",
    "contact.eyebrow": "Desk de trading",
    "contact.title": "Demander une cotation.",
    "contact.text": "Envoyez au desk une demande concise avec produit, quantite, lieu de livraison, calendrier et attentes de reglement. Le formulaire ouvre votre email afin qu'aucune donnee sensible ne soit stockee sur le site.",
    "form.product": "Produit",
    "form.quantity": "Quantite",
    "form.destination": "Destination",
    "form.company": "Societe",
    "form.name": "Votre nom",
    "form.email": "Email",
    "form.message": "Message",
    "form.submit": "Ouvrir l'email de demande",
    "footer.tagline": "Trading d'energie et de commodites depuis Geneve.",
    "footer.legal": "Copyright 2026 Petrair SA. Information uniquement. Pas une offre de transaction.",
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
    "hero.eyebrow": "Trading fisico desde Ginebra",
    "hero.title": "Un mercado global para petroleo y productos energeticos.",
    "hero.lead": "Petrair SA optimiza el suministro y la comercializacion de crudo y productos refinados desde Ginebra en Europa, el Mediterraneo, Africa y Oriente Medio.",
    "hero.cta1": "Solicitar cotizacion",
    "hero.cta2": "Explorar nuestro trading",
    "prices.eyebrow": "Referencia de mercado",
    "prices.title": "Precios de referencia de crudo y productos refinados.",
    "prices.text": "Futuros front-month de los benchmarks utilizados por Petrair SA. Las variaciones se miden frente al previous settlement o prior close del feed.",
    "prices.instrument": "Instrumento",
    "prices.last": "Ultimo precio",
    "prices.change": "Cambio vs prior close",
    "prices.trend": "Tendencia",
    "prices.type": "Tipo",
    "prices.foot": "Fuente: futuros front-month mediante el feed publico configurado. Los precios se muestran en USD por la unidad indicada. Las variaciones referencian el previous settlement o prior close del feed. Indicativo, no negociable y no constituye una oferta.",
    "products.eyebrow": "Nuestra oferta",
    "products.title": "Nuestros productos y servicios de trading",
    "products.text1": "Petrair SA participa en el comercio internacional de crudo, productos petroliferos refinados y materias primas energeticas seleccionadas. La compania se centra en identificar, estructurar y ejecutar transacciones fisicas con contrapartes establecidas en mercados globales.",
    "products.text2": "Las actividades se guian por evaluacion comercial disciplinada, gestion prudente del riesgo y fuerte enfasis en la ejecucion de transacciones y fiabilidad de las contrapartes. Combinando experiencia de mercado, agilidad comercial y estandares operativos profesionales, Petrair busca relaciones de trading a largo plazo y una plataforma escalable capaz de sostener flujos repetidos en multiples productos y jurisdicciones.",
    "products.text3": "El objetivo de la compania es establecer una presencia creible y sostenible en los mercados internacionales de energia mediante rendimiento comercial constante, disciplina operativa y crecimiento responsable.",
    "product.crude": "Crudo",
    "product.crudeText": "Originacion y distribucion de crudos dulces ligeros y medios agrios para sistemas de refino y canales de trading.",
    "product.jetText": "Combustible de turbina de aviacion gestionado contra especificaciones reconocidas, documentacion bancaria e inspeccion independiente.",
    "product.dieselText": "Diesel ultra bajo en azufre, combustible automotriz de alta calidad conforme a estrictos estandares ambientales y de rendimiento.",
    "product.lpgText": "Gas licuado de petroleo, combustible versatil de propano y butano utilizado en multiples sectores.",
    "product.viewSpec": "Ver especificacion",
    "supply.eyebrow": "Capacidad de cadena de suministro",
    "supply.title": "Mover commodities fisicas de forma segura, fiable y eficiente.",
    "supply.text": "Petrair conecta abastecimiento, coordinacion logistica, planificacion de almacenamiento, inspeccion, financiacion y documentacion de entrega en una historia comercial clara.",
    "reach.eyebrow": "Corredores operativos",
    "reach.title": "Suministro y comercializacion en rutas energeticas establecidas.",
    "reach.text": "Suministramos y comercializamos crudo y productos de refino globalmente, coordinando transporte maritimo y cobertura de producto desde la mesa de Ginebra.",
    "ops.eyebrow": "Como opera Petrair",
    "ops.title": "Trading, banca e inspeccion bajo un proceso controlado.",
    "ops.text": "Las transacciones se tratan como operaciones fisicas documentadas. Origen del producto, contraparte, inspeccion, seguro y banca se revisan antes de avanzar.",
    "compliance.eyebrow": "Cumplimiento y riesgo",
    "compliance.title": "Estandares estrictos para contrapartes serias.",
    "compliance.text": "El sitio evita promesas publicas de precio u ofertas abiertas. Toda conversacion comercial queda sujeta a diligencia debida, disponibilidad de producto, documentacion, controles de sanciones y terminos contractuales finales.",
    "assurance.eyebrow": "Garantia de contraparte",
    "assurance.title": "Canales oficiales y verificacion de mandatos.",
    "assurance.text": "El trading energetico atrae falsas reclamaciones de mandato y contactos no autorizados. Petrair SA muestra claramente su canal oficial y pide verificar cualquier comunicacion inesperada antes de compartir documentos o datos bancarios.",
    "assurance.noticeTitle": "Aviso de verificacion",
    "assurance.noticeText": "Petrair SA no considera el contenido publico del sitio como oferta, mandato, asignacion o compromiso de transaccion. Si un tercero afirma representar a Petrair SA, verifique directamente por",
    "documents.eyebrow": "Centro documental",
    "documents.title": "Documentos de referencia para contrapartes cualificadas.",
    "documents.text": "Esta seccion alojara PDFs oficiales cuando esten listos. Mientras tanto, los enlaces estan marcados como solicitud por email para evitar documentos provisionales rotos.",
    "corporate.eyebrow": "Informacion corporativa",
    "corporate.title": "Datos de la sociedad registrada en Ginebra.",
    "corporate.text": "Los datos claros de la compania son importantes para confianza, diligencia debida e interpretacion por IA y busqueda.",
    "contact.eyebrow": "Mesa de trading",
    "contact.title": "Solicitar una cotizacion.",
    "contact.text": "Envie a la mesa una consulta concisa con producto, cantidad, destino, calendario y expectativas de liquidacion. El formulario abre su email para que no se almacenen datos sensibles en el sitio.",
    "form.product": "Producto",
    "form.quantity": "Cantidad",
    "form.destination": "Destino",
    "form.company": "Empresa",
    "form.name": "Su nombre",
    "form.email": "Email",
    "form.message": "Mensaje",
    "form.submit": "Abrir consulta por email",
    "footer.tagline": "Trading de energia y commodities desde Ginebra.",
    "footer.legal": "Copyright 2026 Petrair SA. Solo informacion. No es una oferta para transaccion.",
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
    "hero.eyebrow": "Physischer Handel aus Genf",
    "hero.title": "Ein globaler Markt fur Ol und Energieprodukte.",
    "hero.lead": "Petrair SA optimiert die Beschaffung und Vermarktung von Rohol und raffinierten Produkten von Genf aus in Europa, im Mittelmeerraum, in Afrika und im Nahen Osten.",
    "hero.cta1": "Angebot anfragen",
    "hero.cta2": "Handel ansehen",
    "prices.eyebrow": "Marktreferenz",
    "prices.title": "Referenzpreise fur Rohol und Raffinerieprodukte.",
    "prices.text": "Front-month-Futures fur die Benchmarks, gegen die Petrair SA handelt. Anderungen werden gegen das vorherige Settlement oder den vorherigen Schlusskurs des Feeds gemessen.",
    "prices.instrument": "Instrument",
    "prices.last": "Letzter Preis",
    "prices.change": "Anderung gg. Vortagesschluss",
    "prices.trend": "Trend",
    "prices.type": "Typ",
    "prices.foot": "Quelle: Front-month-Futures uber den konfigurierten offentlichen Marktdatenfeed. Preise in USD je angegebener Einheit. Anderungen beziehen sich auf das vom Feed gelieferte vorherige Settlement oder den vorherigen Schlusskurs. Indikativ, nicht handelbar und kein Transaktionsangebot.",
    "products.eyebrow": "Unser Angebot",
    "products.title": "Unsere Handelsprodukte und Dienstleistungen",
    "products.text1": "Petrair SA ist im internationalen Handel mit Rohol, raffinierten Erdolprodukten und ausgewahlten Energierohstoffen tatig. Das Unternehmen konzentriert sich auf die Identifizierung, Strukturierung und Ausfuhrung physischer Warentransaktionen mit etablierten Gegenparteien auf globalen Markten.",
    "products.text2": "Die Aktivitaten werden durch disziplinierte kommerzielle Bewertung, umsichtiges Risikomanagement und einen starken Fokus auf Transaktionsausfuhrung und Zuverlassigkeit der Gegenparteien geleitet. Durch die Kombination von Marktkenntnis, kommerzieller Agilitat und professionellen Betriebsstandards strebt Petrair langfristige Handelsbeziehungen und eine skalierbare Plattform fur wiederkehrende Transaktionsflusse uber mehrere Produkte und Rechtsordnungen an.",
    "products.text3": "Ziel des Unternehmens ist es, durch bestandige kommerzielle Leistung, operative Disziplin und verantwortungsvolles Wachstum eine glaubwurdige und nachhaltige Prasenz auf internationalen Energiemarkten aufzubauen.",
    "product.crude": "Rohol",
    "product.crudeText": "Origination und Distribution leichter susslicher und mittelschwerer saurer Roholstrome fur Raffineriesysteme und Handelskanale.",
    "product.jetText": "Flugturbinenkraftstoff nach anerkannten Spezifikationen, bankkontrollierter Dokumentation und unabhangiger Qualitatsinspektion.",
    "product.dieselText": "Ultra-schwefelarmer Diesel, ein hochwertiger Automobildiesel mit strengen Umwelt- und Leistungsstandards.",
    "product.lpgText": "Flussiggas, ein vielseitiger Kohlenwasserstoff aus Propan und Butan fur zahlreiche Sektoren weltweit.",
    "product.viewSpec": "Spezifikation ansehen",
    "supply.eyebrow": "Lieferkettenfahigkeit",
    "supply.title": "Physische Rohstoffe sicher, zuverlassig und effizient bewegen.",
    "supply.text": "Petrair verbindet Beschaffung, Logistikkoordination, Lager- und Schnittstellenplanung, Inspektion, Finanzierung und Lieferdokumentation zu einer klaren kommerziellen Geschichte.",
    "reach.eyebrow": "Operative Korridore",
    "reach.title": "Beschaffung und Vermarktung uber etablierte Energierouten.",
    "reach.text": "Wir beschaffen und vermarkten Rohol und Raffinerieprodukte weltweit und koordinieren Seetransport und Produktabdeckung uber den Genfer Desk.",
    "ops.eyebrow": "So arbeitet Petrair",
    "ops.title": "Handel, Bankabwicklung und Inspektion in einem kontrollierten Prozess.",
    "ops.text": "Transaktionen werden als dokumentierte physische Operationen behandelt. Produktursprung, Gegenpartei, Inspektion, Versicherung und Bankwege werden vor der kommerziellen Ausfuhrung gepruft.",
    "compliance.eyebrow": "Compliance und Risiko",
    "compliance.title": "Strenge Standards fur seriose Gegenparteien.",
    "compliance.text": "Die Website vermeidet offentliche Preisversprechen oder offene Angebote. Alle kommerziellen Gesprache bleiben vorbehaltlich Due Diligence, Produktverfugbarkeit, Dokumentation, Sanktionskontrollen und finaler Vertragsbedingungen.",
    "assurance.eyebrow": "Gegenparteienabsicherung",
    "assurance.title": "Offizielle Kanale und Mandatsprufung.",
    "assurance.text": "Energiehandel zieht falsche Mandatsbehauptungen und unautorisierte Ansprachen an. Petrair SA macht den offiziellen Kontaktweg klar und bittet Gegenparteien, unerwartete Kommunikation zu prufen, bevor Dokumente oder Bankdaten geteilt werden.",
    "assurance.noticeTitle": "Prufhinweis",
    "assurance.noticeText": "Petrair SA behandelt offentliche Website-Inhalte nicht als Angebot, Mandat, Allokation oder Transaktionsverpflichtung. Wenn ein Dritter behauptet, Petrair SA zu vertreten, verifizieren Sie direkt uber",
    "documents.eyebrow": "Dokumentencenter",
    "documents.title": "Referenzdokumente fur qualifizierte Gegenparteien.",
    "documents.text": "Dieser Bereich enthalt offizielle PDFs, sobald sie bereit sind. Bis dahin sind Links klar als E-Mail-Anfrage markiert, damit Besucher keine kaputten Platzhalter offnen.",
    "corporate.eyebrow": "Unternehmensinformationen",
    "corporate.title": "Registrierte Genfer Unternehmensdaten.",
    "corporate.text": "Klare Unternehmensdaten sind wichtig fur Vertrauen, Due Diligence und Interpretation durch KI und Suche.",
    "contact.eyebrow": "Trading Desk",
    "contact.title": "Angebot anfragen.",
    "contact.text": "Senden Sie dem Desk eine kurze Anfrage mit Produkt, Menge, Lieferort, Zeitplan und Abwicklungserwartungen. Das Formular offnet Ihr E-Mail-Programm, damit keine sensiblen Daten auf der Website gespeichert werden.",
    "form.product": "Produkt",
    "form.quantity": "Menge",
    "form.destination": "Zielort",
    "form.company": "Unternehmen",
    "form.name": "Ihr Name",
    "form.email": "E-Mail",
    "form.message": "Nachricht",
    "form.submit": "E-Mail-Anfrage offnen",
    "footer.tagline": "Energie- und Rohstoffhandel aus Genf.",
    "footer.legal": "Copyright 2026 Petrair SA. Nur Information. Kein Transaktionsangebot.",
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
    "hero.eyebrow": "تداول فعلي للطاقة من جنيف",
    "hero.title": "سوق عالمي للنفط ومنتجات الطاقة.",
    "hero.lead": "تعمل Petrair SA على تحسين توريد وتسويق النفط الخام والمنتجات المكررة من جنيف عبر أوروبا والبحر المتوسط وأفريقيا والشرق الأوسط.",
    "hero.cta1": "طلب عرض سعر",
    "hero.cta2": "استكشف التداول",
    "prices.eyebrow": "مرجع السوق",
    "prices.title": "أسعار مرجعية للنفط الخام والمنتجات المكررة.",
    "prices.text": "عقود آجلة للشهر الأقرب للمؤشرات التي تستخدمها Petrair SA. تقاس التغيرات مقابل التسوية السابقة أو الإغلاق السابق من المزود.",
    "prices.instrument": "الأداة",
    "prices.last": "آخر سعر",
    "prices.change": "التغير مقابل الإغلاق السابق",
    "prices.trend": "الاتجاه",
    "prices.type": "النوع",
    "prices.foot": "المصدر: عقود آجلة للشهر الأقرب عبر مزود سوق عام مهيأ. الأسعار بالدولار الأمريكي حسب الوحدة المذكورة. التغيرات مقابل التسوية السابقة أو الإغلاق السابق من المزود. معلومات إرشادية فقط وليست عرضا للتعامل.",
    "products.eyebrow": "عرضنا",
    "products.title": "منتجات وخدمات التداول لدينا",
    "products.text1": "تعمل Petrair SA في التداول الدولي للنفط الخام والمنتجات البترولية المكررة وسلع طاقة مختارة. تركز الشركة على تحديد وهيكلة وتنفيذ معاملات السلع الفعلية مع أطراف مقابلة راسخة في الأسواق العالمية.",
    "products.text2": "تسترشد الأنشطة بتقييم تجاري منضبط وإدارة مخاطر حذرة وتركيز قوي على تنفيذ المعاملات وموثوقية الأطراف المقابلة. ومن خلال الجمع بين خبرة السوق والمرونة التجارية والمعايير التشغيلية المهنية، تهدف Petrair إلى بناء علاقات تداول طويلة الأجل ومنصة قابلة للتوسع تدعم تدفق معاملات متكرر عبر منتجات وولايات متعددة.",
    "products.text3": "هدف الشركة هو ترسيخ حضور موثوق ومستدام في أسواق الطاقة الدولية من خلال أداء تجاري ثابت وانضباط تشغيلي ونمو مسؤول.",
    "product.crude": "النفط الخام",
    "product.crudeText": "توريد وتوزيع خامات خفيفة حلوة ومتوسطة حامضة لأنظمة التكرير وقنوات التداول.",
    "product.jetText": "وقود توربينات طيران وفق مواصفات معترف بها ووثائق مصرفية ورقابة جودة مستقلة.",
    "product.dieselText": "ديزل منخفض الكبريت جدا عالي الجودة يفي بمعايير بيئية وأدائية صارمة.",
    "product.lpgText": "غاز بترولي مسال، وقود هيدروكربوني متعدد الاستخدامات من البروبان والبيوتان لقطاعات متعددة.",
    "product.viewSpec": "عرض المواصفة",
    "supply.eyebrow": "قدرات سلسلة الإمداد",
    "supply.title": "نقل السلع الفعلية بأمان وموثوقية وكفاءة.",
    "supply.text": "تجمع Petrair بين التوريد والتنسيق اللوجستي والتخزين والتفتيش والتمويل ووثائق التسليم في مسار تجاري واضح.",
    "reach.eyebrow": "ممرات التشغيل",
    "reach.title": "توريد وتسويق عبر طرق طاقة راسخة.",
    "reach.text": "نوفر ونسوق النفط الخام ومنتجات التكرير عالميا مع تنسيق النقل البحري وتغطية المنتجات من مكتب جنيف.",
    "ops.eyebrow": "كيف تعمل Petrair",
    "ops.title": "تداول وبنوك وتفتيش ضمن عملية مضبوطة.",
    "ops.text": "تعامل المعاملات كعمليات فعلية موثقة، ويتم فحص أصل المنتج وحالة الطرف المقابل والتفتيش والتأمين والخطوات المصرفية قبل التنفيذ التجاري.",
    "compliance.eyebrow": "الامتثال والمخاطر",
    "compliance.title": "معايير صارمة للأطراف الجادة.",
    "compliance.text": "يتجنب الموقع أي وعود سعرية عامة أو عروض مفتوحة. وتظل كل المناقشات التجارية خاضعة للعناية الواجبة وتوافر المنتج والوثائق وضوابط العقوبات والشروط النهائية للعقد.",
    "assurance.eyebrow": "ضمان الطرف المقابل",
    "assurance.title": "القنوات الرسمية والتحقق من التفويض.",
    "assurance.text": "يجذب تداول الطاقة ادعاءات تفويض كاذبة واتصالات غير مصرح بها. توضح Petrair SA قناة الاتصال الرسمية وتطلب التحقق من أي تواصل غير متوقع قبل مشاركة المستندات أو المعلومات المصرفية.",
    "assurance.noticeTitle": "إشعار تحقق",
    "assurance.noticeText": "لا تعتبر Petrair SA محتوى الموقع العام عرضا أو تفويضا أو تخصيصا أو التزاما بالتعامل. إذا ادعى طرف ثالث تمثيل Petrair SA، فتحقق مباشرة عبر",
    "documents.eyebrow": "مركز المستندات",
    "documents.title": "مستندات مرجعية للأطراف المؤهلة.",
    "documents.text": "سيستخدم هذا القسم للملفات الرسمية عندما تكون جاهزة. وحتى ذلك الحين، تكون الروابط محددة بوضوح كطلبات عبر البريد الإلكتروني لتجنب مستندات مؤقتة غير عاملة.",
    "corporate.eyebrow": "معلومات الشركة",
    "corporate.title": "تفاصيل شركة جنيف المسجلة.",
    "corporate.text": "تفاصيل الشركة الواضحة مهمة للثقة والعناية الواجبة وفهم البحث والذكاء الاصطناعي.",
    "contact.eyebrow": "مكتب التداول",
    "contact.title": "طلب عرض سعر.",
    "contact.text": "أرسل طلبا موجزا يتضمن المنتج والكمية ومكان التسليم والتوقيت وتوقعات التسوية. يفتح النموذج بريدك الإلكتروني حتى لا تخزن بيانات حساسة على الموقع.",
    "form.product": "المنتج",
    "form.quantity": "الكمية",
    "form.destination": "الوجهة",
    "form.company": "الشركة",
    "form.name": "اسمك",
    "form.email": "البريد الإلكتروني",
    "form.message": "الرسالة",
    "form.submit": "فتح طلب البريد",
    "footer.tagline": "تداول الطاقة والسلع من جنيف.",
    "footer.legal": "حقوق النشر 2026 Petrair SA. معلومات فقط وليست عرضا للتعامل.",
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
    "hero.title": "石油和能源产品的全球市场。",
    "hero.lead": "Petrair SA 从日内瓦优化原油和精炼产品在欧洲、地中海、非洲和中东的供应与营销。",
    "hero.cta1": "请求报价",
    "hero.cta2": "了解交易",
    "prices.eyebrow": "市场参考",
    "prices.title": "原油和精炼产品参考价格。",
    "prices.text": "Petrair SA 参考的近月期货基准。涨跌幅相对于数据源提供的前结算价或前收盘价。",
    "prices.instrument": "工具",
    "prices.last": "最新价格",
    "prices.change": "较前收盘变化",
    "prices.trend": "趋势",
    "prices.type": "类型",
    "prices.foot": "来源：通过已配置公共市场数据源获取近月期货。价格以所列单位的美元计价。变化参考数据源提供的前结算价或前收盘价。仅供参考，不可交易，也不构成交易要约。",
    "products.eyebrow": "我们的服务",
    "products.title": "我们的交易产品和服务",
    "products.text1": "Petrair SA 从事原油、精炼石油产品和部分能源商品的国际贸易。公司专注于与全球市场中成熟的交易对手识别、组织并执行实物商品交易。",
    "products.text2": "公司活动以严格的商业评估、审慎的风险管理以及对交易执行和交易对手可靠性的高度重视为指导。Petrair 结合市场专业知识、商业灵活性和专业运营标准，旨在建立长期交易关系，并形成可支持多个产品和司法辖区重复交易流的平台。",
    "products.text3": "公司的目标是通过稳定的商业表现、运营纪律和负责任的增长，在国际能源市场建立可信且可持续的地位。",
    "product.crude": "原油",
    "product.crudeText": "为炼厂体系和交易渠道组织并分销轻质低硫及中质含硫原油。",
    "product.jetText": "航空涡轮燃料按公认规格、银行控制文件和独立质量检验处理。",
    "product.dieselText": "超低硫柴油，高质量车用柴油，符合严格的环保和性能标准。",
    "product.lpgText": "液化石油气，由丙烷和丁烷构成的多用途烃类燃料，应用于多个行业。",
    "product.viewSpec": "查看规格",
    "supply.eyebrow": "供应链能力",
    "supply.title": "安全、可靠、高效地移动实物商品。",
    "supply.text": "Petrair 将采购、物流协调、仓储接口、检验、融资和交付文件整合为清晰的商业流程。",
    "reach.eyebrow": "运营通道",
    "reach.title": "沿成熟能源路线进行供应和营销。",
    "reach.text": "我们在全球供应和销售原油及炼油产品，并通过日内瓦交易台协调海运和产品覆盖。",
    "ops.eyebrow": "Petrair 的运营方式",
    "ops.title": "在受控流程下进行交易、银行和检验。",
    "ops.text": "交易被视为有文件支持的实物操作。在商业执行前会检查产品来源、交易对手状态、检验、保险和银行步骤。",
    "compliance.eyebrow": "合规与风险",
    "compliance.title": "面向严肃交易对手的严格标准。",
    "compliance.text": "网站避免公开价格承诺或开放式要约。所有商业讨论均取决于尽职调查、产品可用性、文件、制裁控制和最终合同条款。",
    "assurance.eyebrow": "交易对手保障",
    "assurance.title": "官方渠道和授权核验。",
    "assurance.text": "能源交易容易出现虚假授权声明和未经授权的接触。Petrair SA 明确官方联系方式，并要求交易对手在分享文件或银行信息前核验任何意外通信。",
    "assurance.noticeTitle": "核验通知",
    "assurance.noticeText": "Petrair SA 不将公开网站内容视为要约、授权、配额或交易承诺。如第三方声称代表 Petrair SA，请直接通过以下邮箱核验：",
    "documents.eyebrow": "文件中心",
    "documents.title": "面向合格交易对手的参考文件。",
    "documents.text": "正式 PDF 准备好后将放在此处。在此之前，链接明确标注为通过电子邮件索取，避免访问无效占位文件。",
    "corporate.eyebrow": "公司信息",
    "corporate.title": "日内瓦注册公司详情。",
    "corporate.text": "清晰的公司详情有助于信任、尽职调查以及搜索和 AI 理解。",
    "contact.eyebrow": "交易台",
    "contact.title": "请求报价。",
    "contact.text": "请向交易台发送简明询盘，包括产品、数量、交付地点、时间和结算预期。表单会打开您的电子邮件，因此网站不会存储敏感数据。",
    "form.product": "产品",
    "form.quantity": "数量",
    "form.destination": "目的地",
    "form.company": "公司",
    "form.name": "您的姓名",
    "form.email": "电子邮件",
    "form.message": "留言",
    "form.submit": "打开邮件询盘",
    "footer.tagline": "来自日内瓦的能源和商品交易。",
    "footer.legal": "版权所有 2026 Petrair SA。仅供参考，不构成交易要约。",
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
    title: "ULSD 10ppm",
    body: "Ultra Low Sulphur Diesel meeting stringent automotive, environmental and performance standards for European, Mediterranean and West African networks.",
    rows: [
      ["Cetane number", "Min 51.0"],
      ["Density at 15C", "820.0-845.0 kg/m3"],
      ["Sulphur", "Max 10.0 mg/kg"],
      ["Flash point", "Above 55C"],
      ["FAME content", "Max 7.0% v/v"]
    ]
  },
  lpg: {
    eyebrow: "Liquefied petroleum gas",
    title: "LPG",
    body: "Liquefied Petroleum Gas, principally propane and butane, used across residential, industrial, transport and petrochemical sectors worldwide.",
    rows: [
      ["Product", "Propane, butane or LPG mix"],
      ["Storage", "Pressurised or refrigerated terminal infrastructure"],
      ["Use", "Heating, industry, transport and petrochemical feedstock"],
      ["Controls", "Quality, quantity and documentation by contract"],
      ["Execution", "Subject to origin, terminal, vessel and banking review"]
    ]
  }
};

const instruments = [
  { id: "brent", symbol: "CB.F", name: "ICE Brent Crude", sub: "Front-month futures", live: true, seed: 82.44, unit: "USD/bbl", decimals: 2 },
  { id: "wti", symbol: "CL.F", name: "NYMEX WTI Crude", sub: "Front-month futures", live: true, seed: 77.91, unit: "USD/bbl", decimals: 2 },
  { id: "ulsdHarbor", symbol: "HO.F", name: "ULSD NY Harbor", sub: "Front-month futures", live: true, seed: 2.55, unit: "USD/gal", decimals: 3 },
  { id: "rbobGasoline", symbol: "RB.F", name: "RBOB Gasoline", sub: "Front-month futures", live: true, seed: 2.48, unit: "USD/gal", decimals: 3 },
  { id: "naturalGas", symbol: "NG.F", name: "Natural Gas (Henry Hub)", sub: "Front-month futures", live: true, seed: 3.21, unit: "USD/MMBtu", decimals: 2 }
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
  const dictionary = translationOverrides[lang] || translations[lang] || {};
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

const revealTargets = document.querySelectorAll(".section-head, .product-card, .price-board, .capability-grid article, .process-list div, .map-band, .checks div, .doc-grid a, .rfq-form");
revealTargets.forEach((element) => element.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("in-view"));
}

function playClickSound() {
  try {
    clickAudioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = clickAudioContext.currentTime;
    const oscillator = clickAudioContext.createOscillator();
    const gain = clickAudioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(640, now);
    oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    oscillator.connect(gain);
    gain.connect(clickAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.12);
  } catch {}
}

document.addEventListener("click", (event) => {
  const target = event.target.closest?.("a, button, select, input, textarea");
  if (target && !target.closest("#language-select")) playClickSound();
});

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
    symbol.textContent = instrument.symbol;
    const sub = document.createElement("small");
    sub.textContent = `${instrument.name} / ${instrument.unit}`;
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
    tag.className = "price-tag";
    tag.textContent = "Live";
    type.append(tag);

    row.append(symbol, last, change, trend, type);
    rows.append(row);
  }
}

function formatPrice(instrument, state) {
  return `${state.price.toFixed(instrument.decimals)} ${instrument.unit}`;
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
    name.textContent = instrument.symbol;
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
    const last = row.querySelector('[data-field="last"]');
    const change = row.querySelector('[data-field="change"]');
    const trend = row.querySelector('[data-field="trend"]');

    last.textContent = formatPrice(instrument, state);
    change.className = `price-change ${changeData.rising ? "up" : "down"}`;
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

    for (const id of instruments.map((instrument) => instrument.id)) {
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
